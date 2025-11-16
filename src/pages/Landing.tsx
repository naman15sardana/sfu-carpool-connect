import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Users, MapPin, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-carpool.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Smart <span className="text-gradient">Carpool</span>
          </h2>
          <Button 
            variant="neon" 
            size="sm"
            onClick={() => navigate("/login")}
            className="gap-2"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent opacity-50" />
        
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm">
                <Sparkles className="w-4 h-4 text-neon-cyan" />
                <span className="text-muted-foreground">SFU Student Powered</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Smart Carpool{" "}
                <span className="text-gradient">Connect</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                Ride Together, Save Together
              </p>
              
              <p className="text-lg text-foreground/80 max-w-lg">
                An SFU student-powered carpooling platform that reduces single occupancy vehicles and builds community.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  size="lg" 
                  variant="neon"
                  onClick={() => navigate("/create-route")}
                  className="gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Create a Route
                </Button>
                <Button 
                  size="lg" 
                  variant="glass"
                  onClick={() => navigate("/browse-routes")}
                  className="gap-2"
                >
                  <Car className="w-5 h-5" />
                  Find a Ride
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">1,200+</div>
                  <div className="text-sm text-muted-foreground">Rides Shared</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">30%</div>
                  <div className="text-sm text-muted-foreground">CO₂ Reduced</div>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-3xl" />
              <img 
                src={heroImage} 
                alt="Smart Carpool Network" 
                className="relative rounded-2xl shadow-2xl border border-border/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-card/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why <span className="text-gradient">Carpool?</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl hover:neon-glow transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Community</h3>
              <p className="text-muted-foreground">
                Connect with fellow SFU students and make new friends on your daily commute.
              </p>
            </div>
            
            <div className="glass p-8 rounded-2xl hover:neon-glow transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-muted-foreground">
                Split gas costs and parking fees. Save hundreds of dollars every semester.
              </p>
            </div>
            
            <div className="glass p-8 rounded-2xl hover:neon-glow transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Help Environment</h3>
              <p className="text-muted-foreground">
                Reduce carbon emissions and contribute to a sustainable campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Smart Carpool Connect. SFU Student Initiative.
            </div>
            <div className="flex gap-6">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
