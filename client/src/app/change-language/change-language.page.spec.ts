import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/standalone';

import { ChangeLanguagePage } from './change-language.page';

describe('ChangeLanguagePage', () => {
    let component: ChangeLanguagePage;
    let fixture: ComponentFixture<ChangeLanguagePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), ChangeLanguagePage]
        }).compileComponents();

        fixture = TestBed.createComponent(ChangeLanguagePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
