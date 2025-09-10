import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api, type Visitor, formatTimeAgo } from "@/lib/api";
import { Search, LogOut, Clock, Building2, User, Mail, Phone } from "lucide-react";

// Visitor interface is now imported from api.ts

export const ActiveVisitors = () => {
  const { toast } = useToast();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch active visitors from the API
  const fetchActiveVisitors = async () => {
    try {
      const activeVisitors = await api.getActiveVisitors();
      setVisitors(activeVisitors);
    } catch (error) {
      toast({
        title: "Error Loading Visitors",
        description: "Failed to load active visitors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveVisitors();
    
    // Set up polling to refresh active visitors every 30 seconds
    const interval = setInterval(fetchActiveVisitors, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredVisitors = visitors.filter(visitor =>
    visitor.status === "active" &&
    (visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
     visitor.hostName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCheckOut = async (visitorId: number, visitorName: string) => {
    setIsLoading(true);
    try {
      const result = await api.checkOutVisitor(visitorId);
      
      if (result.success) {
        // Remove visitor from the active list
        setVisitors(prev => prev.filter(visitor => visitor.id !== visitorId));
        
        toast({
          title: "Check-out Successful!",
          description: `${visitorName} has been checked out.`,
          className: "bg-success text-success-foreground",
        });
      } else {
        throw new Error('Check-out failed');
      }
    } catch (error) {
      toast({
        title: "Check-out Failed",
        description: error instanceof Error ? error.message : "There was an error processing the check-out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // formatTimeAgo is now imported from api.ts

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search visitors by name, company, or host..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Active Visitors Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Active Visitors</h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {filteredVisitors.length} active
          </Badge>
        </div>
      </div>

      {/* Visitors List */}
      <div className="space-y-4">
        {isInitialLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p>Loading active visitors...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredVisitors.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No active visitors found</p>
                <p className="text-sm">Visitors will appear here when they check in</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredVisitors.map((visitor) => (
            <Card key={visitor.id} className="border-l-4 border-l-primary bg-gradient-to-r from-card to-card/90 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold">{visitor.name}</h4>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {visitor.company}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{visitor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{visitor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Meeting: {visitor.hostName}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Department: {visitor.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Checked in {formatTimeAgo(visitor.checkInTime)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm"><strong>Purpose:</strong> {visitor.purpose}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleCheckOut(visitor.id, visitor.name)}
                    disabled={isLoading}
                    variant="outline"
                    className="ml-4 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Check Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};