import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/standalone';

import { MyActivityPage } from './my-activity.page';

describe('MyActivityPage', () => {
    let component: MyActivityPage;
    let fixture: ComponentFixture<MyActivityPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), MyActivityPage]
        }).compileComponents();

        fixture = TestBed.createComponent(MyActivityPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
