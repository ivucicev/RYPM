import { Component, input, viewChild } from '@angular/core';
import { NavController, IonIcon, IonButton, IonFooter } from '@ionic/angular/standalone';
import { RestBadgeComponent } from '../rest-badge/rest-badge.component';
import { PocketbaseService } from 'src/app/core/services/pocketbase.service';
import { Workout } from 'src/app/core/models/collections/workout';
import { TranslatePipe } from '@ngx-translate/core';
import { Exercise } from 'src/app/core/models/collections/exercise';
import { WorkoutState } from 'src/app/core/models/enums/workout-state';
import { Set } from 'src/app/core/models/collections/exercise-set';
import { SetBM } from 'src/app/core/models/bm/exercise-set-bm';
import { PB } from 'src/app/core/constants/pb-constants';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageKeys } from 'src/app/core/constants/storage-keys';

@Component({
    selector: 'app-continue-footer',
    templateUrl: 'continue-footer.component.html',
    styleUrls: ['./continue-footer.component.scss'],
    imports: [IonFooter, IonButton, IonIcon, RestBadgeComponent, TranslatePipe],
    standalone: true
})
export class ContinueFooterComponent {

    workout: Workout = null;
    lastCompletedSetExercise: Exercise = null;
    lastCompletedSet: Set = null;

    timerOnly = input<boolean>();

    restBadge = viewChild(RestBadgeComponent);

    constructor(
        private pocketbaseService: PocketbaseService,
        private navCtrl: NavController,
        private storageService: StorageService
    ) {
        /* if ('Notification' in window && Notification.permission !== 'granted') {
             Notification.requestPermission();

             new Notification('Rest timer completed', {
                 body: 'Time to continue your workout!',
                 //icon: '/assets/icons/icon-72x72.png'
             });
         }*/
    }

    navToActiveWorkout() {
        this.navCtrl.navigateForward(['./workout-wizard', this.workout.id]);
    }

    async refresh() {
        this.restBadge()?.stopRest();

        this.lastCompletedSet = null;
        this.lastCompletedSetExercise = null;
        this.workout = null;

        let workout = await this.storageService.getItem<Workout>(StorageKeys.WIZARD_LAST_WORKOUT)
        let workoutCheck = null;
        try {
            workoutCheck = await this.pocketbaseService.workouts.getFirstListItem(
                `state = ${WorkoutState.InProgress}`,
                {
                    fields: 'id,state'
                }
            );
        } catch {
            // not found
            this.storageService.removeItem(StorageKeys.WIZARD_LAST_WORKOUT);
            return;
        }

        // fetch only if the workout is outdated
        if (!workout || workout.state != WorkoutState.InProgress || workoutCheck.id != workout.id || true) {
            this.storageService.removeItem(StorageKeys.WIZARD_LAST_WORKOUT);

            this.workout = null;
            this.lastCompletedSet = null;
            this.lastCompletedSetExercise = null;

            workout = await this.pocketbaseService.workouts.getFirstListItem(
                `state = ${WorkoutState.InProgress}`,
                {
                    expand: 'exercises_via_workout,exercises_via_workout.sets_via_exercise',
                    sort: '-updated',
                }
            )
            if (!workout) {
                return;
            }

            this.storageService.setItem(StorageKeys.WIZARD_LAST_WORKOUT, workout);
        }
        this.workout = workout;

        const lastCompletedSet = this.workout.exercises.flatMap(e => e.sets)
            .filter(s => s.completed && s.completedAt)
            .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt)?.getTime())[0]

        if (!lastCompletedSet || lastCompletedSet.restSkipped) {
            return;
        }

        const lastCompletedSetExercise = this.workout.exercises.find(e => e.sets.includes(lastCompletedSet));
        if (this.lastCompletedSet?.restSkipped != lastCompletedSet.restSkipped
            || this.lastCompletedSet?.completedAt != lastCompletedSet.completedAt
            || this.lastCompletedSet?.id != lastCompletedSet.id
        ) {
            this.lastCompletedSet = lastCompletedSet;
            this.lastCompletedSetExercise = lastCompletedSetExercise;
        }

    }

    onRestSkipped() {
        this.pocketbaseService.sets.update(
            this.lastCompletedSet.id,
            { restSkipped: true } as SetBM,
            { headers: { ...PB.HEADER.NO_TOAST } }
        );
    }
}
