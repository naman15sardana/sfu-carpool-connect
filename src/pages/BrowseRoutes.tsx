import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Route {
  id: number;
  from: string;
  to: string;
  time: string;
  seats: number;
  driver: string;
}

const BrowseRoutes = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  useEffect(() => {
    // Load routes from localStorage first, then add defaults
    const savedRoutes = JSON.parse(localStorage.getItem("routes") || "[]");
    
    const defaultRoutes: Route[] = [
      {
        id: 1,
        from: "Downtown Vancouver",
        to: "SFU Burnaby",
        time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
        seats: 3,
        driver: "Alex Chen",
      },
      {
        id: 2,
        from: "Surrey Central",
        to: "SFU Surrey",
        time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16),
        seats: 2,
        driver: "Sarah Johnson",
      },
      {
        id: 3,
        from: "Metrotown",
        to: "SFU Burnaby",
        time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString().slice(0, 16),
        seats: 4,
        driver: "Michael Kim",
      },
    ];

    // Put saved routes first so new ones appear at the top
    const allRoutes = [...savedRoutes, ...defaultRoutes];
    setRoutes(allRoutes);
  }, []);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleJoinRoute = (route: Route) => {
    toast({
      title: "Request sent!",
      description: `${route.driver} will be notified of your request.`,
    });
    setSelectedRoute(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            Browse <span className="text-gradient">Routes</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Find a ride that matches your schedule
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div
              key={route.id}
              className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/50 hover:neon-glow transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedRoute(route)}
            >
              {/* Route Info */}
              <div className="space-y-4">
                {/* From → To */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-muted-foreground">From</div>
                    <div className="font-semibold truncate">{route.from}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-muted-foreground">To</div>
                    <div className="font-semibold truncate">{route.to}</div>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">{formatTime(route.time)}</span>
                </div>

                {/* Seats & Driver */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">{route.seats} seats</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{route.driver}</span>
                  </div>
                </div>

                {/* Join Button */}
                <Button 
                  variant="neon" 
                  className="w-full group-hover:scale-105 transition-transform"
                  size="sm"
                >
                  Join Ride
                </Button>
              </div>
            </div>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No routes available yet</p>
            <Button 
              variant="neon" 
              className="mt-4"
              onClick={() => navigate("/create-route")}
            >
              Create First Route
            </Button>
          </div>
        )}
      </div>

      {/* Route Detail Dialog */}
      <Dialog open={!!selectedRoute} onOpenChange={() => setSelectedRoute(null)}>
        <DialogContent className="glass border border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Route Details</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Review the route information before joining
            </DialogDescription>
          </DialogHeader>

          {selectedRoute && (
            <div className="space-y-6 pt-4">
              {/* Route Path */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Starting Point</div>
                    <div className="font-semibold text-lg">{selectedRoute.from}</div>
                  </div>
                </div>

                <div className="ml-6 border-l-2 border-dashed border-border h-8" />

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Destination</div>
                    <div className="font-semibold text-lg">{selectedRoute.to}</div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="glass p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Departure</span>
                  <span className="font-medium">{formatTime(selectedRoute.time)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available Seats</span>
                  <span className="font-medium">{selectedRoute.seats}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Driver</span>
                  <span className="font-medium">{selectedRoute.driver}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="glass" 
                  className="flex-1"
                  onClick={() => setSelectedRoute(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="neon" 
                  className="flex-1"
                  onClick={() => handleJoinRoute(selectedRoute)}
                >
                  Join Route
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseRoutes;
