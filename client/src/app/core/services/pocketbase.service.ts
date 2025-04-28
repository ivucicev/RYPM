import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import PocketBase, { RecordModel } from 'pocketbase';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast-service';
import { User } from '../models/user';
import { Workout } from '../models/workout';
import { Day } from '../models/day';
import { Week } from '../models/week';
import { Set } from '../models/exercise-set';
import { Exercise } from '../models/exercise';
import { Program } from '../models/program';
import { Template } from '../models/template';
import { PB } from '../constants/pb-constants';
import { Collection, COLLECTIONS } from '../constants/collections';

@Injectable({
    providedIn: 'root'
})
export class PocketbaseService {

    private readonly updateNestedOptions = { headers: PB.HEADER.NO_TOAST };

    /**
     * Mapping of collection relationships.
     * Defines which arrays should be treated as references to collections vs JSON/primitive fields
     */
    private collectionMappings: Record<Collection, Collection[]> = {
        'workouts': ['exercises'],
        'exercises': ['sets'],
        'programs': ['weeks'],
        'weeks': ['days'],

        // no collection, all json or primitive
        'days': [],
        'templates': [],
        'sets': [],
        'users': [],
    };

    pb: PocketBase = new PocketBase(environment.apiURL);
    currentUser: User;

    constructor(
        private translateService: TranslateService,
        private toastService: ToastService
    ) {
        this.init();
    }

    init() {
        if (this.pb.authStore.isValid) {
            if (!this.pb.authStore.record?.expand) {
                this.pb.collection('users').getOne<User>(this.pb.authStore.record?.id).then(u => {
                    this.currentUser = u;
                });
            } else {
                this.currentUser = this.pb.authStore.record as any;
            }
        }

        this.pb.afterSend = (response, data, options?: any) => {
            if (options && options.headers && options.headers.notoast) return data;

            if (response.status != 200) {
                switch (response.status) {
                    case 400:
                        let messages = '';
                        if (data.data)
                            Object.keys(data.data).forEach(key => {
                                const d = data.data as { code: string, message: string };
                                messages += this.translateService.instant((key.charAt(0).toUpperCase() + key.slice(1)) + " - " + data.data[key].message) + ' ';
                            })
                        this.toastService.error(data?.message + ' ' + messages);
                        break;

                    case 500:
                        this.toastService.error('errors.unexpected_error');
                        break;
                    default:
                        break;
                }
            } else if (options?.method == "POST" || options?.method == "PATCH" || options?.method == "DELETE") {
                this.toastService.success();
            }

            if (response.status == 200) {
                const mapped = this.mapRecordModel(data);
                console.log('Fetched & mapped', mapped);
                return mapped;
            }

            return data;
        };

        this.pb.beforeSend = async (url, options) => {
            if (this.currentUser) {
                if (options.body) {
                    options.body.user = this.currentUser.id;
                }
            }
            return { url, options }
        }
    }

    public registerAfterSendCallback(callback: (response: any, data: any, options?: any) => void) {
        const defaultCallback = this.pb.afterSend;
        this.pb.afterSend = (response, data, options?: any) => {
            callback(response, data, options);
            return defaultCallback(response, data, options);
        }
    }

    //#region Collections
    public get users() {
        return this.pb.collection<User>(COLLECTIONS.users);
    }

    public get programs() {
        return this.pb.collection<Program>(COLLECTIONS.programs);
    }

    public get templates() {
        return this.pb.collection<JsonModel<Template, 'exercises'>>(COLLECTIONS.templates);
    }

    public get exercises() {
        return this.pb.collection<Exercise>(COLLECTIONS.exercises);
    }

    public get sets() {
        return this.pb.collection<Set>(COLLECTIONS.sets);
    }

    public get weeks() {
        return this.pb.collection<Week>(COLLECTIONS.weeks);
    }

    public get days() {
        return this.pb.collection<JsonModel<Day, 'exercises'>>(COLLECTIONS.days);
    }

