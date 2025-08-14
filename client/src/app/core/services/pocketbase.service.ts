import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import PocketBase, { RecordModel } from 'pocketbase';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast-service';
import { User } from '../models/collections/user';
import { Workout } from '../models/collections/workout';
import { Day } from '../models/collections/day';
import { Week } from '../models/collections/week';
import { Set } from '../models/collections/exercise-set';
import { Exercise } from '../models/collections/exercise';
import { Program } from '../models/collections/program';
import { Template } from '../models/collections/template';
import { PB } from '../constants/pb-constants';
import { Collection, COLLECTIONS } from '../constants/collections';
import { LoadingController } from '@ionic/angular/standalone';
import { ExerciseTemplate } from '../models/collections/exercise-templates';
import { Measurement } from '../models/collections/measurement';
import { MeasurementEntry } from '../models/collections/measurement-entry';
import { Conversation } from '../models/collections/conversations';
import { Message } from '../models/collections/message';

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
        'exercise_templates': [],
        'measurement_entry': [],
        'measurements': [],
        'conversations': [],
        'messages': [],
        'progress_photos': []
    };

    private singleRelationMappings: Record<string, string[]> = {
        'workouts': ['day'],
        'days': ['workout'],
    };

    pb: PocketBase = new PocketBase(environment.api);
    currentUser: User;

    constructor(
        private translateService: TranslateService,
        private toastService: ToastService,
        private loadingCtrl: LoadingController
    ) {

        if (this.isDemoSubdomain()) {
            this.pb = new PocketBase(environment.demo);
        } else {
            this.pb = new PocketBase((window as any)['env']?.api || environment.api);
        }

        this.init();
    }

    public isDemoSubdomain(): boolean {
        const subdomain = this.getSubdomain();
        return subdomain === 'demo';
    }

    private getSubdomain(): string | null {
        const host = window.location.hostname;
        const parts = host.split('.');
        if (parts.length > 2) {
            return parts[0]; // Assuming the subdomain is the first part
        }
        return null;
    }

    init() {
        if (this.pb.authStore.isValid) {

            if (!this.pb.authStore.record?.expand) {

                try {
                    const u = this.pb.collection('users').getOne<User>(this.pb.authStore.record?.id).then(u => {
                        this.currentUser = u;
                    });

                } catch (error) {
                }

            } else {
                this.currentUser = this.pb.authStore.record as any;
            }
        }

        this.pb.afterSend = (response, data, options?: any) => {
            if (response.status != 200) {
                try {
                    this.loadingCtrl.dismiss();
                } catch { }
                switch (response.status) {
                    case 400:
                    case 409:
                        let messages = '';
                        if (data.data) {
                            Object.keys(data.data).forEach(key => {
                                const d = data.data as { code: string, message: string };
                                messages += this.translateService.instant((key.charAt(0).toUpperCase() + key.slice(1))
                                    + " - "
                                    + this.translateService.instant(d[key].code));
                            })
                        }

                        messages = messages || 'errors.unexpected_error';
                        if (response.status == 409) {
                            this.toastService.info(messages);
                        } else {
                            this.toastService.error(messages);
                        }

                        break;
                    case 500:
                        this.toastService.error('errors.unexpected_error');
                        break;
                    default:
                        break;
                }
            } else if (options?.method == "POST" || options?.method == "PATCH" || options?.method == "DELETE") {
                if (!options?.headers?.notoast) {
                    this.toastService.success();
                }
            }

            if (response.status == 200) {
                const mapped = this.mapRecordModel(data);
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

    public get exercise_templates() {
        return this.pb.collection<ExerciseTemplate>(COLLECTIONS.exercise_templates);
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

    public get measurements() {
        return this.pb.collection<Measurement>(COLLECTIONS.measurements);
    }

    public get measurementEntries() {
        return this.pb.collection<MeasurementEntry>(COLLECTIONS.measurement_entry);
    }

    public get conversations() {
        return this.pb.collection<Conversation>(COLLECTIONS.conversations);
    }

    public get messages() {
        return this.pb.collection<Message>(COLLECTIONS.messages);
    }

    public get progressPhotos() {
        return this.pb.collection<any>(COLLECTIONS.progress_photos);
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

    /**
     * Creates or updates a record in the specified collection, handling nested collections.
     *
     * @param collectionName - The name of the collection to create/update the record in
     * @param data - The record data to be created or updated
     * @param showToast - Whether to show a success toast notification after completion
     * @param disableAutoCancel - Whether to disable auto-cancellation of the request
     * @param depth - The current depth of nested processing (used for recursion)
     * @returns A promise resolving to the created/updated record
     */
    // TODO: UNDEBUGGABLE -> this gets callled all over the place, disaster 2
    async upsertRecord<T extends { id?: string }>(
        collectionName: Collection,
        data: any,
        showToast: boolean = true,
        disableAutoCancel: boolean = false,
        depth: number = 0
    ): Promise<T> {
        const recordData = JSON.parse(JSON.stringify(data));
        const recordId = recordData.id && recordData.id !== "" ? recordData.id : null;
        delete recordData.id;

        const { collections, singleRelations, obj } = this.separateCollectionAndPrimitiveProperties(
            collectionName,
            recordData
        );

        const requestOptions = {
            ...this.updateNestedOptions,
            requestKey: disableAutoCancel ? null : undefined
        };

        const result = recordId
            ? await this.pb.collection(collectionName).update<T>(recordId, obj, requestOptions)
            : await this.pb.collection(collectionName).create<T>(obj, requestOptions);

        const relationReferences = await this.processSingleRelations(
            collectionName,
            result.id,
            singleRelations,
            disableAutoCancel,
            depth
        );

        const { backReferences, processedCollections } = await this.processNestedCollections(
            collectionName,
            result.id,
            collections,
            requestOptions,
            disableAutoCancel,
            depth
        );

        if (Object.keys(backReferences).length > 0) {
            await this.pb.collection(collectionName).update(result.id, backReferences, requestOptions);
        }

        if (Object.keys(relationReferences).length > 0) {
            await this.pb.collection(collectionName).update(result.id, relationReferences, requestOptions);
        }

        if (depth === 0 && showToast) {
            this.toastService.success();
        }

        // TODO: merge back returned result?
        // const completeResult = {
        //     ...result,
        //     ...processedCollections,
        //     ...singleRelations
        // };

        return result;
    }

    private async processSingleRelations(
        parentCollection: Collection,
        parentId: string,
        singleRelations: Record<string, any>,
        disableAutoCancel: boolean = false,
        depth: number = 0
    ): Promise<Record<string, string>> {
        const relationReferences: Record<string, string> = {};

        for (const [relationName, relationData] of Object.entries(singleRelations)) {
            if (!relationData) continue;

            try {
                if (typeof relationData === 'string') {
                    relationReferences[`${relationName}`] = relationData;
                    continue;
                }

                const collectionName = Object.values(COLLECTIONS).find(c => c.startsWith(relationName));

                const backRefCollectionName = this.singleRelationMappings[collectionName].find(c => parentCollection.startsWith(c));
                relationData[backRefCollectionName] = parentId;

                const result = await this.upsertRecord(
                    collectionName as Collection,
                    relationData,
                    false,
                    disableAutoCancel,
                    depth + 1
                );

                relationReferences[`${relationName}`] = result.id;
                singleRelations[relationName] = result;
            } catch (error) {
                console.error(`Error processing single relation ${relationName}:`, error);
            }
        }

        return relationReferences;
    }

    private async processNestedCollections(
        parentCollection: Collection,
        parentId: string,
        collections: Record<string, any[]>,
        requestOptions: any,
        disableAutoCancel: boolean = false,
        depth: number = 0
    ): Promise<{
        backReferences: Record<string, any>;
        processedCollections: Record<string, any[]>;
    }> {
        const parentRef = this.getParentRef(parentCollection);
        const nestedCollectionNames = this.collectionMappings[parentCollection] || [];

        const backReferences: Record<string, any> = {};
        const processedCollections: Record<string, any[]> = {};

        for (const collectionName of nestedCollectionNames) {
            if (!collections[collectionName]) continue;

            const items = collections[collectionName];
            const processedIds: string[] = [];
            const processedObjects: any[] = [];

            const existingItems = await this.pb.collection(collectionName).getFullList({
                filter: `${parentRef}="${parentId}"`,
                ...requestOptions
            });

            const existingMap = new Map(existingItems.map(item => [item.id, item]));
            const processedIdsSet = new Set<string>();
            let idx = 0;
            for (const item of items) {
                item[parentRef] = parentId;
                item['index'] = idx;
                idx++;
                try {
                    const result = await this.upsertRecord(
                        collectionName as Collection,
                        item,
                        false,
                        disableAutoCancel,
                        depth + 1
                    );

                    processedIds.push(result.id);
                    processedObjects.push(result);

                    if (item.id) {
                        processedIdsSet.add(item.id);
                    }
                } catch (error) {
                    console.error(`Error processing nested collection ${collectionName}:`, error);
                }
            }

            for (const [id] of existingMap.entries()) {
                if (!processedIdsSet.has(id)) {
                    await this.pb.collection(collectionName).delete(id, requestOptions);
                }
            }

            if (processedIds.length > 0) {
                if (collectionName) {
                    backReferences[collectionName] = processedIds;
                    processedCollections[collectionName] = processedObjects;
                }
            }
        }

        return { backReferences, processedCollections };
    }

    private separateCollectionAndPrimitiveProperties(
        collectionName: Collection,
        data: any
    ): { collections: Record<string, any[]>; singleRelations: Record<string, any[]>; obj: any } {
        const collections: Record<string, any[]> = {};
        const singleRelations: Record<string, any> = {};
        const obj = { ...data };

        const nestedCollectionNames = this.collectionMappings[collectionName] || [];
        const singleRelationNames = this.singleRelationMappings[collectionName] || [];

        for (const nestedCollection of nestedCollectionNames) {
            if (obj[nestedCollection]) {
                collections[nestedCollection] = obj[nestedCollection];
                delete obj[nestedCollection];
            }
        }

        for (const relationName of singleRelationNames) {
            if (obj[relationName]) {
                singleRelations[relationName] = obj[relationName];
                delete obj[relationName];
            }
        }

        return { collections, singleRelations, obj };
    }

    private getParentRef(collectionName: string): string {
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

