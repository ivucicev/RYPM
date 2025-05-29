import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Exercise } from 'src/app/core/models/collections/exercise';
import { PocketbaseService } from 'src/app/core/services/pocketbase.service';
import { buildFilter } from 'src/app/core/utils/filter-builder';
import { ExerciseTemplateDetailComponent } from '../exercise-template-detail/exercise-template-detail.component';
import { ExerciseTemplateFilterModalComponent } from '../exercise-template-filter-modal/exercise-template-filter-modal.component';
import { ExerciseTemplate, exerciseTemplatesArrayFields } from 'src/app/core/models/collections/exercise-templates';

interface SelectableExerciseTemplate extends ExerciseTemplate {
    selected?: boolean;
}

@Component({
    selector: 'app-exercise-template-selector',
    templateUrl: './exercise-template-selector.component.html',
    styleUrls: ['./exercise-template-selector.component.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule, TranslateModule, CommonModule]
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

    constructor(
        private modalCtrl: ModalController,
        private pb: PocketbaseService
    ) { }

    async ngOnInit() {
        await this.loadExercises();
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

    getSelectedCount(): number {
        return this.exercises.filter(ex => ex.selected).length;
    }

    toggleExercise(exercise: SelectableExerciseTemplate) {
        exercise.selected = !exercise.selected;
    }

    addSelected() {
        const selected = this.exercises.filter(ex => ex.selected);
        this.modalCtrl.dismiss({ exercises: selected });
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
