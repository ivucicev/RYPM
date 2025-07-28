import { Component, input } from '@angular/core';
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
    workoutId = input<string>();

    constructor(
        private pocketbaseService: PocketbaseService,
        private navCtrl: NavController
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

    refresh() {
        this.workout = null;
        this.lastCompletedSet = null;
        this.lastCompletedSetExercise = null;

        this.pocketbaseService.workouts.getFirstListItem(
            `state = ${WorkoutState.InProgress}` + (this.workoutId() ? (` && id = "${this.workoutId()}"`) : ''),
            {
                expand: 'exercises,exercises.sets',
                sort: '-updated',
            }
        ).then(workout => {
            if (!workout) {
                return;
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
        }).catch(err => {
            // ignore
        })
    }

    timerCompleted() {

    }

    onRestSkipped() {
        this.pocketbaseService.sets.update(
            this.lastCompletedSet.id,
            { restSkipped: true } as SetBM,
            { headers: { ...PB.HEADER.NO_TOAST } }
        );
    }
}
