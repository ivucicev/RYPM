import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { defer, Subject, Subscription } from 'rxjs';
import { PocketbaseService } from './pocketbase.service';
import { Collection } from '../constants/collections';
import { Constants } from '../constants/constants';

@Injectable()
export class AutosaveService {
    private subscriptions = new Map<AbstractControl, Subscription>();
    private destroySubjects = new Map<AbstractControl, Subject<void>>();

    constructor(private pocketbaseService: PocketbaseService) { }

    save(collection: Collection, model: any) {
        this.pocketbaseService.upsertRecord(collection, model, false, true)
    }

    register<T extends { id?: string }>(
        form: AbstractControl,
        collection: Collection,
        showToast = true,
        debounceMs = Constants.UPDATE_DEBOUNCE_MS
    ): Subject<Promise<any>> {

        if (this.subscriptions.has(form)) {
            this.destroy(form);
        }

        const saveResult$ = new Subject<Promise<any>>();

        if (this.isNewRecord(form)) {
            this.initNewRecordFlow(form, collection, showToast, debounceMs, saveResult$);
        } else {
            this.initUpdateRecordFlow(form, collection, showToast, debounceMs, saveResult$);
        }

        return saveResult$;
    }

    /**
     * Initialize new record flow: wait for change -> create -> init for updates
     */
    private initNewRecordFlow(
        form: AbstractControl,
        collection: Collection,
        showToast: boolean,
        debounceMs: number,
        saveResult$: Subject<Promise<any>>
    ): void {
        const destroy$ = this.setupDestroySubject(form);
        let hasBeenCreated = false;

        const subscription = form.valueChanges.pipe(
            debounceTime(debounceMs),
            filter(() => form.valid && form.dirty && !hasBeenCreated),
            switchMap(value => {
                return this.pocketbaseService.upsertRecord(collection, value, showToast, true);
            }),
            takeUntil(destroy$)
        ).subscribe({
            next: (result) => {
                hasBeenCreated = true;
                form.patchValue(result, { emitEvent: false });
                form.markAsPristine();
                saveResult$.next(Promise.resolve(result));
                if (subscription)
                    subscription.unsubscribe();
                this.subscriptions.delete(form);

                this.initUpdate(form, collection, showToast, debounceMs, saveResult$);
            },
            error: (err) => {
                console.error('[autosaveService] Creation error:', err);
                saveResult$.next(Promise.reject(err));
            }
        });

        this.subscriptions.set(form, subscription);
    }

    /**
     * Initialize form data update + nested forms update & nested form arrays add/remove
     */
    private initUpdate(
        form: AbstractControl,
        collection: Collection,
        showToast: boolean = true,
        debounceMs: number = Constants.UPDATE_DEBOUNCE_MS,
        saveResult$?: Subject<Promise<any>>
    ) {
        this.registerFormDataUpdates(form, collection, showToast, debounceMs, saveResult$);
        this.registerNestedFormsAndArrays(form, collection);
    }

    /**
     * Initialize update flow.
     */
    private initUpdateRecordFlow(
        form: AbstractControl,
        collection: Collection,
        showToast: boolean,
        debounceMs: number,
        saveResult$: Subject<Promise<any>>
    ): void {
        this.initUpdate(form, collection, showToast, debounceMs, saveResult$);
    }

    /**
     * Register for data changes only (excludes objects and arrays).
     */
    private registerFormDataUpdates(
        form: AbstractControl,
        collection: Collection,
        showToast: boolean,
        debounceMs: number,
        saveResult$?: Subject<Promise<any>>
    ): void {
        const destroy$ = this.setupDestroySubject(form);

        const subscription = form.valueChanges.pipe(
            debounceTime(debounceMs),
            filter(() => form.valid && form.dirty),
            switchMap(value => {
                const data = this.getDataFields(value, collection);
                if (Object.keys(data).length === 0) {
                    return Promise.resolve({ result: null, skipped: true });
                }

                return this.pocketbaseService.upsertRecord(collection, data, showToast, true)
                    .then(result => ({ result, skipped: false }));
            }),
            takeUntil(destroy$)
        ).subscribe({
            next: ({ result, skipped }) => {
                if (!skipped) {
                    form.patchValue(result, { emitEvent: false });
                    form.markAsPristine();
                    saveResult$?.next(Promise.resolve(result));
                }
            },
            error: (err) => {
                console.error('[autosaveService] Update error:', err);
                saveResult$?.next(Promise.reject(err));
            }
        });

        this.subscriptions.set(form, subscription);
    }

    /**
     * Register nested forms and array changes (update record + create/delete records)
     */
    private registerNestedFormsAndArrays(form: AbstractControl, collection: Collection): void {
        if (!(form instanceof FormGroup)) return;

        const nestedCollections = this.pocketbaseService.collectionMappings[collection] || [];

        nestedCollections.forEach(nestedCollection => {
            const formArray = form.get(nestedCollection) as FormArray;
            if (formArray instanceof FormArray) {
                this.registerFormArrayItemChanges(formArray, nestedCollection as Collection);
                this.registerFormArrayChanges(formArray, nestedCollection as Collection, form);
            }
        });
    }

