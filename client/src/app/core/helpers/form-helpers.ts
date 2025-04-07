import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type FormType<T> = {
    [K in keyof T]-?: T[K] extends Array<infer U>  // -? removes optional modifier
    ? U extends object
    ? FormArray<FormGroup<FormType<U>>>  // Array of objects -> FormArray<FormGroup>
    : FormControl<T[K]>                  // Array of primitives -> FormControl<ArrayType>
    : FormControl<T[K]>;                 // Single value -> FormControl
};
