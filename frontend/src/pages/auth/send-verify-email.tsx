import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { type FormEvent, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useUserProfile";
import { useSendVerifyEmail } from "@/hooks/useSendVerifyEmail";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function SendVerifyEmail() {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useCurrentUser();
  const { signOut } = useAuth();
  const { sendVerifyEmail, isPending, isSentButtonDisabled, timeLeft } =
    useSendVerifyEmail();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || !user?.success || !user.data?.email) {
      toast.error("Failed to send verification email");
      return;
    }

    sendVerifyEmail(user.data.email);
  };
  useEffect(() => {
    if (user?.success && user.data?.isEmailVerified) {
      navigate("/");
    }
  }, [user, navigate]);

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  // Show error state if user data failed to load
  if (error || !user?.success) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-muted-foreground text-center">
          Failed to load user data. Please try refreshing the page.
        </p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    );
  }

  const userEmail = user.data?.email;

  return (
    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground">
            Click send to send a verification link to {userEmail}. If you don't
            see it within 5 minutes, please check your spam or click send again.
          </p>
        </div>
        <Field>
          <Button type="submit" disabled={isSentButtonDisabled || isPending}>
            {isPending
              ? "Sending..."
              : isSentButtonDisabled
              ? `Resend in ${timeLeft}s`
              : "Send"}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          <a className="hover:cursor-pointer" onClick={() => signOut()}>
            Sign Out
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
