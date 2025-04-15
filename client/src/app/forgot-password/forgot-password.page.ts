import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from '../core/services/account.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, FormsModule],
})
export class ForgotPasswordPage {

    // TODO: form, email validator
    email: string;

    constructor(
        private accountService: AccountService) { }

    submit() {
        this.accountService.requestPasswordReset(this.email);
    }
}
