import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUser } from "@/hooks/useUserProfile";
import { Spinner } from "@/components/ui/spinner";
import type { User } from "@/types/user";
import { CompleteProfile } from "@/components/complete-profile";

function UserHasCompletedProfile(user: User): boolean {
  return (
    user.gender !== null &&
    user.sexualOrientation !== null &&
    user.biography !== null &&
    user.photos &&
    user.photos.length > 0 &&
    user.photos.some((photo) => photo.is_profile_pic) &&
    user.interests &&
    user.interests.length > 0
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: user, isLoading: userIsLoading } = useCurrentUser();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/sign-in");
  };

  if (!userIsLoading && user && !UserHasCompletedProfile(user)) {
    return <CompleteProfile user={user} />;
  } else if (!userIsLoading && user && UserHasCompletedProfile(user)) {
    return (
      <>
        <Button variant="destructive" onClick={handleSignOut}>
          Sign Out
        </Button>
      </>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }
}
