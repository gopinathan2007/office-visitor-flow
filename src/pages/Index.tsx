import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisitorCheckIn } from "@/components/visitor/VisitorCheckIn";
import { ActiveVisitors } from "@/components/visitor/ActiveVisitors";
import { VisitorHistory } from "@/components/visitor/VisitorHistory";
import { VisitorAnalytics } from "@/components/visitor/VisitorAnalytics";
import { Users, UserCheck, History, BarChart3 } from "lucide-react";
import heroImage from "@/assets/office-hero.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("checkin");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="relative flex h-full items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Visitor Management System
            </h1>
            <p className="text-lg opacity-90">
              Streamline your office visitor experience with professional check-in and tracking
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="checkin" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Check In
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Visitors
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Visitor Check-In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VisitorCheckIn />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Active Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActiveVisitors />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Visitor History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VisitorHistory />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Visitor Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VisitorAnalytics />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;