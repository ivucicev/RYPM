import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../core/services/account.service';
import { RegisterBM, } from '../core/models/bm/register-bm';
import { FormType } from '../core/helpers/form-helpers';
import { ErrorMessageDirective } from '../core/directives/error-message.directive';
import { UserType } from '../core/models/enums/user-type';
import { IonItem, IonFooter, IonButton, IonList, IonSegmentButton, IonIcon, IonContent, IonBackButton, IonToolbar, IonHeader, IonTitle, IonButtons, IonInput, IonSegment, IonInputPasswordToggle, IonCheckbox, IonLabel, IonRow } from "@ionic/angular/standalone";
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: 'register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonButtons, IonRow, IonInput, IonLabel, IonCheckbox, IonInputPasswordToggle, IonHeader, IonToolbar, IonBackButton, IonContent, IonIcon, IonSegmentButton, IonSegment, IonList, IonButton, IonFooter, IonItem, TranslateModule, ReactiveFormsModule, ErrorMessageDirective, IonLabel],
})
export class RegisterPage implements OnInit {

    registrationForm: FormGroup<FormType<any>>;

    userTypes = UserType;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private route: Router
    ) {
    }

    ngOnInit() {
        this.registrationForm = this.formBuilder.group<any>({
            avatar: [],
            type: [UserType.User],
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required,
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?]).{8,}$'),
                , Validators.minLength(8)]],
            passwordConfirm: [
                '',
                [
                    Validators.required,
                    (control) => {
                        const password = control.parent?.get('password')?.value;
                        const passwordConfirm = control.value;
                        return (password === passwordConfirm ? null : { passwordConfirm: true });
                    },
                    Validators.minLength(8)
                ]
            ],
            terms: [false, [Validators.requiredTrue]]
        });
    }

    showTerms() {
        this.route.navigate(['./terms-condition']);
    }

    register() {
        if (this.registrationForm.invalid) {
            this.registrationForm.markAsDirty();
            this.registrationForm.markAllAsTouched();
            return;
        }
        const model = this.registrationForm.getRawValue();
        this.accountService.register(model as any);
    }
}
