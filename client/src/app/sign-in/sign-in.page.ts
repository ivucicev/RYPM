import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavController, IonButton, IonCol, IonRow, IonIcon, IonList, IonContent, IonToolbar, IonHeader, IonButtons, IonBackButton, IonItem, IonInput, IonInputPasswordToggle } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from '../core/services/account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginBM } from '../core/models/bm/login-bm';
import { FormType } from '../core/helpers/form-helpers';
import { filter, Subject, takeUntil } from 'rxjs';
import { logoFacebook, logoGoogle } from 'ionicons/icons';

// @ts-ignore
import packageJson from '../../../package.json';

@Component({      
    selector: 'app-sign-in',
    templateUrl: 'sign-in.page.html',
    styleUrls: ['./sign-in.page.scss'],
    standalone: true,
    imports: [IonItem, IonBackButton, IonButtons, IonHeader, IonToolbar, IonContent, IonList, IonIcon, IonRow, IonCol, IonButton, TranslateModule, ReactiveFormsModule, IonInput, IonInputPasswordToggle],
})
export class SignInPage implements OnInit {

    private unsubscribeAll = new Subject();

    loginForm: FormGroup<FormType<LoginBM>>;
    navigatedTo = false;
    logoFacebook = logoFacebook;
    logoGoogle = logoGoogle;
    version = packageJson.version;
 
    constructor(
        private router: Router,
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        private navCtrl: NavController
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    ionViewWillEnter() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).pipe(takeUntil(this.unsubscribeAll))
            .subscribe((event: NavigationEnd) => {
                this.navigatedTo = event.url !== '/sign-in' && event.urlAfterRedirects === '/sign-in';
            });
    }

    ionViewWillLeave() {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete()
    }

    close() {
        this.navCtrl.back();
    }

    register() {
        this.router.navigate(['./register']);
    }

    forgot_password() {
        this.router.navigate(['./forgot-password']);
    }

    async signIn() {
        if (this.loginForm.invalid) {
            this.loginForm.markAsDirty();
            return;
        }

        const model = this.loginForm.getRawValue();
        await this.accountService.login(model);
    }

    async signInFacebook() {
        await this.accountService.loginWithFacebook();
    }

    async signInGoogle() {
        await this.accountService.loginWithGoogle();
    }

}
