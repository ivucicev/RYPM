import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/standalone';

import { ExerciseNotesModalComponent } from './exercise-notes-modal.component';

describe('ExerciseNotesModalComponent', () => {
    let component: ExerciseNotesModalComponent;
    let fixture: ComponentFixture<ExerciseNotesModalComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ExerciseNotesModalComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ExerciseNotesModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
