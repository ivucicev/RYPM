import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionSheetController, IonicModule, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { DateTimePipe } from '../core/pipes/datetime.pipe';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { Workout } from '../core/models/collections/workout';
import { WorkoutState } from '../core/models/enums/workout-state';
import { ContinueFooterComponent } from '../shared/continue-footer/continue-footer.component';
import { FormsModule } from '@angular/forms';
import { NgSwitch, NgSwitchCase } from '@angular/common';

import * as chart from 'chart.js';

@Component({
    selector: 'app-my-activity',
    templateUrl: './my-activity.page.html',
    styleUrls: ['./my-activity.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, FormsModule, NgSwitch, NgSwitchCase, DateTimePipe, ContinueFooterComponent],
})
export class MyActivityPage {

    workouts: Workout[] = [];

    WorkoutState = WorkoutState;

    continueFooter = viewChild(ContinueFooterComponent);

    chartInstance: chart.Chart | null = null;
    tab: 'workouts' | 'stats' = 'workouts';

    @ViewChild('volumeChart') chart: ElementRef<HTMLCanvasElement>;
    @ViewChild('effortChart') effortChart: ElementRef<HTMLCanvasElement>;
    @ViewChild('volumePerWorkout') chartPerWorkout: ElementRef<HTMLCanvasElement>;
    @ViewChild('maxPerWorkout') maxPerWorkout: ElementRef<HTMLCanvasElement>;
    @ViewChild('maxLoadPerWorkout') maxLoadPerWorkout: ElementRef<HTMLCanvasElement>;

    constructor(
        private actionSheetCtrl: ActionSheetController,
        private translateService: TranslateService,
        private pocketbaseService: PocketbaseService,
        private navCtrl: NavController
    ) {

        this.getSessions();
    }

    // TODO: fetch
    async refresh() {
        this.continueFooter().refresh();
    }

    async draw() {
        // Sort workouts from oldest to newest
        const sortedWorkouts = [...this.workouts].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

        const ctx = this.chart?.nativeElement.getContext('2d');
        if (!ctx) return;

        // Destroy previous chart instance if exists
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        // Chart 1: Load over time (only show values > 0)
        const loadLabels = sortedWorkouts
            .map(w => new Date(w.created).toLocaleDateString());
        const loadData = sortedWorkouts
            .map(w => w.load > 0 ? w.load : null);

        this.chartInstance = new chart.Chart(ctx, {
            type: 'line',
            data: {
            labels: loadLabels,
            datasets: [{
                label: 'Workout Load',
                data: loadData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
            },
            options: {
            responsive: true,
            scales: {
                y: {
                beginAtZero: true
                }
            }
            }
        });

        // Chart 2: Volume per workout name, with one line per workout
        // Prepare data: each workout name gets its own dataset (line)
        const workoutNames = Array.from(new Set(sortedWorkouts.flatMap(w =>
            w.exercises.map((ex: any) => ex.name)
        )));

        // For each workout, map volume per exercise name (only show values > 0)
        const datasets = workoutNames.map(name => {
            const data = sortedWorkouts.map(workout =>
            workout.exercises
                .filter((ex: any) => ex.name === name)
                .reduce((sum: number, ex: any) =>
                sum + (ex.sets?.reduce((s: number, set: any) => s + (set.weight || 0), 0) || 0)
                , 0)
            ).map(v => v > 0 ? v : null);

            return {
            label: name,
            data,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},1)`,
            borderWidth: 2
            };
        });

        new chart.Chart(this.chartPerWorkout?.nativeElement.getContext('2d'), {
            type: 'line',
            data: {
            labels: sortedWorkouts.map(w => new Date(w.created).toLocaleDateString()),
            datasets: datasets
            },
            options: {
            responsive: true,
            scales: {
                y: {
                beginAtZero: true
                }
            }
            }
        });

        // Chart 3: Effort over time
        const effortCtx = this.effortChart?.nativeElement.getContext('2d');
        if (effortCtx) {
            const effortLabels = sortedWorkouts.map(w => new Date(w.created).toLocaleDateString());
            const effortData = sortedWorkouts.map(w => w.effort ?? null);

            new chart.Chart(effortCtx, {
                type: 'line',
                data: {
                    labels: effortLabels,
                    datasets: [{
                        label: 'Workout Effort',
                        data: effortData,
                        backgroundColor: 'rgba(255, 206, 86, 0.5)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        const maxPerWorkoutCtx = this.maxPerWorkout?.nativeElement.getContext('2d');
        if (maxPerWorkoutCtx) {
            // Get all unique workout names
            const workoutNames = Array.from(new Set(sortedWorkouts.flatMap(w =>
                w.exercises.map((ex: any) => ex.name)
            )));

            // For each workout name, build a dataset of max weight per day
            const datasets = workoutNames.map(name => {
                const data = sortedWorkouts.map(workout => {
                    // Find all sets for this exercise name in this workout
                    const sets = workout.exercises
                        .filter((ex: any) => ex.name === name)
                        .flatMap((ex: any) => ex.sets || []);
                    // Get max weight for this workout for this exercise
                    const maxWeight = sets.length > 0 ? Math.max(...sets.map((set: any) => set.weight || 0)) : null;
                    return maxWeight && maxWeight > 0 ? maxWeight : null;
                });

                return {
                    label: name,
                    data,
                    fill: false,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},1)`,
                    borderWidth: 2
                };
            });

            new chart.Chart(maxPerWorkoutCtx, {
                type: 'line',
                data: {
                    labels: sortedWorkouts.map(w => new Date(w.created).toLocaleDateString()),
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Chart 4: Max load per workout name over time
        const maxLoadPerWorkoutCtx = this.maxLoadPerWorkout?.nativeElement.getContext('2d');
        if (maxLoadPerWorkoutCtx) {
            // Get all unique workout names
            const workoutNames = Array.from(new Set(sortedWorkouts.flatMap(w =>
            w.exercises.map((ex: any) => ex.name)
            )));

            // For each workout name, build a dataset of max load per day
            const datasets = workoutNames.map(name => {
            const data = sortedWorkouts.map(workout => {
                // Find all sets for this exercise name in this workout
                const sets = workout.exercises
                .filter((ex: any) => ex.name === name)
                .flatMap((ex: any) => ex.sets || []);
                // Get max weight for this workout for this exercise
                const maxWeight = sets.length > 0 ? Math.max(...sets.map((set: any) => set.weight || 0)) : null;
                // Count how many times max weight was lifted
                const maxWeightCount = sets.filter((set: any) => set.weight === maxWeight).length;
                // Load is max weight * count
                const maxLoad = (maxWeight && maxWeight > 0) ? maxWeight * maxWeightCount : null;
                return maxLoad;
            });

            return {
                label: `${name} (Max Load)`,
                data,
                fill: false,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},1)`,
                borderWidth: 2
            };
            });

            new chart.Chart(maxLoadPerWorkoutCtx, {
            type: 'line',
            data: {
                labels: sortedWorkouts.map(w => new Date(w.created).toLocaleDateString()),
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                y: {
                    beginAtZero: true
                }
                }
            }
            });
        }
        
    }

    async initCharts() {
        setTimeout(() => {
            this.draw();
        }, 500);
    }

    async onTabChange(tab) {
        this.initCharts();
    }

    async getSessions() {
        // get previous sessions
        const workouts = await this.pocketbaseService.workouts.getList(0, 500, {
            filter: `state = "${WorkoutState.Completed}"`,
            sort: '-created',
            expand: 'trainer,exercises,exercises.sets,day,user',
        }) as any;

        this.workouts = workouts.items.map(workout => workout);

        this.workouts.forEach(workout => {
            const tags = workout.exercises.map(exercise => exercise.primaryMuscles);
            workout.tags = Array.from(new Set(tags.flat()));
            workout.load = workout.exercises.reduce((total, exercise) => {
                return total + (exercise.sets?.reduce((sum, set) => sum + (set.weight || 0), 0) || 0);
            }, 0);
        })

    }

    ionViewWillEnter() {
        this.refresh();
    }

    async openSettings(workout) {
        const translations = await lastValueFrom(this.translateService.get([
            'Edit', 'Delete'
        ]));

        const actionSheet = await this.actionSheetCtrl.create({
            header: translations.workout,
            buttons: [
                {
                    text: translations.Edit,
                    icon: 'create-outline',
                    handler: () => {
                        this.navCtrl.navigateForward([`./workout-wizard/${workout.id}`]);
                    }
                },
                {
                    text: translations.Delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    handler: async() => {
                        // delete workout
                        await this.pocketbaseService.workouts.delete(workout.id);
                        this.workouts = this.workouts.filter(w => w.id !== workout.id);
                    }
                }
            ]
        });

        await actionSheet.present();
    }
}
