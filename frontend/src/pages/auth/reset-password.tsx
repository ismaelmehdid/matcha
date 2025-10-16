import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { toast } from "sonner";
import { type FormEvent, useState } from "react";
import { authApi } from "@/api/auth/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validatePassword } from "@/utils/password";
import { PasswordFields } from "@/components/PasswordFields";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (
      !passwordValidation.isLongEnough ||
      !passwordValidation.containsLowerCase ||
      !passwordValidation.containsUpperCase ||
      !passwordValidation.containsNumber ||
      !passwordValidation.containsSpecialCharacter
    ) {
      toast.error("Please fix password requirements before submitting");
      return;
    }

    if (!token) {
      toast.error("No reset token provided");
      return;
    }

    const response = await authApi.resetPassword({
      resetPasswordToken: token,
      newPassword: password,
    });
    if (response.success) {
      toast.success("Password reset successfully");
      navigate("/auth/sign-in");
    } else {
      toast.error("Failed to reset password. Invalid token or password."); //TODO: Gotta handle this better
    }
  };

  return (
    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Enter your new password</h1>
          <p className="text-muted-foreground text-sm">
            Choose a strong password to secure your account
          </p>
        </div>
        <PasswordFields
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          passwordLabel="New Password"
          confirmPasswordLabel="Confirm New Password"
          setIsPasswordValid={setIsPasswordValid}
        />
        <Field>
          <Button
            type="submit"
            disabled={!isPasswordValid || password !== confirmPassword}
          >
            Change Password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
