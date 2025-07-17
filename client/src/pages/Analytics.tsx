import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Fish, MapPin, Calendar, Target } from "lucide-react";
import Header from "@/components/Navigation/Header";

export default function Analytics() {
  const { data: catchReports } = useQuery({
    queryKey: ["/api/catch-reports"],
    queryFn: async () => {
      const response = await fetch("/api/catch-reports?limit=100");
      if (!response.ok) throw new Error("Failed to fetch catch reports");
      return response.json();
    }
  });

  const { data: zones } = useQuery({
    queryKey: ["/api/fishing-zones"],
    queryFn: async () => {
      const response = await fetch("/api/fishing-zones");
      if (!response.ok) throw new Error("Failed to fetch zones");
      return response.json();
    }
  });

  // Calculate analytics from real data
  const totalCatches = catchReports?.length || 0;
  const speciesCount = new Set(catchReports?.map((r: any) => r.species) || []).size;
  const avgConfidence = zones?.length > 0 
    ? (zones.reduce((sum: number, z: any) => sum + z.confidence, 0) / zones.length * 100).toFixed(1)
    : "0";
  
  const topSpecies = catchReports?.reduce((acc: any, report: any) => {
    acc[report.species] = (acc[report.species] || 0) + 1;
    return acc;
  }, {}) || {};

  const speciesData = Object.entries(topSpecies)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  const recentActivity = catchReports?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onOpenCatchReport={() => {}} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fishing Analytics</h1>
          <p className="text-gray-600">Track your fishing performance and zone effectiveness</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Fish className="h-8 w-8 text-ocean-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Catches</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-sea-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Species Variety</p>
                  <p className="text-2xl font-bold text-gray-900">{speciesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-coral-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Zones</p>
                  <p className="text-2xl font-bold text-gray-900">{zones?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                  <p className="text-2xl font-bold text-gray-900">{avgConfidence}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Species Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-ocean-500" />
                Top Species
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {speciesData.length > 0 ? (
                  speciesData.map(([species, count]) => (
                    <div key={species} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{species}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-ocean-500 h-2 rounded-full" 
                            style={{ width: `${(count as number / totalCatches) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Fish className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No catch data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Zone Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-sea-500" />
                Zone Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zones?.slice(0, 5).map((zone: any) => (
                  <div key={zone.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{zone.name}</span>
                      <p className="text-xs text-gray-500">
                        {zone.species?.join(", ") || "Mixed species"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round(zone.confidence * 100)}%
                      </span>
                      <p className="text-xs text-gray-500">confidence</p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-8">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No zone data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-coral-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((report: any) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Fish className="w-4 h-4 text-ocean-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {report.quantity}x {report.species}
                          </span>
                          {report.weight && (
                            <span className="text-xs text-gray-500 ml-2">
                              {report.weight} lbs
                            </span>
                          )}
                          <p className="text-xs text-gray-500">
                            {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">Start reporting catches to see data here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}