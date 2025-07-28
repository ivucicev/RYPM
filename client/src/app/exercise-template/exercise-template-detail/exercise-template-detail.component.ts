import { Component, Input } from '@angular/core';
import { ModalController, IonHeader, IonButton, IonButtons, IonTitle, IonToolbar, IonContent, IonChip, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseTemplate } from '../../core/models/collections/exercise-templates';

@Component({
    selector: 'app-exercise-template-detail',
    templateUrl: 'exercise-template-detail.component.html',
    styleUrls: ['./exercise-template-detail.component.scss'],
    standalone: true,
    imports: [IonIcon, IonChip, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonHeader, CommonModule, TranslateModule]
})
export class ExerciseTemplateDetailComponent {
    @Input() exercise!: ExerciseTemplate;

    constructor(private modalCtrl: ModalController) { }

    dismiss() {
        this.modalCtrl.dismiss();
    }
}
