import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainerProfilePage } from './trainer-profile.page';

describe('TrainerProfilePage', () => {
  let component: TrainerProfilePage;
  let fixture: ComponentFixture<TrainerProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), TrainerProfilePage]
}).compileComponents();

    fixture = TestBed.createComponent(TrainerProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
