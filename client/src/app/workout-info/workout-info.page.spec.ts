import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/standalone';

import { WorkoutInfoPage } from './workout-info.page';

describe('WorkoutInfoPage', () => {
    let component: WorkoutInfoPage;
    let fixture: ComponentFixture<WorkoutInfoPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), WorkoutInfoPage]
        }).compileComponents();

        fixture = TestBed.createComponent(WorkoutInfoPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
