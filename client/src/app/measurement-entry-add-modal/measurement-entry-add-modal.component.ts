import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonTextarea, ModalController, IonHeader, IonButtons, IonToolbar, IonButton, IonItem, IonContent, IonChip, IonTitle, IonModal, IonDatetimeButton, IonRange, IonDatetime, IonLabel, IonSelectModal, IonSelectOption, IonSelect, IonInput } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-measurement-entry-add-modal',
    templateUrl: 'measurement-entry-add-modal.component.html',
    styleUrls: ['./measurement-entry-add-modal.component.scss'],
    imports: [IonDatetime, IonModal, IonDatetimeButton, IonInput, IonLabel, IonTitle, IonContent, IonItem, IonButton, IonToolbar, IonButtons, IonHeader, FormsModule, TranslateModule],
    standalone: true
})
export class MeasurementEntryAddModal implements OnInit {

    @Input() id: string = '';
    @Input() value: string = '';
    @Input() date: Date = new Date()

    locale: string = 'en-US'; // Default locale, can be changed based on user preference

    constructor(private modalController: ModalController) {
        if (navigator.language) {
            this.locale = navigator.language;
        }
    }

    ngOnInit() {

    }

    save() {
        this.modalController.dismiss({
            value: this.value,
            id: this.id,
            date: this.date ?? new Date()
        });
    }

    dismiss() {
        this.modalController.dismiss();
    }
}
