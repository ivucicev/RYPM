import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertController, IonToolbar, IonFooter, IonButton, IonItem, IonList, IonContent, IonBackButton, IonTitle, IonButtons, IonHeader, IonTextarea, IonInput, IonToggle } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormType } from '../../core/helpers/form-helpers';
import { ProfileBM } from '../../core/models/bm/profile-bm';
import { ErrorMessageDirective } from '../../core/directives/error-message.directive';
import { PocketbaseService } from '../../core/services/pocketbase.service';
import { ImageInputComponent } from '../../shared/image-input/image-input.component';
import { AccountService } from '../../core/services/account.service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-my-profile',
    templateUrl: 'my-profile.page.html',
    styleUrls: ['./my-profile.page.scss'],
    standalone: true,
    imports: [IonHeader, IonButtons, IonToggle, IonInput, IonTitle, IonTextarea, IonBackButton, IonContent, IonList, IonItem, IonButton, IonFooter, IonToolbar, TranslateModule, ReactiveFormsModule, FormsModule, ErrorMessageDirective, ImageInputComponent],
})
export class MyProfilePage implements OnInit {

    profileForm: FormGroup<FormType<ProfileBM>>;
    imageSrc: string | ArrayBuffer | null = null;

    isEditing = false;

    constructor(
        private formBuilder: FormBuilder,
        private pocketbaseService: PocketbaseService,
        private accountService: AccountService,
        private alertCtrl: AlertController,
        private translateService: TranslateService
    ) {
    }

    ngOnInit() {
        this.init();
    }

    async init(reload = false) {
        this.profileForm = this.formBuilder.group({
            avatar: [],
            name: [],
            isPublic: [],
            about: []
        });

        this.accountService.getCurrentUser(reload).then(user => {
            this.profileForm = this.formBuilder.group({
                avatar: [user.avatar],
                name: [user.name, [Validators.required]],
                isPublic: [user.isPublic],
                about: [user.about],
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

        // TODO: check bug?
        // if (!(model.avatar instanceof File)) {
        //     delete model.avatar;
        // }

        return model;
    }

    async saveChanges() {
        const user = await this.accountService.getCurrentUser();

        const model = this.model;
        this.pocketbaseService.users.update(
            user.id,
            model
        ).then(async res => {
            if (!res) return;
            this.cancelEditMode();
        });
    }

    async onIsPublicToggle() {
        const newValue = this.profileForm.controls.isPublic.value;
        const t = await lastValueFrom(this.translateService.get(
            ['Info', 'Cancel', 'Switch to public', 'Switch to private']
        ));
        const alert = await this.alertCtrl.create({
            header: t.info,
            message: newValue
                // TODO
                ? 'Switching to a public profile will make you discoverable to other users. Are you sure you want to continue?'
                : 'Switching to a private profile will hide your account from other users. You will only be able to connect by manually sharing the connection link. Are you sure you want to continue?',
            buttons: [
                {
                    text: t.cancel,
                    role: 'cancel',
                    handler: () => {
                        this.profileForm.controls.isPublic.setValue(!newValue);
                    },
                },
                {
                    text: newValue ? t.switch_to_public : t.switch_to_private,
                    handler: () => {
                        this.profileForm.controls.isPublic.setValue(newValue);
                    },
                },
            ],
        });

        await alert.present();
    }
}