    /**
     * Listen for array item updates (update record)
     */
    private registerFormArrayItemChanges(formArray: FormArray, collection: Collection): void {
        formArray.controls.forEach(control => {
            if (control instanceof FormGroup && !this.isNewRecord(control)) {
                this.registerFormDataUpdates(control, collection, false, Constants.UPDATE_DEBOUNCE_MS);
                this.registerNestedFormsAndArrays(control, collection);
            }
        });
    }

    /**
     * Listen for array add/remove items (create/delete records)
     */
    private registerFormArrayChanges(formArray: FormArray, collection: Collection, parentForm: FormGroup): void {
        let lastControls = [...formArray.controls];

        const destroy$ = this.destroySubjects.get(parentForm) || this.setupDestroySubject(parentForm);

        const subscription = formArray.valueChanges.pipe(
            debounceTime(100),
            takeUntil(destroy$)
        ).subscribe(() => {
            const currentControls = [...formArray.controls];

            const { removed, added } = this.getFormArrayChanges(lastControls, currentControls);

            if (removed.length > 0) {
                this.handleArrayItemsRemoved(removed, collection);
            }

            if (added.length > 0) {
                this.handleArrayItemsAdded(added, collection);
            }

            lastControls = [...currentControls];
        });

        this.subscriptions.set(formArray, subscription);
    }

    /**
     * Compare old and new controls to detect what was added/removed
     */
    private getFormArrayChanges(
        oldControls: AbstractControl[],
        newControls: AbstractControl[]
    ): { removed: AbstractControl[], added: AbstractControl[] } {

        const getControlId = (control: AbstractControl): string | null => {
            if (control instanceof FormGroup) {
                return control.get('id')?.value || null;
            }
            return null;
        };

        const oldIds = new Set(
            oldControls
                .map(getControlId)
                .filter(id => id !== null)
        );

        const newIds = new Set(
            newControls
                .map(getControlId)
                .filter(id => id !== null)
        );

        const removed = oldControls.filter(control => {
            const id = getControlId(control);
            return id !== null && !newIds.has(id);
        });

        const added = newControls.filter(control => {
            const id = getControlId(control);
            return id === null || !oldIds.has(id);
        });

        return { removed, added };
    }

    /**
     * Handle items removed from array
     */
    private handleArrayItemsRemoved(
        removedControls: AbstractControl[],
        collection: Collection
    ): void {
        removedControls.forEach(control => {
            if (control instanceof FormGroup) {
                const id = control.get('id')?.value;
                if (id) {
                    this.pocketbaseService[collection].delete(id);
                }
                this.destroy(control);
            }
        });
    }

    /**
     * Handle new items added to array
     */
    private handleArrayItemsAdded(
        addedControls: AbstractControl[],
        collection: Collection
    ): void {
        addedControls.forEach(control => {
            if (control instanceof FormGroup) {
                if (this.isNewRecord(control)) {
                    this.initNewArrayItem(control, collection);
                } else {
                    this.initUpdate(control, collection, false, Constants.UPDATE_DEBOUNCE_MS);
                }
            }
        });
    }

    /**
     * Create new array item then register for updates
     */
    private initNewArrayItem(form: FormGroup, collection: Collection): void {
        defer(() => this.pocketbaseService.upsertRecord(collection, form.getRawValue(), false, true))
            .subscribe({
                next: (result) => {
                    form.patchValue(result, { emitEvent: false });
                    form.markAsPristine();

                    this.initUpdate(form, collection, false, Constants.UPDATE_DEBOUNCE_MS);
                },
                error: (err) => console.error('[autosaveService] Array item creation error:', err)
            });
    }

    /**
     * Get only data fields (exclude relation objects/collections).
     */
    private getDataFields(data: any, collection: Collection): any {
        const collectionRelations = this.pocketbaseService.collectionMappings[collection] || [];

        const filtered = { ...data };

        collectionRelations.forEach(relation => {
            delete filtered[relation];
        });

        return filtered;
    }

    private isNewRecord(form: AbstractControl): boolean {
        const id = form instanceof FormGroup ? form.get('id')?.value : undefined;
        return !id || id === '';
    }

    private setupDestroySubject(form: AbstractControl): Subject<void> {
        let destroy$ = this.destroySubjects.get(form);
        if (!destroy$) {
            destroy$ = new Subject<void>();
            this.destroySubjects.set(form, destroy$);
        }
        return destroy$;
    }

    destroy(form: AbstractControl): void {
        const destroy$ = this.destroySubjects.get(form);
        if (destroy$) {
            destroy$.next();
            destroy$.complete();
            this.destroySubjects.delete(form);
        }

        const subscription = this.subscriptions.get(form);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(form);
        }

        this.destroyNestedControls(form);
    }

    private destroyNestedControls(form: AbstractControl): void {
        if (form instanceof FormGroup) {
            Object.values(form.controls).forEach(control => {
                this.destroyControl(control);
            });
        } else if (form instanceof FormArray) {
            form.controls.forEach(control => {
                this.destroyControl(control);
            });
        }
    }

    private destroyControl(control: AbstractControl): void {
        if (this.subscriptions.has(control) || this.destroySubjects.has(control)) {
            this.destroy(control);
        } else {
            this.destroyNestedControls(control);
        }
    }

    destroyAll() {
        this.destroySubjects.forEach(destroy$ => {
            destroy$.next();
            destroy$.complete();
        });
        this.destroySubjects.clear();

        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions.clear();
    }

    ngOnDestroy(): void {
        this.destroyAll();
    }
}
