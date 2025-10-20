import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationPickerProps {
  onLocationSelect: (location: string) => void;
  currentLocation?: string;
}

export const LocationPicker = ({ onLocationSelect, currentLocation }: LocationPickerProps) => {
  const [location, setLocation] = useState(currentLocation || "");

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationString = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
          setLocation(locationString);
          onLocationSelect(locationString);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location">Konum</Label>
        <div className="flex gap-2">
          <Input
            id="location"
            placeholder="Adres girin veya mevcut konumu kullanın"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              onLocationSelect(e.target.value);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleUseCurrentLocation}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Simple map placeholder */}
      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-border">
        <div className="text-center text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
          <p className="text-sm">Harita görünümü</p>
          {location && <p className="text-xs mt-1">{location}</p>}
        </div>
      </div>
    </div>
  );
};
