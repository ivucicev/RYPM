import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseTemplate } from '../../core/models/collections/exercise-templates';

@Component({
    selector: 'app-exercise-template-detail',
    templateUrl: 'exercise-template-detail.component.html',
    styleUrls: ['./exercise-template-detail.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, TranslateModule]
})
export class ExerciseTemplateDetailComponent {
    @Input() exercise!: ExerciseTemplate;

    constructor(private modalCtrl: ModalController) { }

    dismiss() {
        this.modalCtrl.dismiss();
    }
}
