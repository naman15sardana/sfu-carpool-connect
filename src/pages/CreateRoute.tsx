import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const CreateRoute = () => {
  const navigate = useNavigate();
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [seats, setSeats] = useState("");

  const handleSubmit = () => {
    if (startLocation && destination && departureTime && seats) {
      const newRoute = {
        id: Date.now(),
        from: startLocation,
        to: destination,
        time: departureTime,
        seats: parseInt(seats),
        driver: localStorage.getItem("userName") || "Anonymous",
      };

      const existingRoutes = JSON.parse(localStorage.getItem("routes") || "[]");
      // Add new route at the beginning so it appears first
      localStorage.setItem("routes", JSON.stringify([newRoute, ...existingRoutes]));
      
      toast({
        title: "Route published successfully!",
        description: "Students can now find and join your ride.",
      });
      
      setTimeout(() => navigate("/browse-routes"), 1500);
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
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

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            Create a <span className="text-gradient">Route</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Share your ride and help fellow students commute
          </p>
        </div>

        <div className="glass p-8 rounded-2xl border border-border/50 space-y-6">
          {/* Starting Location */}
          <div className="space-y-2">
            <Label htmlFor="start" className="flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              Starting Location
            </Label>
            <Input
              id="start"
              placeholder="e.g., Downtown Vancouver, Metrotown"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="glass border-border/50 focus:border-primary transition-all"
            />
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4 text-secondary" />
              Destination
            </Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="glass border-border/50 focus:border-primary">
                <SelectValue placeholder="Select SFU Campus" />
              </SelectTrigger>
              <SelectContent className="glass border-border/50">
                <SelectItem value="SFU Burnaby">SFU Burnaby</SelectItem>
                <SelectItem value="SFU Surrey">SFU Surrey</SelectItem>
                <SelectItem value="SFU Vancouver">SFU Vancouver</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Departure Time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2 text-foreground">
              <Calendar className="w-4 h-4 text-accent" />
              Departure Time
            </Label>
            <Input
              id="time"
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="glass border-border/50 focus:border-primary transition-all"
            />
          </div>

          {/* Number of Seats */}
          <div className="space-y-2">
            <Label htmlFor="seats" className="flex items-center gap-2 text-foreground">
              <Users className="w-4 h-4 text-primary" />
              Available Seats
            </Label>
            <Input
              id="seats"
              type="number"
              min="1"
              max="7"
              placeholder="How many passengers can you take?"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="glass border-border/50 focus:border-primary transition-all"
            />
          </div>

          {/* Submit Button */}
          <Button 
            size="lg" 
            variant="neon"
            className="w-full gap-2"
            onClick={handleSubmit}
          >
            <MapPin className="w-5 h-5" />
            Publish Route
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Your contact info will be shared with students who join your ride
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateRoute;
