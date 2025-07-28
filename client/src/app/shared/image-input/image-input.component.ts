import { Component, ElementRef, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
    selector: 'app-image-input',
    templateUrl: 'image-input.component.html',
    styleUrls: ['./image-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImageInputComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [IonIcon,]
})
export class ImageInputComponent implements ControlValueAccessor {
    @ViewChild('imgInput') imgInput: ElementRef;

    imageSrc: string | ArrayBuffer | null = null;
    isDisabled = false;

    @Input()
    isEditing = true;

    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        if (value) {
            if (typeof value === 'string') {
                this.imageSrc = value;
            } else if (value instanceof File) {
                this.processFile(value);
            }
        } else {
            this.imageSrc = null;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    handleFileInput(e: any | null) {
        const file: File = e?.target?.files[0] ?? null;
        this.processFile(file);

        this.onChange(file);
        this.onTouched();

        if (this.imgInput && this.imgInput.nativeElement) {
            this.imgInput.nativeElement.value = null;
        }
    }

    processFile(file: File) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageSrc = e.target?.result ?? null;
            };
            reader.readAsDataURL(file);
        } else {
            this.imageSrc = null;
        }
    }
}
