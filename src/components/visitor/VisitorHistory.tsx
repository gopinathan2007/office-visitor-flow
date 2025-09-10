import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Download, User, Building2, Clock, CheckCircle, XCircle } from "lucide-react";

interface VisitorRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  hostName: string;
  purpose: string;
  department: string;
  checkInTime: string;
  checkOutTime?: string;
  status: "completed" | "active" | "no_show";
  duration?: number; // in minutes
}

export const VisitorHistory = () => {
  const [records, setRecords] = useState<VisitorRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Mock data - In real app, this would come from your PHP backend
  useEffect(() => {
    const mockRecords: VisitorRecord[] = [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@techcorp.com",
        phone: "+1 (555) 123-4567",
        company: "TechCorp Solutions",
        hostName: "Sarah Johnson",
        purpose: "Project meeting and contract discussion",
        department: "Sales",
        checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "active"
      },
      {
        id: 2,
        name: "Emily Rodriguez",
        email: "emily.r@marketing.com",
        phone: "+1 (555) 234-5678",
        company: "Marketing Pro",
        hostName: "Tom Anderson",
        purpose: "Campaign strategy meeting",
        department: "Marketing",
        checkInTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        checkOutTime: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        duration: 120
      },
      {
        id: 3,
        name: "Robert Wilson",
        email: "rwilson@consulting.com",
        phone: "+1 (555) 345-6789",
        company: "Wilson Consulting",
        hostName: "Jennifer Davis",
        purpose: "Technical consultation",
        department: "Engineering",
        checkInTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        checkOutTime: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        duration: 90
      },
      {
        id: 4,
        name: "Lisa Chang",
        email: "lisa.chang@finance.com",
        phone: "+1 (555) 456-7890",
        company: "Finance Solutions",
        hostName: "Mark Thompson",
        purpose: "Financial audit meeting",
        department: "Finance",
        checkInTime: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        status: "no_show"
      },
      {
        id: 5,
        name: "Alex Johnson",
        email: "alex@startup.com",
        phone: "+1 (555) 567-8901",
        company: "Startup Inc",
        hostName: "Rachel Green",
        purpose: "Partnership discussion",
        department: "Management",
        checkInTime: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
        checkOutTime: new Date(Date.now() - 94 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        duration: 45
      }
    ];
    setRecords(mockRecords);
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.hostName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    // For simplicity, we're only showing "all" and "today" for date filter
    const matchesDate = dateFilter === "all" || 
      (dateFilter === "today" && new Date(record.checkInTime).toDateString() === new Date().toDateString());
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Clock className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "no_show":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="h-3 w-3 mr-1" />
            No Show
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Host", "Department", "Purpose", "Check In", "Check Out", "Duration", "Status"];
    const csvData = filteredRecords.map(record => [
      record.name,
      record.email,
      record.phone,
      record.company,
      record.hostName,
      record.department,
      record.purpose,
      formatDateTime(record.checkInTime),
      record.checkOutTime ? formatDateTime(record.checkOutTime) : "N/A",
      formatDuration(record.duration),
      record.status
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitor-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, company, or host..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={exportToCSV} variant="outline" className="whitespace-nowrap">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{records.length}</div>
            <div className="text-sm text-muted-foreground">Total Visits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{records.filter(r => r.status === "completed").length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{records.filter(r => r.status === "active").length}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{records.filter(r => r.status === "no_show").length}</div>
            <div className="text-sm text-muted-foreground">No Shows</div>
          </CardContent>
        </Card>
      </div>

      {/* History Records */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No visitor records found</p>
                <p className="text-sm">Records will appear here as visitors check in and out</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold">{record.name}</h4>
                          {getStatusBadge(record.status)}
                        </div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {record.company}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground mb-1">Contact</div>
                        <div>{record.email}</div>
                        <div>{record.phone}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground mb-1">Visit Details</div>
                        <div>Host: {record.hostName}</div>
                        <div>Department: {record.department}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground mb-1">Time</div>
                        <div>In: {formatDateTime(record.checkInTime)}</div>
                        <div>Out: {record.checkOutTime ? formatDateTime(record.checkOutTime) : "Still active"}</div>
                        <div>Duration: {formatDuration(record.duration)}</div>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Purpose</div>
                      <p className="text-sm">{record.purpose}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};