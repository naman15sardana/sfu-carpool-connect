import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "../lib/supabase";

interface Route {
  id: string;
  start_location: string;
  end_location: string;
  date: string;
  time: string;
  seats_available: number;
  driver_id: string;
  driver: {
    email: string;
  } | null;
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
          seats_available,
          driver_id,
          driver:profiles (
            email
          )
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
      description: `Driver (${route.driver?.email}) will be notified.`,
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
        <h1 className="text-4xl font-bold mb-4">
          Browse <span className="text-gradient">Routes</span>
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div
              key={route.id}
              className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition cursor-pointer"
              onClick={() => setSelectedRoute(route)}
            >
              <div className="space-y-4">
                {/* FROM */}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">From</div>
                    <div className="font-semibold">{route.start_location}</div>
                  </div>
                </div>

                {/* TO */}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <div>
                    <div className="text-sm text-muted-foreground">To</div>
                    <div className="font-semibold">{route.end_location}</div>
                  </div>
                </div>

                {/* DATE + TIME */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{formatDateTime(route.date, route.time)}</span>
                </div>

                {/* SEATS + DRIVER */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{route.seats_available} seats</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{route.driver?.email ?? "Unknown"}</span>
                  </div>
                </div>

                <Button variant="neon" className="w-full">
                  Join Ride
                </Button>
              </div>
            </div>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No routes available yet.</p>
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

      {/* MODAL */}
      <Dialog open={!!selectedRoute} onOpenChange={() => setSelectedRoute(null)}>
        <DialogContent className="glass border border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Route Details</DialogTitle>
          </DialogHeader>

          {selectedRoute && (
            <div className="space-y-6">
              {/* FROM */}
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">From</div>
                  <div className="font-semibold">{selectedRoute.start_location}</div>
                </div>
              </div>

              {/* TO */}
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-secondary" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">To</div>
                  <div className="font-semibold">{selectedRoute.end_location}</div>
                </div>
              </div>

              {/* DETAILS */}
              <div className="glass p-4 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Departure</span>
                  <span>{formatDateTime(selectedRoute.date, selectedRoute.time)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats</span>
                  <span>{selectedRoute.seats_available}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver</span>
                  <span>{selectedRoute.driver?.email}</span>
                </div>
              </div>

              <Button variant="neon" onClick={() => handleJoinRoute(selectedRoute)} className="w-full">
                Join Ride
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseRoutes;
