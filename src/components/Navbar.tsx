import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

interface NavbarProps {
  showSignIn?: boolean;
}

export const Navbar = ({ showSignIn = false }: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/50 glass sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button 
          onClick={() => navigate("/")}
          className="text-xl font-bold hover:opacity-80 transition-opacity"
        >
          Smart <span className="text-gradient">Carpool</span>
        </button>
        
        {showSignIn && (
          <Button 
            variant="neon" 
            size="sm"
            onClick={() => navigate("/login")}
            className="gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};
