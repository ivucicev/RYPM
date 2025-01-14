import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WeightProgramsPage } from './weight-programs.page';

describe('WeightProgramsPage', () => {
  let component: WeightProgramsPage;
  let fixture: ComponentFixture<WeightProgramsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), WeightProgramsPage]
}).compileComponents();

    fixture = TestBed.createComponent(WeightProgramsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
