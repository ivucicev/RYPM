import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonTextarea, ModalController, IonHeader, IonButtons, IonToolbar, IonButton, IonItem, IonContent, IonChip, IonTitle, IonModal, IonDatetimeButton, IonRange, IonDatetime, IonLabel, IonSelectModal, IonSelectOption, IonSelect, IonInput, IonList, IonNote, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { DateTimePipe } from "../core/pipes/datetime.pipe";

@Component({
    selector: 'app-measurement-create-modal',
    templateUrl: 'measurement-create-modal.component.html',
    styleUrls: ['./measurement-create-modal.component.scss'],
    imports: [IonSelectOption, IonInput, IonList, IonIcon, IonSelect, IonLabel, IonTitle, IonContent, IonItem, IonButton, IonToolbar, IonButtons, IonHeader, FormsModule, TranslateModule, DateTimePipe, IonNote, IonItemSliding, IonItemOptions, IonItemOption],
    standalone: true
})
export class MeasurementCreateModalComponent implements OnInit {

    @Input() name: string = '';
    @Input() id: string = '';
    @Input() unit: string = '';

    public measurements = [];

    public units = ['kg', 'lb', 'cm', 'in', 'ft', '%'];

    constructor(private modalController: ModalController, private pocketbaseService: PocketbaseService) {
    }

    async delete() {
        await this.pocketbaseService.measurements.delete(this.id);
        this.dismiss();
    }

    async getMeasurements() {
        const data = await this.pocketbaseService.measurementEntries.getFullList({
            filter: `measurement = "${this.id}"`,
            sort: '-date'
        }) as any;

        this.measurements = [...data]

    }

    async removeMeasure(measurement) {
        await this.pocketbaseService.measurementEntries.delete(measurement.id);

        this.measurements = this.measurements.filter(f => f.id != measurement.id);
    }

    async ngOnInit() {
        if (this.id)
            this.getMeasurements();
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
