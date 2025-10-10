import { UsersAPI } from "@/api/users";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={async () => {
          const user = await UsersAPI.getCurrentUser();
          console.log(user);
        }}
      ></Button>
      <Button
        variant="destructive"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/sign-in");
        }}
      >
        Logout
      </Button>
    </>
  );
}
