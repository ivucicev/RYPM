import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, ViewChild, viewChild, ViewChildren } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionSheetController, NavController, IonCardContent, IonChip, IonButton, IonIcon, IonCardHeader, IonCard, IonList, IonTitle, IonRow, IonContent, IonLabel, IonToolbar, IonSegmentButton, IonHeader, IonSegment, ModalController, IonSelect, IonInput, IonItem, IonFab, IonFabButton, IonFabList, IonPopover, AlertController, IonNote, IonSelectOption, IonCardSubtitle, IonModal, IonFooter, SelectChangeEventDetail } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { DateTimePipe, DurationPipe } from '../core/pipes/datetime.pipe';
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
import { cameraOutline, eyeOutline, phonePortrait, shareSocialOutline, trendingDownOutline, trendingUpOutline } from 'ionicons/icons';
import { register } from 'swiper/element/bundle';

import 'swiper/css/pagination';
import 'swiper/css/zoom';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { AccountService } from '../core/services/account.service';
import { PB } from '../core/constants/pb-constants';
import { WeightType } from '../core/models/enums/weight-type';
import html2canvas from 'html2canvas';
import { ThemeService } from '../core/services/theme.service';
import { IonSelectCustomEvent } from '@ionic/core';

@Component({
    selector: 'app-my-activity',
    templateUrl: 'my-activity.page.html',
    styleUrls: ['./my-activity.page.scss'],
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [IonHeader, IonModal, IonSelect, IonSelectOption, IonNote, IonFab, IonPopover, IonFabButton, IonSegmentButton, IonToolbar, IonLabel, IonContent, IonRow, IonTitle, IonList, IonCard, IonCardHeader, IonIcon, IonButton, IonChip, IonCardContent, NoDataComponent, TranslateModule, FormsModule, IonSegment, NgSwitch, NgSwitchCase, DateTimePipe, ContinueFooterComponent, IonItem, IonCardSubtitle, DurationPipe, IonFooter],
})
export class MyActivityPage {

    workouts: Workout[] = [];
    currentWorkout = null;

    WorkoutState = WorkoutState;
    currentUser;

    continueFooter = viewChild(ContinueFooterComponent);

    chartInstance: chart.Chart | null = null;
    tab: 'workouts' | 'stats' | 'measurements' = 'workouts';
    periods = [
        {
            id: 1,
            name: this.translateService.instant('Last month'),
            value: (() => {
                const date = new Date();
                date.setMonth(date.getMonth() - 1);
                return date;
            })()
        },
        {
            id: 2,
            name: this.translateService.instant('Last 2 months'),
            value: (() => {
                const date = new Date();
                date.setMonth(date.getMonth() - 2);
                return date;
            })()
        },
        {
            id: 3,
            name: this.translateService.instant('Last 3 months'),
            value: (() => {
                const date = new Date();
                date.setMonth(date.getMonth() - 3);
                return date;
            })()
        },
        {
            id: 6,
            name: this.translateService.instant('Last 6 months'),
            value: (() => {
                const date = new Date();
                date.setMonth(date.getMonth() - 6);
                return date;
            })()
        },
        {
            id: 12,
            name: this.translateService.instant('Last year'),
            value: (() => {
                const date = new Date();
                date.setFullYear(date.getFullYear() - 1);
                return date;
            })()
        },
        {
            id: 24,
            name: this.translateService.instant('Last 2 years'),
            value: (() => {
                const date = new Date();
                date.setFullYear(date.getFullYear() - 2);
                return date;
            })()
        }
    ];

    selectedPeriod: any = 3;
    selectedPeriodValue;

    measurements = [];
    allExercises = [];
    showDetailsModal = false;

    actionsPopover = false;

