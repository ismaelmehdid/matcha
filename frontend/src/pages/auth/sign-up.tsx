import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, type FormEvent } from "react";
import { authApi } from "@/api/auth/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PasswordFields } from "@/components/PasswordFields";
import { validatePassword } from "@/utils/password";

export function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if passwords match
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

    try {
      const response = await authApi.signUp({
        email,
        username,
        firstName,
        lastName,
        password,
      });
      if (response.success) {
        signIn(response.data.accessToken);
        toast.success("Account created successfully");
        navigate("/send-verify-email");
      } else {
        toast.error("Error creating account");
      }
    } catch (err) {
      toast.error("Error creating account");
    }
  };

  return (
    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            type="username"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>
        <Field>
          <Field className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="first-name">First Name</FieldLabel>
              <Input
                id="first-name"
                type="first-name"
                placeholder="First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
              <Input
                id="last-name"
                type="last-name"
                placeholder="Last Name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Field>
          </Field>
        </Field>
        <PasswordFields
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          setIsPasswordValid={setIsPasswordValid}
        />
        <Field>
          <Button
            type="submit"
            disabled={
              !isPasswordValid ||
              password !== confirmPassword ||
              email.length === 0 ||
              username.length === 0 ||
              firstName.length === 0 ||
              lastName.length === 0
            }
          >
            Create Account
          </Button>
        </Field>
        <FieldDescription className="text-center">
          Already have an account? <a href="/auth/sign-in">Sign in</a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
