import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import illustration from "@/assets/illustration.png";
import { toast } from "sonner";
import { type FormEvent, useState, useEffect } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSentButtonDisabled, setIsSentButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSentButtonDisabled(true);
    setTimeLeft(60);
    toast.success("The password reset link has been sent");
  };
  useEffect(() => {
    if (isSentButtonDisabled && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsSentButtonDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSentButtonDisabled, timeLeft]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <p className="text-muted-foreground">
                  Enter the email address associated with your account, and
                  we'll send you a link to reset your password.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isSentButtonDisabled}>
                  {isSentButtonDisabled ? `Resend in ${timeLeft}s` : "Send"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                <a href="/sign-in">Return to Sign In</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={illustration}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
