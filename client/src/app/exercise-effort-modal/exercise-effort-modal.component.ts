import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonTextarea, ModalController, IonHeader, IonButtons, IonToolbar, IonButton, IonItem, IonContent, IonChip, IonTitle, IonModal, IonDatetimeButton, IonRange, IonDatetime, IonLabel, IonRow, IonCol } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { TZDate } from "@date-fns/tz";

@Component({
    selector: 'app-exercise-effort-modal',
    templateUrl: 'exercise-effort-modal.component.html',
    styleUrls: ['./exercise-effort-modal.component.scss'],
    imports: [IonDatetimeButton, IonModal, IonRow, IonCol, IonTextarea, IonRange, IonDatetime, IonTitle, IonChip, IonContent, IonItem, IonButton, IonToolbar, IonButtons, IonHeader, FormsModule, TranslateModule, IonLabel],
    standalone: true
})
export class ExerciseEffortModalComponent implements OnInit {

    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    @Input() effort: string = '';
    @Input() comment: string = '';
    @Input() start: string = '';
    @Input() end: string = '';

    @ViewChild('textArea') textArea: IonTextarea;

    workoutEffortValues = [
        { value: 0, label: 'What am I doing?', color: 'info' },
        { value: 1, label: 'Very Easy', color: 'secondary' },
        { value: 2, label: 'Easy', color: 'secondary' },
        { value: 3, label: 'Moderate', color: 'secondary' },
        { value: 4, label: 'Could do better', color: 'success' },
        { value: 5, label: 'Should do better', color: 'success' },
        { value: 6, label: 'Challenging', color: 'success' },
        { value: 7, label: 'Hard', color: 'warning' },
        { value: 8, label: 'Very Hard', color: 'warning' },
        { value: 9, label: 'Intense', color: 'danger' },
        { value: 10, label: 'All Out', color: 'danger' }
    ];

    locale: string = 'en-US'; // Default locale, can be changed based on user preference

    constructor(private modalController: ModalController) {

        if (navigator.language) {
            this.locale = navigator.language;
        }
    }

    ngOnInit() {
        this.effort = this.effort;
        this.comment = this.comment;
        this.start = new TZDate(this.start, this.timezone).toISOString();
        this.end = new TZDate(this.end, this.timezone).toISOString();
    }

    ionViewDidEnter() {
        this.textArea.getInputElement().then(e => {
            const length = e.value.length;
            e.focus();
            e.setSelectionRange(length, length);
        });
    }

    save() {
        this.modalController.dismiss({
            comment: this.comment,
            effort: this.effort,
            start: this.start,
            end: this.end
        });
    }

    dismiss() {
        this.modalController.dismiss();
    }
}
