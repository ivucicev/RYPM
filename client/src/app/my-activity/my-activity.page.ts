import { Component, ElementRef, ViewChild, viewChild, ViewChildren } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionSheetController, NavController, IonCardContent, IonChip, IonButton, IonIcon, IonCardHeader, IonCard, IonList, IonTitle, IonRow, IonContent, IonLabel, IonToolbar, IonSegmentButton, IonHeader, IonSegment, ModalController, IonSelect, IonInput, IonItem, IonFab, IonFabButton, IonFabList, IonPopover } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { DateTimePipe } from '../core/pipes/datetime.pipe';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { Workout } from '../core/models/collections/workout';
import { WorkoutState } from '../core/models/enums/workout-state';
import { ContinueFooterComponent } from '../shared/continue-footer/continue-footer.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';

import * as chart from 'chart.js';
import { NoDataComponent } from '../shared/no-data/no-data.component';
import { FormsModule } from '@angular/forms';
import { MeasurementCreateModalComponent } from '../measurement-create-modal/measurement-create-modal.component';
import { MeasurementEntryAddModal } from '../measurement-entry-add-modal/measurement-entry-add-modal.component';

@Component({
    selector: 'app-my-activity',
    templateUrl: 'my-activity.page.html',
    styleUrls: ['./my-activity.page.scss'],
    standalone: true,
    imports: [IonHeader, IonFab, IonPopover, IonFabList, IonFabButton, IonSegmentButton, IonToolbar, IonLabel, IonContent, IonRow, IonTitle, IonList, IonCard, IonCardHeader, IonIcon, IonButton, IonChip, IonCardContent, NoDataComponent, TranslateModule, FormsModule, IonSegment, NgSwitch, NgSwitchCase, DateTimePipe, ContinueFooterComponent, IonItem],
})
export class MyActivityPage {

    workouts: Workout[] = [];

    WorkoutState = WorkoutState;

    continueFooter = viewChild(ContinueFooterComponent);

    chartInstance: chart.Chart | null = null;
    tab: 'workouts' | 'stats' | 'measurements' = 'workouts';

    measurements = [];

    actionsPopover = false;

    @ViewChild('volumeChart') chart: ElementRef<HTMLCanvasElement>;
    @ViewChild('effortChart') effortChart: ElementRef<HTMLCanvasElement>;
    @ViewChild('volumePerWorkout') chartPerWorkout: ElementRef<HTMLCanvasElement>;
    @ViewChild('maxPerWorkout') maxPerWorkout: ElementRef<HTMLCanvasElement>;
    @ViewChild('maxLoadPerWorkout') maxLoadPerWorkout: ElementRef<HTMLCanvasElement>;
    @ViewChildren('measurementsGraph') measurementCanvas: Array<ElementRef<HTMLCanvasElement>> | any;

    constructor(
        private actionSheetCtrl: ActionSheetController,
        private translateService: TranslateService,
        private pocketbaseService: PocketbaseService,
        private navCtrl: NavController,
        private modalCtrl: ModalController
    ) {

        this.getSessions();
    }

    async refresh() {
        this.continueFooter().refresh();
    }

    async draw() {
        // Sort workouts from oldest to newest
        const sortedWorkouts = [...this.workouts].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

        const ctx = this.chart?.nativeElement.getContext('2d');
        if (!ctx) return;

        //Destroy previous chart instance if exists
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
                borderColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},1)`,
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
                    borderColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},1)`,
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
                    borderColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},1)`,
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

    public presentPopover(e) {
        this.actionsPopover = true;
    }

    async initCharts() {
        setTimeout(() => {
            this.draw();
        }, 500);
    }

    async onTabChange(tab) {
        if (tab == 'stats')
            this.initCharts();
        if (tab == 'measurements')
            await this.getMeasurements();
    }

    async getMeasurements() {
        const data = await this.pocketbaseService.measurements.getList(0, 500, {
            sort: '-created',
            expand: 'entries',
        }) as any;

        this.measurements = [...data.items];

        setTimeout(() => {
            this.measurements.forEach((m, i) => {
                const ctx = this.measurementCanvas.get(i)?.nativeElement.getContext('2d');
                if (!ctx) return;

                m.entries = m.entries.sort((a, b) => new Date(a.date) as any - (new Date(b.date) as any));

                const loadLabels = m.entries.map(w => new Date(w.date).toLocaleDateString());

                const chartInstance = new chart.Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: loadLabels,
                        datasets: [{
                            label: m.name,
                            data: m?.entries?.map(e => e.value),
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
            })
        });
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

    async createOrEditMeasurement(measurement?) {
        this.actionsPopover = false;
        const modal = await this.modalCtrl.create({
            component: MeasurementCreateModalComponent,
            breakpoints: [0, 0.75, 1],
            initialBreakpoint: 0.75,
            componentProps: measurement ? measurement : {
                name: '',
                unit: 'kg',
                id: null
            }
        });

        await modal.present();
        const { data } = await modal.onWillDismiss();

        if (data && data.name && data.unit) {
            data.user = this.pocketbaseService.currentUser?.id || null;
            await this.pocketbaseService.upsertRecord('measurements', data, true, false);
            this.getMeasurements();
        }
    }

    async addEntry(measurement?) {
        this.actionsPopover = false;
        const modal = await this.modalCtrl.create({
            component: MeasurementEntryAddModal,
            breakpoints: [0, 0.75, 1],
            initialBreakpoint: 0.75,
            componentProps: {
                id: null,
                value: 0,
                date: null
            }
        });

        await modal.present();
        const { data } = await modal.onWillDismiss();

        if (data && data.value && data.date) {
            data.user = this.pocketbaseService.currentUser?.id || null;
            data.measurement = measurement.id;
            const entry = await this.pocketbaseService.upsertRecord('measurement_entry', data, true, false);
            if (entry && entry.id) {
                measurement.entries.push(entry);
                measurement.entries = measurement.entries.map(m => m.id);
                await this.pocketbaseService.measurements.update(measurement.id, measurement)
            }
            this.getMeasurements();
        }
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
                    handler: async () => {
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
