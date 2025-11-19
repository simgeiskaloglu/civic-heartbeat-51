import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  onLocationSelect: (location: string) => void;
  currentLocation?: string;
}

function LocationMarker({ position, setPosition }: { position: [number, number]; setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Seçilen konum</Popup>
    </Marker>
  ) : null;
}

export const LocationPicker = ({ onLocationSelect, currentLocation }: LocationPickerProps) => {
  const [location, setLocation] = useState(currentLocation || "");
  const [mapPosition, setMapPosition] = useState<[number, number]>([39.9334, 32.8597]); // Default: Ankara
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    if (currentLocation && currentLocation.includes(",")) {
      const [lat, lng] = currentLocation.split(",").map(s => parseFloat(s.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapPosition([lat, lng]);
      }
    }
  }, [currentLocation]);

  // Auto-center on user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation && !currentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setLocation(locationString);
          setMapPosition([lat, lng]);
          onLocationSelect(locationString);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setLocation(locationString);
          setMapPosition([lat, lng]);
          setMapKey(prev => prev + 1); // Force map re-center
          onLocationSelect(locationString);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleMapPositionChange = (pos: [number, number]) => {
    setMapPosition(pos);
    const locationString = `${pos[0].toFixed(6)}, ${pos[1].toFixed(6)}`;
    setLocation(locationString);
    onLocationSelect(locationString);
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
      
      {/* Interactive Leaflet Map */}
      <div className="w-full h-[350px] rounded-lg overflow-hidden border-2 border-border">
        <MapContainer
          key={mapKey}
          center={mapPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          <LocationMarker position={mapPosition} setPosition={handleMapPositionChange} />
        </MapContainer>
      </div>
    </div>
  );
};
