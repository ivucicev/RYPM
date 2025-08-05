import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonTextarea, ModalController, IonHeader, IonButtons, IonToolbar, IonButton, IonItem, IonContent, IonChip, IonTitle, IonModal, IonDatetimeButton, IonRange, IonDatetime, IonLabel, IonSelectModal, IonSelectOption, IonSelect, IonInput } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-measurement-create-modal',
    templateUrl: 'measurement-create-modal.component.html',
    styleUrls: ['./measurement-create-modal.component.scss'],
    imports: [IonSelectOption, IonInput, IonSelect, IonLabel, IonTitle, IonContent, IonItem, IonButton, IonToolbar, IonButtons, IonHeader, FormsModule, TranslateModule],
    standalone: true
})
export class MeasurementCreateModalComponent implements OnInit {

    @Input() name: string = '';
    @Input() id: string = '';
    @Input() unit: string = '';

    public units = ['kg', 'lb', 'cm', 'in', 'ft', '%'];

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
        
    }

    save() {
        this.modalController.dismiss({
            name: this.name,
            id: this.id,
            unit: this.unit
        });
    }

    dismiss() {
        this.modalController.dismiss();
    }
}
