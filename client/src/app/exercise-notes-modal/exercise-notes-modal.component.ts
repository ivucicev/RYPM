import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-exercise-notes-modal',
    templateUrl: './exercise-notes-modal.component.html',
    styleUrls: ['./exercise-notes-modal.component.scss'],
    imports: [IonicModule, FormsModule, TranslateModule],
    standalone: true
})
export class ExerciseNotesModalComponent implements OnInit {

    @Input() notes: string = '';
    @Input() exerciseName: string = '';

    notesText: string = '';

    constructor(private modalController: ModalController) { }

    ngOnInit() {
        this.notesText = this.notes;
    }

    save() {
        this.modalController.dismiss({
            notes: this.notesText
        });
    }

    dismiss() {
        this.modalController.dismiss();
    }
}
