import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, FileText, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Belediye Sorun Bildirimi</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-4">
          <Link to="/report" className="block">
            <Button size="lg" className="w-full h-20 text-lg">
              <FileText className="mr-3 h-6 w-6" />
              Raporla
            </Button>
          </Link>
          
          <Link to="/all-reports" className="block">
            <Button size="lg" variant="outline" className="w-full h-20 text-lg">
              <Users className="mr-3 h-6 w-6" />
              Kullanıcı Raporları
            </Button>
          </Link>

          <Link to="/dashboard" className="block">
            <Button size="lg" variant="secondary" className="w-full h-16">
              Raporlarım
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
