import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { LocationPicker } from "@/components/LocationPicker";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ReportProblem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    image: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store report in localStorage for demo purposes
    const reports = JSON.parse(localStorage.getItem("reports") || "[]");
    const newReport = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined,
      status: "submitted",
      createdAt: new Date().toISOString(),
    };
    reports.push(newReport);
    localStorage.setItem("reports", JSON.stringify(reports));

    toast({
      title: "Rapor Gönderildi",
      description: "Raporunuz ilgili belediyeye gönderildi.",
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Sorun Bildir</CardTitle>
            <CardDescription>
              Yerel sorunları bildirerek topluluğunuzu iyileştirmemize yardımcı olun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Sorun Başlığı</Label>
                <Input
                  id="title"
                  placeholder="Örn: Ana Caddede kırık sokak lambası"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sorun türünü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pothole">Çukur</SelectItem>
                    <SelectItem value="streetlight">Bozuk Sokak Lambası</SelectItem>
                    <SelectItem value="garbage">Çöp / Atık</SelectItem>
                    <SelectItem value="damaged-sign">Hasarlı Tabela</SelectItem>
                    <SelectItem value="graffiti">Grafiti</SelectItem>
                    <SelectItem value="other">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  placeholder="Sorunu detaylı bir şekilde açıklayın..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Fotoğraf</Label>
                <ImageUpload
                  onImageSelect={(file) => setFormData({ ...formData, image: file })}
                />
              </div>

              <LocationPicker
                onLocationSelect={(location) => setFormData({ ...formData, location })}
                currentLocation={formData.location}
              />

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" size="lg">
                  Raporu Gönder
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReportProblem;
