import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (!name) {
      navigate("/login");
    } else {
      setUserName(name);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Smart <span className="text-gradient">Carpool</span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              {userName}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient">{userName}</span> 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to share a ride or find one?
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {/* Create Route Card */}
          <div 
            onClick={() => navigate("/create-route")}
            className="glass p-8 rounded-2xl border border-border/50 hover:border-primary/50 hover:neon-glow transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl">🚗</div>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Create a Route</h3>
            <p className="text-muted-foreground mb-6">
              Offering a ride? Post your route and help fellow students get to campus.
            </p>
            
            <div className="flex items-center gap-2 text-primary font-medium">
              Post Route
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Browse Routes Card */}
          <div 
            onClick={() => navigate("/browse-routes")}
            className="glass p-8 rounded-2xl border border-border/50 hover:border-secondary/50 hover:shadow-[0_0_20px_hsl(var(--neon-blue)/0.3)] transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-4xl">🔍</div>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Browse Routes</h3>
            <p className="text-muted-foreground mb-6">
              Looking for a ride? Find available routes that match your schedule.
            </p>
            
            <div className="flex items-center gap-2 text-secondary font-medium">
              Find Rides
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-4xl">
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-primary mb-1">5</div>
            <div className="text-sm text-muted-foreground">Rides Taken</div>
          </div>
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-secondary mb-1">$42</div>
            <div className="text-sm text-muted-foreground">Money Saved</div>
          </div>
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-accent mb-1">12kg</div>
            <div className="text-sm text-muted-foreground">CO₂ Reduced</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
