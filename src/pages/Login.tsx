import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { testUsers } from "@/config/authConfig";
import { Lock, User, LogIn } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Login: Checking authentication status");
    const checkAuth = () => {
      const user = sessionStorage.getItem("user");
      if (user) {
        console.log("Login: User already authenticated, checking redirect path");
        const from = location.state?.from?.pathname || "/";
        console.log("Login: Redirecting authenticated user to:", from);
        navigate(from, { replace: true });
      } else {
        console.log("Login: No authenticated user found, showing login form");
      }
    };

    checkAuth();
    // Clean up any pending navigation when component unmounts
    return () => {
      console.log("Login: Cleanup - component unmounting");
    };
  }, [navigate, location]); // Restore dependency array

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Login: Attempting login for username:", username);
      const user = testUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        console.log("Login: Authentication successful, storing user data");
        sessionStorage.setItem("user", JSON.stringify({ username }));
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        const from = location.state?.from?.pathname || "/";
        console.log("Login: Redirecting to:", from);
        navigate(from, { replace: true });
      } else {
        console.log("Login: Authentication failed - invalid credentials");
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login: Error during authentication:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-canvas-text mb-2">
              OutcomesAI
            </h1>
            <p className="text-canvas-muted">Sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-canvas-muted" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-canvas-muted" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-tool-primary hover:bg-tool-hover"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;