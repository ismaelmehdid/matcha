import { AuthAPI } from "@/api/auth/auth";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setIsValidToken(false);
        setIsVerifying(false);
        return;
      }
      try {
        console.log("token", token);
        const { valid } = await AuthAPI.verifyEmail(token);
        setIsValidToken(valid);
        if (valid) {
          toast.success("Email verified successfully");
          navigate("/");
        }
      } catch (error) {
        setIsValidToken(false);
        toast.error("Failed to verify email");
      } finally {
        setIsVerifying(false);
      }
    };
    verifyEmail();
  }, [token]);

  if (!isVerifying && !isValidToken) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden p-0">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-2xl font-bold">
                Invalid Email Verification Link
              </h1>
              <p className="text-muted-foreground">
                This email verification link is invalid or has expired. Please
                request a new one.
              </p>
              <Button onClick={() => navigate("/auth/send-verify-email")}>
                Request New Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else if (!isVerifying && isValidToken) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden p-0">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-2xl font-bold">Email Verified</h1>
              <p className="text-muted-foreground">
                Your email has been verified successfully.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }
}
