import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/standalone';

import { GetProPage } from './get-pro.page';

describe('GetProPage', () => {
    let component: GetProPage;
    let fixture: ComponentFixture<GetProPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), GetProPage]
        }).compileComponents();

        fixture = TestBed.createComponent(GetProPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
