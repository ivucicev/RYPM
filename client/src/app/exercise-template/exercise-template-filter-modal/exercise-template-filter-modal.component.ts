import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Equipment, Level, Category, Force, Mechanic, Muscle } from '../../core/models/autogen/enums';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ExerciseTemplate } from 'src/app/core/models/collections/exercise-templates';

@Component({
    selector: 'app-exercise-template-filter-modal',
    templateUrl: './exercise-template-filter-modal.component.html',
    styleUrls: ['./exercise-template-filter-modal.component.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule, TranslateModule, CommonModule]
})
export class ExerciseTemplateFilterModalComponent implements OnInit {

    @Input() currentFilters: Partial<Record<keyof ExerciseTemplate, any>> = {};

    tempFilters: Partial<Record<keyof ExerciseTemplate, any>> = {};
    activeFiltersCount: number = 0;

    equipmentOptions = Object.values(Equipment);
    levelOptions = Object.values(Level);
    categoryOptions = Object.values(Category);
    forceOptions = Object.values(Force);
    mechanicOptions = Object.values(Mechanic);
    muscleOptions = Object.values(Muscle);

    constructor(
        private modalCtrl: ModalController
    ) { }

    ngOnInit() {
        this.setFilters(this.currentFilters, true);
    }

    setFilters(filters: Partial<Record<keyof ExerciseTemplate, any>>, copy = false) {
        this.tempFilters = copy ? JSON.parse(JSON.stringify(filters)) : filters;
        const activeCount = Object.values(this.tempFilters).reduce((count, filter) => {
            return count + (Array.isArray(filter) ? filter.length : 0);
        }, 0);
        this.activeFiltersCount = activeCount;
    }

    toggleFilter(field: keyof ExerciseTemplate, value: any) {
        const tempFilters = this.tempFilters;

        if (!tempFilters[field]) tempFilters[field] = [];

        const filterValues = tempFilters[field] as any[];
        const index = filterValues.indexOf(value);

        if (index > -1) {
            filterValues.splice(index, 1);
        } else {
            filterValues.push(value);
        }
        tempFilters[field] = filterValues;

        this.setFilters(tempFilters);
    }

    clearAllFilters() {
        this.tempFilters = {};
    }

    applyFilters() {
        this.modalCtrl.dismiss(this.tempFilters, 'apply');
    }

    cancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }
}
