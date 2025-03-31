import { FormControl } from '@angular/forms';

export type FormType<T> = {
    [K in keyof T]: FormControl<T[K]>;
};