    public get workouts() {
        return this.pb.collection<Workout>(COLLECTIONS.workouts);
    }
    //#endregion


    /**
     * Maps returned {@link RecordModel} object to a more usable type format.
     *
     * E.g. object
     *
     * `{ id: '1', exercises: [1], expand: exercises: [{ id: '1', name: 'Bench Press' }] }`
     *
     * becomes
     *
     * `{ id: '1', exercises: [{ id: '1', name: 'Bench Press' }] }`
     * @param obj
     * @returns
     */
    mapRecordModel<T extends { expand?: Record<string, unknown> }>(obj: T): ExpandedResult<T> {
        if (typeof obj !== 'object' || obj === null) {
            return obj as ExpandedResult<T>;
        }

        const result = { ...obj } as any;

        // process `expand` property
        if (result.expand && typeof result.expand === 'object') {
            const expand = result.expand as Record<string, unknown>;

            Object.keys(expand).forEach((key) => {
                if (key in result) {
                    const expandedValue = expand[key];
                    result[key] = expandedValue;
                }
            });

            delete result.expand;
        }

        // recursive process
        Object.keys(result).forEach((key) => {
            const value = result[key];
            if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                    result[key] = value.map(item =>
                        typeof item === 'object' && item !== null
                            ? this.mapRecordModel(item)
                            : item
                    );
                } else {
                    result[key] = this.mapRecordModel(value);
                }
            }
        });

        return result as ExpandedResult<T>;
    }


    // TODO: improve `disableAutoCancel` logic: unnecessary requests?
    /**
     * Recursively upserts a record and its nested collections
     * @param collectionName Name of the collection for this record
     * @param data Record data including any nested collections as arrays of objects
     * @returns The created/updated record
     */
    async upsertRecord<T = any>(
        collectionName: Collection,
        data: T | any,
        showToast: boolean = true,
        disableAutoCancel: boolean = false,
        depth: number = 0,
    ): Promise<RecordModel> {
        const recordData = JSON.parse(JSON.stringify(data));

        const recordId = recordData.id && recordData.id !== "" ? recordData.id : null;
        delete recordData.id;

        const { collections, jsonFields } = this.separateCollectionsAndJsonFields(
            collectionName,
            recordData
        );
        Object.assign(recordData, jsonFields);

        // create/update the main record
        let result: RecordModel;
        if (recordId) {
            result = await this.pb.collection(collectionName).update(
                recordId,
                recordData,
                {
                    ...this.updateNestedOptions,
                    requestKey: disableAutoCancel ? null : undefined
                }
            );
        } else {
            result = await this.pb.collection(collectionName).create(
                recordData,
                {
                    ...this.updateNestedOptions,
                    requestKey: disableAutoCancel ? null : undefined
                }
            );
        }

        // process collection references
        const childReferences = {};
        for (const [collectionKey, items] of Object.entries(collections)) {
            if (!Array.isArray(items) || items.length === 0) continue;

            childReferences[collectionKey] = [];

            for (const item of items as any[]) {
                if (item.id === "") {
                    delete item.id;
                }

                // parent ref
                const parentField = this.getSingularName(collectionName);
                item[parentField] = result['id'];

                // process child item
                let itemResult;
                if (item.id) {
                    const itemId = item.id;
                    delete item.id; // remove ID from payload
                    itemResult = await this.pb.collection(collectionKey).update(
                        itemId,
                        item,
                        {
                            ...this.updateNestedOptions,
                            requestKey: disableAutoCancel ? null : undefined
                        }
                    );
                } else {
                    itemResult = await this.pb.collection(collectionKey).create(
                        item,
                        {
                            ...this.updateNestedOptions,
                            requestKey: disableAutoCancel ? null : undefined
                        }
                    );
                }

                childReferences[collectionKey].push(itemResult.id);

                // check for nested
                const { collections: nestedCollections } = this.separateCollectionsAndJsonFields(
                    collectionKey,
                    item
                );
                if (Object.keys(nestedCollections).length > 0) {
                    const nestedRefs = {};

                    for (const [nestedKey, nestedItems] of Object.entries(nestedCollections)) {
                        nestedRefs[nestedKey] = [];

                        for (const nestedItem of nestedItems as any[]) {
                            const nestedParentField = this.getSingularName(collectionKey);
                            nestedItem[nestedParentField] = itemResult.id;

                            const nestedResult = await this.upsertRecord(nestedKey as Collection, nestedItem, false, disableAutoCancel, depth + 1);
                            nestedRefs[nestedKey].push(nestedResult.id);
                        }
                    }

                    if (Object.keys(nestedRefs).length > 0) {
                        await this.pb.collection(collectionKey).update(
                            itemResult.id,
                            nestedRefs,
                            {
                                ...this.updateNestedOptions,
                                requestKey: disableAutoCancel ? null : undefined
                            }
                        );
                    }
                }
            }
        }

        // update parent with references to children
        if (Object.keys(childReferences).length > 0) {
            await this.pb.collection(collectionName).update(
                result['id'],
                childReferences,
                {
                    ...this.updateNestedOptions,
                    requestKey: disableAutoCancel ? null : undefined
                }
            );
        }

        if (depth === 0 && showToast) {
            this.toastService.success();
        }

        return result;
    }

    /**
     * Separates collections from JSON fields based on the collection mapping
     */
    private separateCollectionsAndJsonFields(collectionName: string, data: any): {
        collections: Record<string, any[]>,
        jsonFields: Record<string, any>
    } {
        const collections: Record<string, any[]> = {};
        const jsonFields: Record<string, any> = {};

        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key]) && data[key].length > 0 &&
                typeof data[key][0] === 'object') {

                const isCollection = this.collectionMappings[collectionName]?.includes(key);

                if (isCollection) {
                    // collection relationship - process separately
                    collections[key] = data[key];
                } else {
                    // JSON field - keep it with the main record
                    jsonFields[key] = data[key];
                }
            } else {
                // regular field
                jsonFields[key] = data[key];
            }
        });

        return { collections, jsonFields };
    }

    private getSingularName(collectionName: string): string {
        if (collectionName.endsWith('ies')) {
            return collectionName.slice(0, -3) + 'y';
        }
        if (collectionName.endsWith('s')) {
            return collectionName.slice(0, -1);
        }

        return collectionName;
    }
}

