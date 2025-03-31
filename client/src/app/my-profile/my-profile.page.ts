import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormType } from '../core/helpers/form-helpers';
import { ProfileBM } from '../core/models/bm/profile-bm';
import { ErrorMessageDirective } from '../core/directives/error-message.directive';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { ImageInputComponent } from '../shared/image-input/image-input.component';
import { UserType } from '../core/models/user-type';
import { AccountService } from '../core/services/account.service';
import { PB } from '../core/constants/pb-constants';
import { ToastService } from '../core/services/toast-service';

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.page.html',
    styleUrls: ['./my-profile.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, ReactiveFormsModule, FormsModule, ErrorMessageDirective, ImageInputComponent],
})
export class MyProfilePage implements OnInit {

    profileForm: FormGroup<FormType<ProfileBM>>;
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
        this.profileForm = this.formBuilder.group({
            type: [],
            avatar: [],
            name: [],
            email: []
        });

        this.accountService.getCurrentUser(reload).then(user => {
            this.profileForm = this.formBuilder.group({
                type: [user.type ?? UserType.Trainer],
                avatar: [user.avatar],
                name: [user.name, [Validators.required]],
                email: [user.email, [Validators.required, Validators.email]]
            });

            this.profileForm.disable();
            this.profileForm.markAsPristine();
        });
        this.profileForm.disable();

        this.isEditing = false;
    }

    enterEditMode() {
        this.isEditing = true;
        this.profileForm.enable();

        this.profileForm.markAsPristine();
    }

    cancelEditMode() {
        this.isEditing = false;
        this.profileForm.disable();

        if (this.profileForm.dirty || this.profileForm.touched) {
            this.init(true);
        }
    }

    get model() {
        const model = this.profileForm.getRawValue();

        if (!(model.avatar instanceof File)) {
            delete model.avatar;
        }

        return model;
    }

    async saveChanges() {
        var user = await this.accountService.getCurrentUser();

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
