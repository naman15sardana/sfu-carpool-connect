import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "../lib/supabase";

// ⭐ Predefined SFU campus coordinates
const SFU_CAMPUSES: Record<string, { lat: number; lng: number }> = {
  "SFU Burnaby": { lat: 49.2775, lng: -122.9156 },
  "SFU Surrey": { lat: 49.1877, lng: -122.8490 },
  "SFU Vancouver": { lat: 49.2846, lng: -123.1119 },
};

const CreateRoute = () => {
  const navigate = useNavigate();

  // -------------------------------
  // 🔥 Form State
  // -------------------------------
  const [startLocation, setStartLocation] = useState("");
  const [startCoords, setStartCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [destination, setDestination] = useState("");
  const [endCoords, setEndCoords] = useState<{ lat: number; lng: number } | null>(null);

  const startInputRef = useRef<HTMLInputElement | null>(null);

  const [departureTime, setDepartureTime] = useState("");
  const [seats, setSeats] = useState("");

  // -------------------------------
  // 🔥 Google Places Autocomplete
  // -------------------------------
  useEffect(() => {
    if (!startInputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(startInputRef.current!, {
      types: ["geocode"],
      componentRestrictions: { country: ["ca"] },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        toast({
          title: "Invalid Location",
          description: "Please select a valid place from suggestions.",
          variant: "destructive",
        });
        return;
      }

      const lat = place.geometry.location?.lat();
      const lng = place.geometry.location?.lng();

      if (lat && lng) {
        setStartCoords({ lat, lng });
        setStartLocation(place.formatted_address || place.name || "");
      }
    });
  }, []);

  // -------------------------------
  // 🔥 Assign END CAMPUS LAT/LNG
  // -------------------------------
  useEffect(() => {
    if (destination && SFU_CAMPUSES[destination]) {
      setEndCoords(SFU_CAMPUSES[destination]);
    }
  }, [destination]);

  // -------------------------------
  // 🔥 Submit Handler
  // -------------------------------
  const handleSubmit = async () => {
    if (!startLocation || !destination || !departureTime || !seats) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!startCoords) {
      toast({
        title: "Location Required",
        description: "Please pick the starting location from autocomplete.",
        variant: "destructive",
      });
      return;
    }

    if (!endCoords) {
      toast({
        title: "Destination Error",
        description: "Invalid SFU campus.",
        variant: "destructive",
      });
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please log in before creating a route.",
        variant: "destructive",
      });
      return;
    }

    const iso = departureTime;
    const date = iso.split("T")[0];
    const time = iso.split("T")[1];

    // -------------------------------
    // 🔥 Insert into Supabase
    // -------------------------------
    const { error } = await supabase.from("rides").insert({
      driver_id: user.id,

      // FULL location data
      start_location: startLocation,
      start_lat: startCoords.lat,
      start_lng: startCoords.lng,

      end_location: destination,
      end_lat: endCoords.lat,
      end_lng: endCoords.lng,

      date,
      time,
      seats_available: Number(seats),
    });

    if (error) {
      toast({
        title: "Error Creating Route",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Route Published!",
      description: "Your ride is now visible to other students.",
    });

    setTimeout(() => navigate("/browse-routes"), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            Create a <span className="text-gradient">Route</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Share your ride and help fellow students commute.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl border border-border/50 space-y-6">

          {/* Start Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Starting Location
            </Label>
            <Input
              placeholder="Search location..."
              ref={startInputRef}
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
            />
          </div>

          {/* Destination Campus */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              Destination
            </Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Select SFU Campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SFU Burnaby">SFU Burnaby</SelectItem>
                <SelectItem value="SFU Surrey">SFU Surrey</SelectItem>
                <SelectItem value="SFU Vancouver">SFU Vancouver</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Departure Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Departure Time
            </Label>
            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full p-3 rounded-md bg-background border border-border/50 text-foreground"
            />
          </div>

          {/* Seats */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Available Seats
            </Label>
            <Input
              type="number"
              min="1"
              max="7"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
          </div>

          <Button size="lg" variant="neon" className="w-full gap-2" onClick={handleSubmit}>
            <MapPin className="w-5 h-5" />
            Publish Route
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoute;
