import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api, type VisitorData } from "@/lib/api";
import { UserPlus, Building2, Mail, Phone, User } from "lucide-react";

// VisitorData interface is now imported from api.ts

export const VisitorCheckIn = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<VisitorData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    hostName: "",
    purpose: "",
    department: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    "Reception",
    "Human Resources",
    "Sales",
    "Marketing",
    "Engineering",
    "Finance",
    "Operations",
    "Management"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await api.checkInVisitor(formData);
      
      if (result.success) {
        toast({
          title: "Check-in Successful!",
          description: `Welcome ${formData.name}! You have been checked in.`,
          className: "bg-success text-success-foreground",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          hostName: "",
          purpose: "",
          department: ""
        });
      } else {
        throw new Error('Check-in failed');
      }
    } catch (error) {
      toast({
        title: "Check-in Failed",
        description: error instanceof Error ? error.message : "There was an error processing your check-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof VisitorData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/90">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@company.com"
                      className="pl-10 mt-1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10 mt-1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="Your company name"
                      className="pl-10 mt-1"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visit Information */}
          <Card className="border-accent/20 bg-gradient-to-br from-card to-card/90">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" />
                Visit Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hostName">Person to Meet *</Label>
                  <Input
                    id="hostName"
                    type="text"
                    value={formData.hostName}
                    onChange={(e) => handleInputChange("hostName", e.target.value)}
                    placeholder="Host's full name"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="purpose">Purpose of Visit *</Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                    placeholder="Brief description of your visit purpose"
                    className="mt-1"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Check In
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};