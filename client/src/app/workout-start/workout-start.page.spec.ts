import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkoutStartPage } from './workout-start.page';

describe('WorkoutStartPage', () => {
  let component: WorkoutStartPage;
  let fixture: ComponentFixture<WorkoutStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), WorkoutStartPage]
}).compileComponents();

    fixture = TestBed.createComponent(WorkoutStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
