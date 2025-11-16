import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (name && email) {
      localStorage.setItem("userName", name);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920')] bg-cover bg-center opacity-5" />
      
      <div className="relative w-full max-w-md">
        <div className="glass p-8 rounded-2xl border border-border/50 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              Welcome to <span className="text-gradient">SCC</span>
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your carpool dashboard
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass border-border/50 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">SFU Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.name@sfu.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass border-border/50 focus:border-primary transition-all"
              />
            </div>

            <Button 
              className="w-full gap-2" 
              size="lg"
              variant="neon"
              onClick={handleLogin}
            >
              <LogIn className="w-5 h-5" />
              Continue to Dashboard
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
