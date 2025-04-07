import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Exercise } from '../core/models/exercise';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-exercise-selector',
    templateUrl: './exercise-selector.component.html',
    styleUrls: ['./exercise-selector.component.scss'],
    standalone: true,
    imports: [IonicModule, NgFor, FormsModule, NgIf, TranslateModule]
})
export class ExerciseSelectorComponent {

    @Input() history: Exercise[] = [];

    // TODO: fetch
    exercises: Exercise[] = [
        { id: '1', name: 'Push-up', tags: ['Upper Body', 'Chest', 'Bodyweight'] },
        { id: '2', name: 'Squat', tags: ['Lower Body', 'Legs', 'Bodyweight'] },
        { id: '3', name: 'Pull-up', tags: ['Upper Body', 'Back', 'Bodyweight'] },
        { id: '4', name: 'Plank', tags: ['Core', 'Bodyweight'] },
        { id: '5', name: 'Bench Press', tags: ['Upper Body', 'Chest', 'Weights'] },
        { id: '6', name: 'Deadlift', tags: ['Lower Body', 'Back', 'Weights'] },
        { id: '7', name: 'Lunges', tags: ['Lower Body', 'Legs', 'Bodyweight'] },
        { id: '8', name: 'Shoulder Press', tags: ['Upper Body', 'Shoulders', 'Weights'] },
        { id: '9', name: 'Bicycle Crunches', tags: ['Core', 'Bodyweight'] },
        { id: '10', name: 'Burpees', tags: ['Full Body', 'Cardio', 'Bodyweight'] },
    ];

    searchTerm: string = '';
    filteredExercises: Exercise[] = [];

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() {
        this.filteredExercises = [...this.exercises];
    }

    filterExercises() {
        if (!this.searchTerm.trim()) {
            this.filteredExercises = [...this.exercises];
            return;
        }

        const term = this.searchTerm.toLowerCase();
        this.filteredExercises = this.exercises.filter(ex =>
            ex.name.toLowerCase().includes(term) ||
            ex.tags?.some(tag => tag.toLowerCase().includes(term))
        );
    }

    selectExercise(exercise: Exercise) {
        this.modalCtrl.dismiss({
            exercise: exercise
        });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }
}
