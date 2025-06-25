import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { PocketbaseService } from './pocketbase.service';
import { Collection, COLLECTIONS } from '../constants/collections';
import { Constants } from '../constants/constants';

@Injectable()
export class AutosaveService {
    private subscriptions = new Map<AbstractControl, Subscription>();

    constructor(
        private pocketbaseService: PocketbaseService
    ) { }

    // TODO: submit only changed values?
    /**
     * Registers autosave on form value changes.
     *
     * Unregisters any previous subscription for the same form.
     *
     * Unsubscribes automatically when the component is destroyed.
     * @param form The FormGroup or FormControl to watch
     * @param showToast Whether to show a toast on save
     * @param collection The Pocketbase collection name
     * @param debounceMs Debounce time in ms (default {@link Constants.UPDATE_DEBOUNCE_MS})
     * @returns A promise that resolves with the upsert result on each save
     */
    register<T extends { id?: string }>(
        form: AbstractControl,
        collection: Collection,
        showToast = true,
        debounceMs = Constants.UPDATE_DEBOUNCE_MS
    ): Subject<Promise<any>> {
        const destroy$ = new Subject<void>();

        this.subscriptions.get(form)?.unsubscribe();

        const saveResult$ = new Subject<Promise<any>>();

        this.subscriptions.set(
            form,
            form.valueChanges
                .pipe(
                    debounceTime(debounceMs),
                    filter(() => form.valid),
                    switchMap((model) =>
                        this.pocketbaseService.upsertRecord<T>(collection, model, showToast, true)
                    ),
                    takeUntil(destroy$)
                )
                .subscribe({
                    next: async (result) => {
                        form.patchValue({ id: result.id }, { emitEvent: false });
                        if (collection == COLLECTIONS.workouts && result['day'])
                            saveResult$.next(Promise.resolve(result));
                    },
                    error: (err) => {
                        saveResult$.next(Promise.reject(err));
                    }
                })
        );

        return saveResult$;
    }

    save(collection: Collection, model: any) {
        this.pocketbaseService.upsertRecord(collection, model, false, true)

    }

    unregister(form: AbstractControl) {
        this.subscriptions.get(form)?.unsubscribe();
        this.subscriptions.delete(form);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions.clear();
    }
}
