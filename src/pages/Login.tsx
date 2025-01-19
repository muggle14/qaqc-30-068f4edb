import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import { validateCredentials } from "@/utils/auth";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      console.log("Login: User already authenticated, redirecting to home");
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } else {
      console.log("Login: No authenticated user found");
    }
  }, [navigate, location]);

  const handleLogin = async (username: string, password: string) => {
    console.log("Login: Attempting login for username:", username);
    setIsLoading(true);

    try {
      const user = validateCredentials(username, password);

      if (user) {
        console.log("Login: Authentication successful");
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

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;