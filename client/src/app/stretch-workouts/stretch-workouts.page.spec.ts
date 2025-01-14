import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StretchWorkoutsPage } from './stretch-workouts.page';

describe('StretchWorkoutsPage', () => {
  let component: StretchWorkoutsPage;
  let fixture: ComponentFixture<StretchWorkoutsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), StretchWorkoutsPage]
}).compileComponents();

    fixture = TestBed.createComponent(StretchWorkoutsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
