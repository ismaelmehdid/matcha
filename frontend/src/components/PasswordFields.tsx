import { useState, useEffect } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validatePassword, type PasswordValidation } from "@/utils/password";

interface PasswordFieldsProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  showValidation?: boolean;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  onPasswordMismatch?: () => void;
  setIsPasswordValid: (isPasswordValid: boolean) => void;
}

export function PasswordFields({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showValidation = true,
  passwordLabel = "Password",
  confirmPasswordLabel = "Confirm Password",
  onPasswordMismatch,
  setIsPasswordValid,
}: PasswordFieldsProps) {
  const [passwordValidation, setPasswordValidation] = useState(
    validatePassword("")
  );

  useEffect(() => {
    setPasswordValidation(validatePassword(password));
  }, [password]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsPasswordValid(
      validatePassword(e.target.value).isLongEnough &&
        validatePassword(e.target.value).containsLowerCase &&
        validatePassword(e.target.value).containsUpperCase &&
        validatePassword(e.target.value).containsNumber &&
        validatePassword(e.target.value).containsSpecialCharacter
    );
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  // Check for password mismatch and call callback if provided
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword && onPasswordMismatch) {
      onPasswordMismatch();
    }
  }, [password, confirmPassword, onPasswordMismatch]);

  return (
    <>
      <Field>
        <Field className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="password">{passwordLabel}</FieldLabel>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">
              {confirmPasswordLabel}
            </FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </Field>
        </Field>
      </Field>
      {showValidation && (
        <PasswordPolicyFieldDescription
          passwordValidation={passwordValidation}
        />
      )}
    </>
  );
}

function PasswordPolicyFieldDescription({
  passwordValidation,
}: {
  passwordValidation: PasswordValidation;
}) {
  return (
    <div className="text-muted-foreground text-sm leading-normal font-normal space-y-1">
      <div
        className={`transition-colors duration-200 ${
          passwordValidation.isLongEnough ? "text-green-500" : ""
        }`}
      >
        Must be at least 12 characters long
      </div>
      <div
        className={`transition-colors duration-200 ${
          passwordValidation.containsLowerCase ? "text-green-500" : ""
        }`}
      >
        Must contain at least one lowercase letter
      </div>
      <div
        className={`transition-colors duration-200 ${
          passwordValidation.containsUpperCase ? "text-green-500" : ""
        }`}
      >
        Must contain at least one uppercase letter
      </div>
      <div
        className={`transition-colors duration-200 ${
          passwordValidation.containsNumber ? "text-green-500" : ""
        }`}
      >
        Must contain at least one number
      </div>
      <div
        className={`transition-colors duration-200 ${
          passwordValidation.containsSpecialCharacter ? "text-green-500" : ""
        }`}
      >
        Must contain at least one special character
      </div>
    </div>
  );
}
