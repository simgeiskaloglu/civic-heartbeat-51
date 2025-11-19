import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Bell, Search, Home, ShoppingBag, MessageCircle, User, Plus, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Index = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([39.9334, 32.8597]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      {/* Main Container - Mobile Card */}
      <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Sorun Bildirimi</h1>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ne arıyorsunuz?"
              className="pl-10 rounded-full border-muted"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          
          {/* Category Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Link to="/report" className="block">
              <div className="bg-primary rounded-2xl p-4 h-24 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
                <div className="relative z-10">
                  <p className="text-white font-semibold text-sm">Raporla</p>
                  <p className="text-white/80 text-xs">Yeni</p>
                </div>
              </div>
            </Link>
            
            <Link to="/all-reports" className="block">
              <div className="bg-[#7a9d7e] rounded-2xl p-4 h-24 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
                <div className="relative z-10">
                  <p className="text-white font-semibold text-sm">Tüm</p>
                  <p className="text-white/80 text-xs">Raporlar</p>
                </div>
              </div>
            </Link>
            
            <Link to="/dashboard" className="block">
              <div className="bg-[#f5a6a6] rounded-2xl p-4 h-24 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
                <div className="relative z-10">
                  <p className="text-white font-semibold text-sm">Benim</p>
                  <p className="text-white/80 text-xs">Raporlarım</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Map Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Yakınımdaki Sorunlar</h2>
            </div>
            <div className="w-full h-[200px] rounded-2xl overflow-hidden border-2 border-border">
              <MapContainer
                center={userLocation}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={userLocation}>
                  <Popup>Konumunuz</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Son Raporlar</h2>
            
            <div className="space-y-3">
              <Link to="/all-reports" className="block">
                <div className="bg-muted rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm text-foreground">Kullanıcı</p>
                        <p className="text-xs text-muted-foreground">30 Dk önce</p>
                      </div>
                      <p className="text-sm text-foreground mb-2 font-medium">Çukur bildirimi</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Yolda büyük bir çukur var, araç geçişi zor...
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="flex items-center justify-around py-3 px-6">
            <Button variant="ghost" size="icon" className="relative">
              <Home className="h-5 w-5 text-primary" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            
            {/* Spacer for FAB */}
            <div className="w-12" />
            
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Floating Action Button */}
        <Link to="/report">
          <Button
            size="icon"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90"
          >
            <Plus className="h-7 w-7" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
