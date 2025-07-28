import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/standalone';

import { HelpPage } from './help.page';

describe('HelpPage', () => {
    let component: HelpPage;
    let fixture: ComponentFixture<HelpPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), HelpPage]
        }).compileComponents();

        fixture = TestBed.createComponent(HelpPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
