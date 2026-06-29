import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const validRegex = /^(77|78|76|75|70)\d{7}$/;
    const valid = validRegex.test(control.value);
    return valid ? null : { invalidPhone: true };
  };
}

export function differentPhoneValidator(currentPhone: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const destination = control.get('destination')?.value;
    if (destination && destination === currentPhone) {
      return { samePhone: true };
    }
    return null;
  };
}
