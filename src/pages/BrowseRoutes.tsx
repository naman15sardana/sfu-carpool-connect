import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "../lib/supabase";

// --------------------------
// ROUTE TYPE
// --------------------------
interface Route {
  id: string;
  start_location: string;
  start_lat: number | null;
  start_lng: number | null;
  end_location: string;
  date: string;
  time: string;
  seats_available: number;
  driver_id: string;
  driver: { email: string } | null;
}

const BrowseRoutes = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  // 🔥 Filter + Sort State
  const [filterCampus, setFilterCampus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("time");

  // Smart start filter
  const [filterStartCoords, setFilterStartCoords] =
    useState<{ lat: number; lng: number } | null>(null);

  const filterStartRef = useRef<HTMLInputElement | null>(null);

  // --------------------------
  // GOOGLE AUTOCOMPLETE FOR "Starting near"
  // --------------------------
  useEffect(() => {
    if (!filterStartRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(filterStartRef.current!, {
      types: ["geocode"],
      componentRestrictions: { country: ["ca"] },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      setFilterStartCoords({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });
  }, []);

  // --------------------------
  // FETCH ROUTES
  // --------------------------
  useEffect(() => {
    const fetchRoutes = async () => {
      const { data, error } = await supabase
        .from("rides")
        .select(`
          id,
          start_location,
          start_lat,
          start_lng,
          end_location,
          date,
          time,
          seats_available,
          driver_id,
          driver:profiles ( email )
        `)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (error) {
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

  // --------------------------
  // 🧠 HAVERSINE — Distance Between Two Coordinates
  // --------------------------
  const getDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // --------------------------
  // APPLY FILTERS + SORTING
  // --------------------------
  const filteredRoutes = routes
    // Campus filter
    .filter((r) => (filterCampus === "all" ? true : r.end_location === filterCampus))

    // Smart "nearby start" filter
    .filter((r) => {
      if (!filterStartCoords) return true;
      if (!r.start_lat || !r.start_lng) return false;

      const dist = getDistanceKm(
        filterStartCoords.lat,
        filterStartCoords.lng,
        r.start_lat,
        r.start_lng
      );

      return dist <= 8; // within 8 km
    })

    // Date filter
    .filter((r) => (filterDate ? r.date === filterDate : true))

    // Sorting
    .sort((a, b) => {
      if (sortBy === "time") {
        return (
          new Date(a.date + "T" + a.time).getTime() -
          new Date(b.date + "T" + b.time).getTime()
        );
      }
      if (sortBy === "seats") return b.seats_available - a.seats_available;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
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

        <h1 className="text-4xl font-bold mb-6">
          Browse <span className="text-gradient">Routes</span>
        </h1>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          {/* START NEAR FILTER */}
          <input
            placeholder="Starting near..."
            ref={filterStartRef}
            className="p-3 rounded-md bg-background border border-border/50 w-[200px]"
          />

          {/* CAMPUS FILTER */}
          <Select value={filterCampus} onValueChange={setFilterCampus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="To (Campus)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campuses</SelectItem>
              <SelectItem value="SFU Burnaby">SFU Burnaby</SelectItem>
              <SelectItem value="SFU Surrey">SFU Surrey</SelectItem>
              <SelectItem value="SFU Vancouver">SFU Vancouver</SelectItem>
            </SelectContent>
          </Select>

          {/* DATE FILTER */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-3 rounded-md bg-background border border-border/50 w-[200px]"
          />

          {/* SORT FILTER */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Earliest Departure</SelectItem>
              <SelectItem value="seats">Most Seats</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ROUTES GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition cursor-pointer"
              onClick={() => setSelectedRoute(route)}
            >
              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">From</div>
                    <div className="font-semibold">{route.start_location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <div>
                    <div className="text-sm text-muted-foreground">To</div>
                    <div className="font-semibold">{route.end_location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{formatDateTime(route.date, route.time)}</span>
                </div>

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

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No routes found.</p>
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

              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">From</div>
                  <div className="font-semibold">{selectedRoute.start_location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-secondary" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">To</div>
                  <div className="font-semibold">{selectedRoute.end_location}</div>
                </div>
              </div>

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