type Model<T> = {
    [K in keyof T]: T[K] extends (infer U)[]
    ? U extends object
    ? string[]    // Replace object arrays with string IDs
    : T[K]        // Keep primitive arrays as-is
    : T[K];       // Non-array properties remain unchanged
} & {
    expand?: {
        [K in keyof T as T[K] extends (infer U)[]
        ? U extends object
        ? K               // Only include keys that were object arrays
        : never
        : never]?: T[K];  // Original array type in expand
    };
};

type JsonModel<T, K extends keyof T> = {
    [P in keyof T]: P extends K
    ? T[P]       // Preserve original type for specified keys
    : T[P] extends (infer U)[]
    ? U extends object
    ? string[]   // Convert object arrays to string IDs
    : T[P]       // Preserve primitive arrays
    : T[P];      // Non-array properties remain
} & {
    expand?: {
        [P in Exclude<keyof T, K> as T[P] extends (infer U)[]
        ? U extends object
        ? P
        : never
        : never]?: T[P];  // Only include expandable keys
    };
};

type ExpandableObject = Record<string, any> & {
    expand?: Record<string, unknown>;
};

type ExpandedResult<T extends ExpandableObject> = Omit<
    {
        [K in keyof T]: K extends keyof T['expand']
        ? T['expand'][K]
        : T[K] extends ExpandableObject
        ? ExpandedResult<T[K]>  // Only recurse if it's ExpandableObject
        : T[K];
    },
    'expand'
>;

