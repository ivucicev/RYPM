import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/standalone';

import { RestPage } from './rest.page';

describe('RestPage', () => {
    let component: RestPage;
    let fixture: ComponentFixture<RestPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), RestPage]
        }).compileComponents();

        fixture = TestBed.createComponent(RestPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
