export interface PasswordValidation {
  isLongEnough: boolean;
  containsLowerCase: boolean;
  containsUpperCase: boolean;
  containsNumber: boolean;
  containsSpecialCharacter: boolean;
}

export const validatePassword = (password: string): PasswordValidation => {
  let isLongEnough = true;
  let containsLowerCase = true;
  let containsUpperCase = true;
  let containsNumber = true;
  let containsSpecialCharacter = true;

  if (password.length < 12) {
    isLongEnough = false;
  }
  if (!/[a-z]/.test(password)) {
    containsLowerCase = false;
  }
  if (!/[A-Z]/.test(password)) {
    containsUpperCase = false;
  }
  if (!/\d/.test(password)) {
    containsNumber = false;
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    containsSpecialCharacter = false;
  }
  return { isLongEnough, containsLowerCase, containsUpperCase, containsNumber, containsSpecialCharacter };
};
