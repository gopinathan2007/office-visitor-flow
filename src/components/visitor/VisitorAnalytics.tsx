import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Clock, Building2, Calendar, UserCheck } from "lucide-react";

interface AnalyticsData {
  dailyVisits: Array<{ date: string; visits: number; }>;
  departmentVisits: Array<{ department: string; visits: number; color: string; }>;
  weeklyTrends: Array<{ week: string; visits: number; avgDuration: number; }>;
  monthlyStats: {
    totalVisitors: number;
    avgDuration: number;
    peakDay: string;
    topDepartment: string;
  };
}

export const VisitorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState("30days");

  useEffect(() => {
    // Mock analytics data - In real app, this would come from your PHP backend
    const mockData: AnalyticsData = {
      dailyVisits: [
        { date: "2024-01-01", visits: 12 },
        { date: "2024-01-02", visits: 8 },
        { date: "2024-01-03", visits: 15 },
        { date: "2024-01-04", visits: 22 },
        { date: "2024-01-05", visits: 18 },
        { date: "2024-01-06", visits: 7 },
        { date: "2024-01-07", visits: 5 },
        { date: "2024-01-08", visits: 19 },
        { date: "2024-01-09", visits: 25 },
        { date: "2024-01-10", visits: 21 }
      ],
      departmentVisits: [
        { department: "Sales", visits: 45, color: "hsl(214, 84%, 56%)" },
        { department: "Engineering", visits: 32, color: "hsl(142, 76%, 36%)" },
        { department: "Marketing", visits: 28, color: "hsl(38, 92%, 50%)" },
        { department: "Management", visits: 18, color: "hsl(215, 16%, 47%)" },
        { department: "HR", visits: 15, color: "hsl(0, 84%, 60%)" },
        { department: "Finance", visits: 12, color: "hsl(280, 84%, 56%)" }
      ],
      weeklyTrends: [
        { week: "Week 1", visits: 85, avgDuration: 65 },
        { week: "Week 2", visits: 92, avgDuration: 72 },
        { week: "Week 3", visits: 78, avgDuration: 58 },
        { week: "Week 4", visits: 105, avgDuration: 68 }
      ],
      monthlyStats: {
        totalVisitors: 360,
        avgDuration: 66,
        peakDay: "Thursday",
        topDepartment: "Sales"
      }
    };
    setAnalyticsData(mockData);
  }, [timeRange]);

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const COLORS = analyticsData.departmentVisits.map(item => item.color);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Visitor Analytics</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analyticsData.monthlyStats.totalVisitors}</div>
                <div className="text-sm text-muted-foreground">Total Visitors</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-success text-sm">
              <TrendingUp className="h-4 w-4" />
              +12% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analyticsData.monthlyStats.avgDuration}m</div>
                <div className="text-sm text-muted-foreground">Avg Duration</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-success text-sm">
              <TrendingUp className="h-4 w-4" />
              Optimal visit time
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analyticsData.monthlyStats.peakDay}</div>
                <div className="text-sm text-muted-foreground">Peak Day</div>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Busiest day of week
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analyticsData.monthlyStats.topDepartment}</div>
                <div className="text-sm text-muted-foreground">Top Department</div>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                Most visited
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Daily Visitor Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [value, 'Visitors']}
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="hsl(214, 84%, 56%)" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(214, 84%, 56%)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(214, 84%, 56%)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Department Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.departmentVisits}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="visits"
                >
                  {analyticsData.departmentVisits.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Visits']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {analyticsData.departmentVisits.map((item, index) => (
                <div key={item.department} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.department}: {item.visits}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Weekly Trends & Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData.weeklyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'visits' ? value : `${value}m`, 
                  name === 'visits' ? 'Visitors' : 'Avg Duration'
                ]}
              />
              <Bar 
                yAxisId="left" 
                dataKey="visits" 
                fill="hsl(214, 84%, 56%)" 
                radius={[4, 4, 0, 0]}
                name="visits"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="avgDuration" 
                stroke="hsl(142, 76%, 36%)" 
                strokeWidth={3}
                name="avgDuration"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};