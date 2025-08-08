import { Directive, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';

@Directive({
    selector: 'ion-input',
    standalone: true
})
export class SelectOnFocusDirective implements AfterViewInit, OnDestroy {
    private inputElement: HTMLInputElement;
    private focusListener: () => void;

    constructor(private el: ElementRef) { }

    async ngAfterViewInit() {
        const ionInput = this.el.nativeElement;

        const inputEl = ionInput.getInputElement();
        this.inputElement = inputEl;

        this.focusListener = () => {
            setTimeout(() => {
                if (this.inputElement.disabled || this.inputElement.readOnly) return;

                this.inputElement.select();
            }, 0);
        };
        this.inputElement.addEventListener('focus', this.focusListener);
    }

    ngOnDestroy() {
        if (this.inputElement && this.focusListener) {
            this.inputElement.removeEventListener('focus', this.focusListener);
        }
    }
}
