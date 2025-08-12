import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController, ScrollDetail, IonFab, IonFabButton, IonIcon, IonSpinner, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonItem, IonNote, IonChip, IonText, IonButton, IonList, IonContent, IonToolbar, IonBadge, IonButtons, IonTitle, IonHeader, IonSearchbar, IonCheckbox } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Exercise } from 'src/app/core/models/collections/exercise';
import { PocketbaseService } from 'src/app/core/services/pocketbase.service';
import { buildFilter } from 'src/app/core/utils/filter-builder';
import { ExerciseTemplateDetailComponent } from '../exercise-template-detail/exercise-template-detail.component';
import { ExerciseTemplateFilterModalComponent } from '../exercise-template-filter-modal/exercise-template-filter-modal.component';
import { ExerciseTemplate, exerciseTemplatesArrayFields } from 'src/app/core/models/collections/exercise-templates';
import { ExerciseCreateModalComponent } from 'src/app/exercise-create-modal/exercise-create-modal.component';
import { flashOutline, handLeftOutline, speedometerOutline } from 'ionicons/icons';

interface SelectableExerciseTemplate extends ExerciseTemplate {
    selected?: boolean;
}

@Component({
    selector: 'app-exercise-template-selector',
    templateUrl: 'exercise-template-selector.component.html',
    styleUrls: ['./exercise-template-selector.component.scss'],
    standalone: true,
    imports: [IonHeader, IonTitle, IonButtons, IonCheckbox, IonSearchbar, IonBadge, IonToolbar, IonContent, IonList, IonButton, IonText, IonChip, IonNote, IonItem, IonLabel, IonInfiniteScrollContent, FormsModule, IonInfiniteScroll, IonSpinner, IonIcon, IonFabButton, IonFab, IonSearchbar, TranslateModule, CommonModule]
})
export class ExerciseTemplateSelectorComponent implements OnInit {

    @Input() history: Exercise[] = [];
    @Input() preSelected: Exercise[] = [];

    exercises: SelectableExerciseTemplate[] = [];
    searchTerm: string = '';

    appliedFilters: Partial<Record<keyof ExerciseTemplate, any>> = {};
    appliedFiltersCount = 0;
    isLoading: boolean = false;

    currentPage: number = 1;
    hasMoreData: boolean = true;
    perPage: number = 20;

    showScrollToTop = false;

    selectedExercises = [];
    flashIcon: any = flashOutline;
    handIcon: any = handLeftOutline;
    speedIcon: any = speedometerOutline;

    constructor(
        private modalCtrl: ModalController,
        private pb: PocketbaseService
    ) { }

    onScroll(event: CustomEvent<ScrollDetail>) {
        this.showScrollToTop = event.detail.scrollTop > 300;
    }

    async ngOnInit() {
        await this.loadExercises();
    }

    async openCreateModal() {

        const modal = await this.modalCtrl.create({
            component: ExerciseCreateModalComponent,
            breakpoints: [0, 0.75, 1],
            initialBreakpoint: 0.75,
            componentProps: {

            }
        });

        await modal.present();
        const { data } = await modal.onWillDismiss();

        if (data && data.name) {
            data.isCommunity = true;
            data.user = this.pb.currentUser?.id || null;
            await this.pb.upsertRecord<ExerciseTemplate>('exercise_templates', data, true, false);
        }
    }