    maxPerWorkoutExercise = ''
    maxLoadPerWorkoutExercise = ''
    maxVolumePerWorkoutExercise = ''
    cameraIcon = cameraOutline;
    eyeIcon = eyeOutline;
    upIcon = trendingUpOutline;
    downIcon = trendingDownOutline;
    shareIcon = shareSocialOutline;
    isSharing = false;

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
        private accountService: AccountService,
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private alertController: AlertController,
        public theme: ThemeService
    ) {
        this.selectedPeriodValue = this.periods.find(f => f.id == this.selectedPeriod)?.value;
        register();
        this.getSessions();
        theme.isDark();
    }

    async refresh() {
        this.continueFooter().refresh();
    }

    onPeriodChange($event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
        this.selectedPeriodValue = this.periods.find(f => f.id == this.selectedPeriod)?.value;
        this.getSessions()
    }

    maxPerWorkoutExerciseChange(e) {
        this.drawMaxPerWorkout(this.maxPerWorkoutExercise)
    }

    maxLoadPerWorkoutExerciseChange(e) {
        this.drawMaxLoadPerWorkout(this.maxPerWorkoutExercise)
    }

    maxVolumePerWorkoutExerciseChange(e) {
        this.drawMaxVolumePerWorkout(this.maxVolumePerWorkoutExercise);
    }

    async drawMaxPerWorkout(filter?: string) {
        const sortedWorkouts = [...this.workouts].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

        const maxPerWorkoutCtx = this.maxPerWorkout?.nativeElement.getContext('2d');
        if (maxPerWorkoutCtx) {
            // Get all unique workout names
            const workoutNames = Array.from(new Set(sortedWorkouts.flatMap(w =>
                w.exercises.map((ex: any) => ex.name)
            )));

            this.allExercises = [...workoutNames];

            if (filter == "" || !filter) {
                filter = this.allExercises[0];
                this.maxPerWorkoutExercise = filter;
            }

            // For each workout name, build a dataset of max weight per day
            const datasets = workoutNames.filter(w => w == filter).map(name => {
                const data = sortedWorkouts.map(workout => {
                    // Find all sets for this exercise name in this workout
                    const sets = workout.exercises
                        .filter((ex: any) => ex.name === name)
                        .flatMap((ex: any) => ex.sets || []);
                    // Get max weight for this workout for this exercise
                    const maxWeight = sets.length > 0 ? Math.max(...sets.map((set: any) => set.currentWeight || 0)) : null;
                    return maxWeight && maxWeight > 0 ? maxWeight : null;
                });

                return {
                    label: name,
                    data,
                    spanGaps: true,
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
    }

    async drawMaxLoadPerWorkout(filter?: string) {
        const sortedWorkouts = [...this.workouts].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
        const maxLoadPerWorkoutCtx = this.maxLoadPerWorkout?.nativeElement.getContext('2d');
        if (maxLoadPerWorkoutCtx) {
            // Get all unique workout names
            const workoutNames = Array.from(new Set(sortedWorkouts.flatMap(w =>
                w.exercises.map((ex: any) => ex.name)
            )));

            //this.allExercises = [...workoutNames];

            if (filter == "" || !filter) {
                filter = this.allExercises[0];
                this.maxLoadPerWorkoutExercise = filter;
            }

            // For each workout name, build a dataset of max load per day
            const datasets = workoutNames.filter(w => w == filter).map(name => {
                const data = sortedWorkouts.map(workout => {
                    // Find all sets for this exercise name in this workout
                    const sets = workout.exercises
                        .filter((ex: any) => ex.name === name)
                        .flatMap((ex: any) => ex.sets || []);

                    // Get max weight for this workout for this exercise
                    const maxWeight = sets.length > 0 ? Math.max(...sets.map((set: any) => set.currentWeight || 0)) : null;
                    // Count how many times max weight was lifted
                    const maxWeightCount = sets.filter((set: any) => set.currentWeight === maxWeight);

                    // Load is max weight * count
                    const maxLoad = (maxWeight && maxWeight > 0) ? maxWeight * maxWeightCount[0].currentValue : null;
                    return maxLoad;
                });

                return {
                    label: `${name}`,
                    data,
                    spanGaps: true,
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

    async drawMaxVolumePerWorkout(filter?: string) {
        const sortedWorkouts = [...this.workouts].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

        const workoutNames = Array.from(new Set(sortedWorkouts.flatMap(w =>
            w.exercises.map((ex: any) => ex.name)
        )));

        this.allExercises = [...workoutNames];

        if (filter == "" || !filter) {
            filter = this.allExercises[0];
            this.maxVolumePerWorkoutExercise = filter;
        }

        const datasets = workoutNames.filter(w => w == filter).map(name => {
            const data = sortedWorkouts.map(workout =>
                workout.exercises
                    .filter((ex: any) => ex.name === name)
                    .reduce((sum: number, ex: any) => {
                        return sum + (ex.sets?.reduce((s: number, set: any) => s + (set.currentValue * set.currentWeight || 0), 0) || 0)
                    }, 0)
            ).map(v => v > 0 ? v : null);

            return {
                label: name,
                data,
                spanGaps: true,
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

        this.drawMaxPerWorkout();
        this.drawMaxVolumePerWorkout();
        this.drawMaxLoadPerWorkout();

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

    async progressPhoto() {
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera,
            quality: 100
        });

        const arr = capturedPhoto.dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];;
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'progress_photo', { type: mime });

        const user = await this.accountService.getCurrentUser();

        const progressPhoto = {
            user: user.id

        }
        const formData = new FormData();
        formData.append('photo', file);

        const progressCreated = await this.pocketbaseService.progressPhotos.create(progressPhoto);
        const uptdAvatar: any = await this.pocketbaseService.progressPhotos.update(progressCreated.id, formData);

        this.actionsPopover = false;
        await this.getProgressPhotos();

    }

    progressPhotos = [];

    async getProgressPhotos() {
        const photos = await this.pocketbaseService.progressPhotos.getFullList({ sort: '-created' });
        this.progressPhotos.length = 0;
        if (photos && photos.length) {

            for (let i = 0; i < photos.length; i++) {
                const token = await this.pocketbaseService.pb.files.getToken({ headers: PB.HEADER.NO_TOAST });
                const file = this.pocketbaseService.pb.files.getURL(photos[i], photos[i].photo, { token })
                this.progressPhotos.push({
                    id: photos[i].id,
                    photo: file,
                    date: photos[i].created
                })
            }
        }
    }

    async getMeasurements() {

        await this.getProgressPhotos();

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
        const workouts = await this.pocketbaseService.workouts.getFullList({
            filter: `state = "${WorkoutState.Completed}" && start >= "${this.selectedPeriodValue.toISOString()}"`,
            sort: '-created',
            expand: 'trainer,exercises,exercises.sets,day,user',
        }) as any;

        if (!workouts) return;

        this.workouts = workouts.map(workout => workout);

        this.workouts.forEach(workout => {
            const tags = workout.exercises.map(exercise => exercise.primaryMuscles);
            workout.tags = Array.from(new Set(tags.flat()));

            const allTags = [...workout.tags]

            const tagsToShow: any[] = [...allTags].splice(0, 3);

            if (allTags.length > 3) {
                tagsToShow.push(`+${allTags.length - 3}`);
            }

            workout.tagsToShow = tagsToShow;
            workout.load = workout.exercises.reduce((total, exercise) => {
                return total + (exercise.sets?.reduce((sum, set) => sum + (set.weight || 0), 0) || 0);
            }, 0);

            workout.exercises.forEach(e => {
                const summary = e.sets.map(s => {
                    let val = `${s.currentValue}`;
                    if (s.weightType == WeightType.LB) {
                        val += `@${s.currentWeight}lb`
                    } else if (s.weightType == WeightType.KG) {
                        val += `@${s.currentWeight}kg`
                    } else if (s.weightType == WeightType.BW) {
                        val += `@bw`
                    }
                    return val;
                })

                e.summary = summary?.join(', ') ?? '';
            })

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
        }
        this.getMeasurements();
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
        }
        this.getMeasurements();
    }

    private calculateTrends() {
        this.currentWorkout.exercises.forEach(e => {
            e.currentLoad = e.sets.reduce((sum, s) => sum + ((s.currentWeight || 0) * (s.currentValue || 0)), 0);
            e.previousLoad = e.sets.reduce((sum, s) => sum + ((s.previousWeight || 0) * (s.previousValue || 0)), 0);
            e.isTrendingUp = e.currentLoad > e.previousLoad;
            e.trendPercent = e.previousLoad === 0
                ? (e.currentLoad > 0 ? 100 : 0)
                : ((e.currentLoad - e.previousLoad) / Math.abs(e.previousLoad)) * 100;
        })
    }

    async openSettings(workout) {
        const translations = await lastValueFrom(this.translateService.get([
            'Share', 'Details', 'Edit', 'Delete',
        ]));

        const actionSheet = await this.actionSheetCtrl.create({
            header: translations.workout,
            buttons: [
                {
                    text: translations.Share,
                    icon: this.shareIcon,
                    handler: async () => {
                        this.currentWorkout = workout;
                        this.calculateTrends();

                        this.showDetailsModal = true;

                        setTimeout(async () => {
                            await this.share()
                            this.showDetailsModal = false;
                        }, 1000)
                    }
                },
                {
                    text: translations.Details,
                    icon: this.eyeIcon,
                    handler: () => {
                        this.currentWorkout = workout;
                        this.calculateTrends()
                        this.showDetailsModal = true;
                    }
                },
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
                        const alert = await this.alertController.create({
                            message: this.translateService.instant('Are you sure? This action cannot be undone.'),
                            buttons: [
                                {
                                    text: this.translateService.instant('Yes'),
                                    role: 'destructive',
                                    handler: async () => {
                                        return true;
                                    }
                                },
                                {
                                    text: this.translateService.instant('No'),
                                    role: 'cancel',
                                    handler: () => {
                                        return false;
                                    }
                                },
                            ],
                        });
                        await alert.present();
                        const d = await alert.onDidDismiss();
                        if (d && d.role === 'destructive') {
                            await this.pocketbaseService.workouts.delete(workout.id);
                            this.workouts = this.workouts.filter(w => w.id !== workout.id);
                        }
                    }
                }
            ]
        });

        await actionSheet.present();
    }

    async openPhotoSettings(photo) {
        const translations = await lastValueFrom(this.translateService.get(['Delete']));

        const actionSheet = await this.actionSheetCtrl.create({
            header: this.translateService.instant('Progress photo'),
            buttons: [
                {
                    text: translations.Delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    handler: async () => {
                        await this.pocketbaseService.progressPhotos.delete(photo.id);
                        this.progressPhotos = this.progressPhotos.filter(w => w.id !== photo.id);
                    }
                }
            ]
        });

        await actionSheet.present();
    }

    async shareDirect() {

    }

    async share() {
        const el = document.getElementById('details');
        if (!el) return
        const canvas = await html2canvas(el, {
            backgroundColor: this.theme.isDark() ? '#1b1b20' : '#ebebeb',
        });
        canvas.toBlob(async blob => {
            if (!blob) return;
            this.isSharing = false;
            const date = this.currentWorkout?.created
                ? new Date(this.currentWorkout.created)
                : new Date();
            const pad = (n: number) => n.toString().padStart(2, '0');
            const fileName = `Workout_${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `RYPM. ${await this.translateService.instant('Workout')} ${await this.translateService.instant('from')} ${date.toLocaleDateString()}`,
                    text: `${await this.translateService.instant('Take a look at my progress.')}`
                });
            }
        });
    }
}
