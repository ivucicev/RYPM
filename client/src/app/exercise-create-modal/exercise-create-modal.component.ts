import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-exercise-create-modal',
	templateUrl: './exercise-create-modal.component.html',
	styleUrls: ['./exercise-create-modal.component.scss'],
	standalone: true,
	imports: [IonicModule, FormsModule, TranslateModule]
})
export class ExerciseCreateModalComponent {

	name: string = '';
	primaryMuscles: string[] = [];
	secondaryMuscles: string[] = [];
	instructions: string = '';
	selectedEquipment: any = 'N/A';
	selectedForce: any = 'N/A';
	selectedCategory: any = 'N/A';
	selectedMechanic: any = 'N/A';
	selectedLevel: any = 'N/A';

	muscles: string[] = ['abdominals', 'hamstrings', 'calves', 'shoulders', 'adductors', 'glutes', 'quadriceps', 'biceps', 'forearms', 'abductors', 'triceps', 'chest', 'lowerback', 'traps', 'middleback', 'lats'];
	force: string[] = ['N/A', 'push', 'pull', 'static'];
	level: string[] = ['N/A','beginner', 'intermediate', 'expert'];
	mechanic: string[] = ['N/A','isolation', 'compound'];
	equipment: string[] = ['N/A','bodyonly', 'machine', 'other', 'foamroll', 'kettlebells', 'dumbbell', 'cable'];
	category: string[] = ['N/A','strength', 'stretching', 'plyometrics'];

	constructor(private modalController: ModalController) { }

	save() {
		this.modalController.dismiss({
			name: this.name,
			primaryMuscles: this.primaryMuscles,
			secondaryMuscles: this.secondaryMuscles,
			instructions: this.instructions,
			equipment: this.selectedEquipment,
			force: this.selectedForce,
			category: this.selectedCategory,
			mechanic: this.selectedMechanic,
			level: this.selectedLevel});
	}

	dismiss() {
		this.modalController.dismiss();
	}

	toggleSecondaryMuscle(muscle: string) {
		const index = this.secondaryMuscles.indexOf(muscle);
		if (index > -1) {
			this.secondaryMuscles.splice(index, 1);
		} else {
			this.secondaryMuscles.push(muscle);
		}
	}

	togglePrimaryMuscle(muscle: string) {
		const index = this.primaryMuscles.indexOf(muscle);
		if (index > -1) {
			this.primaryMuscles.splice(index, 1);
		} else {
			this.primaryMuscles.push(muscle);
		}
	}

}