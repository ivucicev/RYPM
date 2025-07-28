import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/standalone';

import { MyTrainersPage } from './my-trainers.page';

describe('MyTrainersPage', () => {
    let component: MyTrainersPage;
    let fixture: ComponentFixture<MyTrainersPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), MyTrainersPage]
        }).compileComponents();

        fixture = TestBed.createComponent(MyTrainersPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
