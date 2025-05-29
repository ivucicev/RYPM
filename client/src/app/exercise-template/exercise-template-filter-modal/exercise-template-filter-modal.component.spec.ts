import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExerciseTemplateFilterModalComponent } from './exercise-template-filter-modal.component';

describe('ExerciseTemplateFilterModalComponent', () => {
  let component: ExerciseTemplateFilterModalComponent;
  let fixture: ComponentFixture<ExerciseTemplateFilterModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseTemplateFilterModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTemplateFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
