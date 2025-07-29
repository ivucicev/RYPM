import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../core/services/account.service';
import { RegisterBM, } from '../core/models/bm/register-bm';
import { FormType } from '../core/helpers/form-helpers';
import { ErrorMessageDirective } from '../core/directives/error-message.directive';
import { UserType } from '../core/models/enums/user-type';
import { IonItem, IonFooter, IonButton, IonList, IonSegmentButton, IonIcon, IonContent, IonBackButton, IonToolbar, IonHeader, IonTitle, IonButtons, IonInput, IonSegment } from "@ionic/angular/standalone";

@Component({
    selector: 'app-register',
    templateUrl: 'register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonButtons, IonInput, IonTitle, IonHeader, IonToolbar, IonBackButton, IonContent, IonIcon, IonSegmentButton, IonSegment, IonList, IonButton, IonFooter, IonItem, TranslateModule, ReactiveFormsModule, ErrorMessageDirective],
})
export class RegisterPage implements OnInit {

    registrationForm: FormGroup<FormType<RegisterBM>>;

    userTypes = UserType;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService
    ) {
    }

    ngOnInit() {
        this.registrationForm = this.formBuilder.group({
            avatar: [],
            type: [UserType.User],
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    register() {
        if (this.registrationForm.invalid) {
            this.registrationForm.markAsDirty();
            this.registrationForm.markAllAsTouched();
            return;
        }
        const model = this.registrationForm.getRawValue();
        this.accountService.register(model);
    }
}