    async loadExercises(append: boolean = false) {
        if (this.isLoading) return;

        this.isLoading = true;

        try {
            const allFilters = this.searchTerm
                ? { ...this.appliedFilters, search: this.searchTerm }
                : this.appliedFilters;

            const filterString = buildFilter<ExerciseTemplate>(allFilters, exerciseTemplatesArrayFields);

            const result = await this.pb.exercise_templates.getList(this.currentPage, this.perPage, {
                filter: filterString,
                sort: 'name'
            });

            // const res = await this.pb.exercise_templates.getFullList();

            // Collect all unique values for each property into separate arrays
            // const allMuscles: string[] = [];
            // const allForce: string[] = [];
            // const allLevel: string[] = [];
            // const allMechanic: string[] = [];
            // const allEquipment: string[] = [];
            // const allCategory: string[] = [];

            // (result.items as ExerciseTemplate[]).forEach(item => {
            //     if (Array.isArray(item.primaryMuscles)) {
            //         allMuscles.push(...item.primaryMuscles);
            //     }
            //     if (Array.isArray(item.secondaryMuscles)) {
            //         allMuscles.push(...item.secondaryMuscles);
            //     }
            //     if (item.force) {
            //         allForce.push(item.force);
            //     }
            //     if (item.level) {
            //         allLevel.push(item.level);
            //     }
            //     if (item.mechanic) {
            //         allMechanic.push(item.mechanic);
            //     }
            //     if (item.equipment) {
            //         allEquipment.push(item.equipment);
            //     }
            //     if (item.category) {
            //         allCategory.push(item.category);
            //     }
            // });

            // Remove duplicates for each array
            // const uniqueMuscles = Array.from(new Set(allMuscles));
            // const uniqueForce = Array.from(new Set(allForce));
            // const uniqueLevel = Array.from(new Set(allLevel));
            // const uniqueMechanic = Array.from(new Set(allMechanic));
            // const uniqueEquipment = Array.from(new Set(allEquipment));
            // const uniqueCategory = Array.from(new Set(allCategory));

            const exercisesWithSelection = (result.items as ExerciseTemplate[]).map(exercise => ({
                ...exercise,
                selected: this.preSelected?.some(pre => pre.id === exercise.id) || false
            }));

            if (append) {
                this.exercises.push(...exercisesWithSelection);
            } else {
                this.exercises = exercisesWithSelection;
            }

            this.hasMoreData = this.currentPage < result.totalPages;

            if (this.selectedExercises && this.selectedExercises.length > 0) {
                const selectedIds = new Set(this.selectedExercises.map(ex => ex.id));
                this.exercises.forEach(ex => {
                    ex.selected = selectedIds.has(ex.id);
                });
            }

        } catch (error) {
            console.error('Error loading exercises:', error);
        } finally {
            this.isLoading = false;
        }
    }

    async onSearchChange(event: any) {
        this.searchTerm = event.detail.value;
        this.currentPage = 1;
        this.hasMoreData = true;
        await this.loadExercises();
    }

    async loadMore(event: any) {
        if (this.hasMoreData && !this.isLoading) {
            this.currentPage++;
            await this.loadExercises(true);
        }
        event.target.complete();
    }

    async openFilters() {
        const modal = await this.modalCtrl.create({
            component: ExerciseTemplateFilterModalComponent,
            breakpoints: [0, 0.5, 0.75, 1],
            cssClass: 'no-backdrop',
            expandToScroll: false,
            initialBreakpoint: 0.5,
            componentProps: {
                currentFilters: this.appliedFilters
            }
        });

        await modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'apply' && data) {
            this.appliedFilters = data;
            this.appliedFiltersCount =
                Object.values(this.appliedFilters).reduce((count, filter) => {
                    return count + (Array.isArray(filter) ? filter.length : 0);
                }, 0);

            this.currentPage = 1;
            this.hasMoreData = true;

            await this.loadExercises();
        }
    }

    async openExerciseDetail(exercise: ExerciseTemplate) {
        const modal = await this.modalCtrl.create({
            component: ExerciseTemplateDetailComponent,
            componentProps: { exercise },
            presentingElement: await this.modalCtrl.getTop()
        });

        await modal.present();
    }

    toggleExercise(exercise: SelectableExerciseTemplate) {
        const index = this.selectedExercises.findIndex(ex => ex.id === exercise.id);
        if (index > -1) {
            this.selectedExercises.splice(index, 1);
            exercise.selected = false;
        } else {
            this.selectedExercises.push(exercise);
            exercise.selected = true;
        }
    }

    addSelected() {
        this.modalCtrl.dismiss({ exercises: this.selectedExercises });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    clearFilters() {
        this.appliedFilters = {};
        this.currentPage = 1;
        this.hasMoreData = true;

        this.loadExercises();
    }
}
