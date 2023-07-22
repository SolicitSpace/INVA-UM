import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export const confirmPwdValidator = function (
  formGroup: FormGroup
): ValidationErrors | null { 

  let value: string = formGroup.value || '';

  if (!value) return null;

  const pwd = formGroup.value.password,
    confirmPwd = formGroup.value.confirmPwd;

  if (pwd.trim().length == 0 || confirmPwd.trim().length == 0) return null;

  if (pwd != confirmPwd) {
    return {
      confirmPwd: `Password does not match`,
    };
  }

  // formGroup.controls["password"].value

  return null;
};

// currently not in use
export const PasswordStrengthValidator = function (
  control: AbstractControl
): ValidationErrors | null {
  let value: string = control.value || '';

  if (!value) {
    return null;
  }

  let upperCaseCharacters = /[A-Z]+/g;
  if (upperCaseCharacters.test(value) === false) {
    return {
      passwordStrength: `text has to contine Upper case characters,current value ${value}`,
    };
  }

  let lowerCaseCharacters = /[a-z]+/g;
  if (lowerCaseCharacters.test(value) === false) {
    return {
      passwordStrength: `text has to contine lower case characters,current value ${value}`,
    };
  }

  let numberCharacters = /[0-9]+/g;
  if (numberCharacters.test(value) === false) {
    return {
      passwordStrength: `text has to contine number characters,current value ${value}`,
    };
  }

  let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharacters.test(value) === false) {
    return {
      passwordStrength: `text has to contine special character,current value ${value}`,
    };
  }
  return null;
};
