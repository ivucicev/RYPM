import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonTextarea, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-exercise-notes-modal',
    templateUrl: 'exercise-notes-modal.component.html',
    styleUrls: ['./exercise-notes-modal.component.scss'],
    imports: [IonicModule, FormsModule, TranslateModule],
    standalone: true
})
export class ExerciseNotesModalComponent implements OnInit {

    @Input() notes: string = '';
    @Input() exerciseName: string = '';

    @ViewChild('textArea') textArea: IonTextarea;

    notesText: string = '';

    constructor(private modalController: ModalController) { }

    ngOnInit() {
        this.notesText = this.notes;
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
            notes: this.notesText
        });
    }

    dismiss() {
        this.modalController.dismiss();
    }
}
