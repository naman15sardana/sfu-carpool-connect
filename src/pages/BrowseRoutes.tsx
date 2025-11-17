import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "../lib/supabase";

interface Route {
  id: number;
  start_location: string;
  end_location: string;
  date: string;
  time: string;
  seats: number;
  user_id: string;
  users?: { email: string } | null; // <-- Added (driver email)
}

const BrowseRoutes = () => {
  const navigate = useNavigate();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      const { data, error } = await supabase
        .from("rides")
        .select(`
          id,
          start_location,
          end_location,
          date,
          time,
          seats,
          user_id,
          users ( email )
        `)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (error) {
        console.error(error);
        toast({
          title: "Error loading routes",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setRoutes((data ?? []) as Route[]);
    };

    fetchRoutes();
  }, []);

  const formatDateTime = (date: string, time: string) => {
    const combined = new Date(`${date}T${time}`);
    return combined.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleJoinRoute = (route: Route) => {
    toast({
      title: "Request sent!",
      description: `Driver (${route.users?.email}) will be notified.`,
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
              <div className="space-y-4">
                
                {/* From */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">From</div>
                    <div className="font-semibold truncate">
                      {route.start_location}
                    </div>
                  </div>
                </div>

                {/* To */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">To</div>
                    <div className="font-semibold truncate">
                      {route.end_location}
                    </div>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">
                    {formatDateTime(route.date, route.time)}
                  </span>
                </div>

                {/* Seats + Driver */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">{route.seats} seats</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{route.users?.email || "Unknown"}</span>
                  </div>
                </div>

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

      {/* Route Details Modal */}
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
              
              <div className="space-y-4">
                {/* Start */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Starting Point</div>
                    <div className="font-semibold text-lg">{selectedRoute.start_location}</div>
                  </div>
                </div>

                <div className="ml-6 border-l-2 border-dashed border-border h-8" />

                {/* Destination */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Destination</div>
                    <div className="font-semibold text-lg">{selectedRoute.end_location}</div>
                  </div>
                </div>
              </div>

              {/* Info Block */}
              <div className="glass p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Departure</span>
                  <span className="font-medium">
                    {formatDateTime(selectedRoute.date, selectedRoute.time)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="font-medium">{selectedRoute.seats}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Driver</span>
                  <span className="font-medium">
                    {selectedRoute.users?.email || "Unknown"}
                  </span>
                </div>
              </div>

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
