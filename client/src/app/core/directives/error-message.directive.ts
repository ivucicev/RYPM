import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormGroupDirective, StatusChangeEvent, TouchedChangeEvent, ValueChangeEvent } from '@angular/forms';
import { Subscription, merge } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IonInput } from '@ionic/angular/standalone';

@Directive({
    selector: '[formGroup]',
    standalone: true
})
export class ErrorMessageDirective implements OnInit, OnDestroy {
    private subscription: Subscription;
    private readonly validationMessages: Record<string, string> = {
        required: 'Field is required',
        email: 'Email is invalid',
        minlength: 'Too short',
        maxlength: 'Maximum length exceeded',
        pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    };

    constructor(
        private el: ElementRef,
        private formGroupDirective: FormGroupDirective,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        const form = this.formGroupDirective.form;
        const controlEvents = Object.values(form.controls).map(control =>
            control.events
        );

        this.subscription = merge(...controlEvents).subscribe(event => {
            // TODO: check if specific events can be used (not to trigger on every control event)
            if (event instanceof ValueChangeEvent) {

            } else if (event instanceof StatusChangeEvent) {

            } else if (event instanceof TouchedChangeEvent) {

            };

            this.updateErrorMessages();
        });
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    private updateErrorMessages() {
        const form = this.formGroupDirective.form;
        Object.entries(form.controls).forEach(([key, control]) => {
            const ionInput = this.el.nativeElement.querySelector(`ion-input[formControlName="${key}"]`) as IonInput;

            if (!ionInput) return;

            if (control.invalid && (control.touched || control.dirty)) {
                const errorKey = Object.keys(control.errors)[0];
                const errorMessage = this.translateService.instant(this.validationMessages[errorKey] || 'Invalid input');
                ionInput.errorText = errorMessage;
            } else {
                ionInput.errorText = undefined;
            }
        });
    }
}
