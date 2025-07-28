import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/standalone';

import { ChestWorkoutsPage } from './chest-workouts.page';

describe('ChestWorkoutsPage', () => {
    let component: ChestWorkoutsPage;
    let fixture: ComponentFixture<ChestWorkoutsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), ChestWorkoutsPage]
        }).compileComponents();

        fixture = TestBed.createComponent(ChestWorkoutsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
