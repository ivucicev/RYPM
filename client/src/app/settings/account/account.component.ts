import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountBM } from 'src/app/core/models/bm/account-bm';
import { PB } from 'src/app/core/constants/pb-constants';
import { ErrorMessageDirective } from 'src/app/core/directives/error-message.directive';
import { FormType } from 'src/app/core/helpers/form-helpers';
import { AccountService } from 'src/app/core/services/account.service';
import { PocketbaseService } from 'src/app/core/services/pocketbase.service';
import { ToastService } from 'src/app/core/services/toast-service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, ReactiveFormsModule, FormsModule, ErrorMessageDirective],
})
export class AccountComponent implements OnInit {

    accountForm: FormGroup<FormType<AccountBM>>;
    imageSrc: string | ArrayBuffer | null = null;

    isEditing = false;

    constructor(
        private formBuilder: FormBuilder,
        private pocketbaseService: PocketbaseService,
        private accountService: AccountService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.init();
    }

    async init(reload = false) {
        this.accountForm = this.formBuilder.group({
            email: ['']
        });

        this.accountService.getCurrentUser(reload).then(user => {
            this.accountForm = this.formBuilder.group({
                email: [user.email, [Validators.required, Validators.email]],
            });

            this.accountForm.disable();
            this.accountForm.markAsPristine();
        });
        this.accountForm.disable();

        this.isEditing = false;
    }

    enterEditMode() {
        this.isEditing = true;
        this.accountForm.enable();

        this.accountForm.markAsPristine();
    }

    cancelEditMode() {
        this.isEditing = false;
        this.accountForm.disable();

        if (this.accountForm.dirty || this.accountForm.touched) {
            this.init(true);
        }
    }

    get model() {
        const model = this.accountForm.getRawValue();
        return model;
    }

    async saveChanges() {
        const user = await this.accountService.getCurrentUser();

        const model = this.model;

        const newEmail = model.email;
        const currentEmail = user.email;

        model.email = currentEmail;
        this.pocketbaseService.users.update(
            user.id,
            model, { headers: PB.HEADER.NO_TOAST }
        ).then(async res => {
            if (!res) return;

            if (newEmail != currentEmail) {
                this.accountService.requestEmailChange(newEmail);
            } else {
                this.toastService.success();
            }

            this.cancelEditMode();
        });
    }
}
