import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, ClipboardList, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">CitiReport</h1>
          </div>
          <Link to="/dashboard">
            <Button variant="outline">
              <ClipboardList className="h-4 w-4 mr-2" />
              My Reports
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Help Improve Your Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Report local problems like potholes, broken streetlights, garbage, or damaged signs. 
            We'll route your report to the right department automatically.
          </p>
          <Link to="/report">
            <Button size="lg" className="text-lg px-8 py-6">
              <MapPin className="h-5 w-5 mr-2" />
              Report a Problem
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold mb-2">Take a Photo</h4>
                <p className="text-sm text-muted-foreground">
                  Snap a picture of the problem you want to report
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold mb-2">Add Details</h4>
                <p className="text-sm text-muted-foreground">
                  Describe the issue and confirm the location
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h4 className="font-semibold mb-2">Track Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor your report status until it's resolved
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,247</div>
              <div className="text-sm text-muted-foreground">Problems Reported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">892</div>
              <div className="text-sm text-muted-foreground">Issues Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-warning mb-2">72%</div>
              <div className="text-sm text-muted-foreground">Resolution Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Making our communities better, one report at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
