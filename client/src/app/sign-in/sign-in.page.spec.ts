import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/standalone';

import { SignInPage } from './sign-in.page';

describe('SignInPage', () => {
    let component: SignInPage;
    let fixture: ComponentFixture<SignInPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), SignInPage]
        }).compileComponents();

        fixture = TestBed.createComponent(SignInPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
