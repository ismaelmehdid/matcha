import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/sign-in");
  };

  const navLinks = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/browse", label: "Browse", icon: "🔍", disabled: true },
    { path: "/matches", label: "Matches", icon: "💘", disabled: true },
    { path: "/chat", label: "Chat", icon: "💬", disabled: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold">
                Matcha
              </Link>

              <nav className="hidden md:flex gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-primary text-primary-foreground"
                        : link.disabled
                        ? "text-muted-foreground cursor-not-allowed"
                        : "hover:bg-muted"
                    } ${link.disabled ? "pointer-events-none" : ""}`}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                    {link.disabled && (
                      <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">Soon</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            <Button variant="outline" onClick={handleSignOut} size="sm">
              Sign Out
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex gap-1 pb-2 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground"
                    : link.disabled
                    ? "text-muted-foreground cursor-not-allowed"
                    : "hover:bg-muted"
                } ${link.disabled ? "pointer-events-none" : ""}`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-muted/50">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Matcha. Made by</p>
        </div>
      </footer>
    </div>
  );
}
