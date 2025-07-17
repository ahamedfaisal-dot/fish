import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { 
  CloudSun, 
  Brain, 
  Route, 
  Fish, 
  Play, 
  MapPin,
  Thermometer,
  Wind,
  Waves,
  Eye,
  TrendingUp
} from "lucide-react";
import type { FishingZone } from "@shared/schema";

interface ControlsSidebarProps {
  weather?: any;
  weatherLoading: boolean;
  predictions?: { zones: FishingZone[] };
  predictionsLoading: boolean;
  filters: {
    species: string;
    timeRange: string;
    confidence: number;
  };
  onFiltersChange: (filters: any) => void;
  selectedZone: FishingZone | null;
  onGenerateRoute?: (zones: FishingZone[]) => void;
  showHeatmap?: boolean;
  onHeatmapToggle?: (show: boolean) => void;
}

export default function ControlsSidebar({
  weather,
  weatherLoading,
  predictions,
  predictionsLoading,
  filters,
  onFiltersChange,
  selectedZone,
  onGenerateRoute,
  showHeatmap,
  onHeatmapToggle
}: ControlsSidebarProps) {
  const { data: catchReports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/catch-reports"],
    queryFn: async () => {
      const response = await fetch("/api/catch-reports?limit=5");
      if (!response.ok) throw new Error("Failed to fetch catch reports");
      return response.json();
    }
  });

  const handleStartNavigation = async () => {
    if (!predictions?.zones || predictions.zones.length === 0) {
      return;
    }

    if (onGenerateRoute) {
      onGenerateRoute(predictions.zones.slice(0, 3)); // Pass top 3 zones
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Weather & Conditions Panel */}
      <div className="p-4 bg-gradient-to-r from-ocean-50 to-blue-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <CloudSun className="w-5 h-5 text-ocean-500 mr-2" />
          Current Conditions
        </h3>
        
        {weatherLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-3">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-1 mb-1">
                  <Thermometer className="w-3 h-3 text-gray-500" />
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Water Temp</div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {weather?.waterTemp || 72}°F
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-1 mb-1">
                  <Wind className="w-3 h-3 text-gray-500" />
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Wind</div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {weather?.windSpeed || 8} mph {weather?.windDirection || 'NE'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-1 mb-1">
                  <Waves className="w-3 h-3 text-gray-500" />
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Tide</div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {weather?.tideInfo || 'High 2:30 PM'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-1 mb-1">
                  <Eye className="w-3 h-3 text-gray-500" />
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Visibility</div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {weather?.visibility || 12} miles
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Prediction Controls */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Brain className="w-5 h-5 text-ocean-500 mr-2" />
          Prediction Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Species</label>
            <Select 
              value={filters.species} 
              onValueChange={(value) => onFiltersChange({ species: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Species">All Species</SelectItem>
                <SelectItem value="Seer Fish">Seer Fish</SelectItem>
                <SelectItem value="Pomfret">Pomfret</SelectItem>
                <SelectItem value="Red Snapper">Red Snapper</SelectItem>
                <SelectItem value="Pearl Spot">Pearl Spot</SelectItem>
                <SelectItem value="Kingfish">Kingfish</SelectItem>
                <SelectItem value="Tuna">Tuna</SelectItem>
                <SelectItem value="Sailfish">Sailfish</SelectItem>
                <SelectItem value="Marlin">Marlin</SelectItem>
                <SelectItem value="Mackerel">Mackerel</SelectItem>
                <SelectItem value="Sardine">Sardine</SelectItem>
                <SelectItem value="Anchovy">Anchovy</SelectItem>
                <SelectItem value="Flying Fish">Flying Fish</SelectItem>
                <SelectItem value="Mullet">Mullet</SelectItem>
                <SelectItem value="Hilsa">Hilsa</SelectItem>
                <SelectItem value="Grouper">Grouper</SelectItem>
                <SelectItem value="Barracuda">Barracuda</SelectItem>
                <SelectItem value="Shark">Shark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <Select 
              value={filters.timeRange} 
              onValueChange={(value) => onFiltersChange({ timeRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Next 6 Hours">Next 6 Hours</SelectItem>
                <SelectItem value="Next 12 Hours">Next 12 Hours</SelectItem>
                <SelectItem value="Next 24 Hours">Next 24 Hours</SelectItem>
                <SelectItem value="Next 3 Days">Next 3 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Level</label>
            <div className="px-2">
              <Slider
                value={[filters.confidence]}
                onValueChange={(value) => onFiltersChange({ confidence: value[0] })}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span className="font-medium">{filters.confidence}% Confidence</span>
                <span>High</span>
              </div>
            </div>
          </div>
          
          {/* Heatmap Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visualization</label>
            <Button
              variant={showHeatmap ? "default" : "outline"}
              size="sm"
              onClick={() => onHeatmapToggle?.(!showHeatmap)}
              className="w-full flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{showHeatmap ? 'Hide' : 'Show'} Probability Heatmap</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Route Planning */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Route className="w-5 h-5 text-ocean-500 mr-2" />
          Route Planning
        </h3>
        
        {predictionsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="space-y-3">
            {predictions?.zones && predictions.zones.length > 0 ? (
              <>
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Optimal Route</div>
                        <div className="text-sm text-gray-500">
                          {predictions.zones.length} zones available
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          ${(predictions.zones.length * 15 + 20).toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-500">Est. fuel</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Travel Time</div>
                        <div className="text-sm text-gray-500">
                          ~{Math.ceil(predictions.zones.length * 45)}m
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {predictions.zones.filter(z => z.confidence >= 0.8).length}
                        </div>
                        <div className="text-sm text-gray-500">High confidence</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-ocean-50 to-blue-50 border-ocean-200">
                  <CardContent className="p-3">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 mb-2">Top Zone</div>
                      <div className="text-ocean-700">
                        {predictions.zones.sort((a, b) => b.confidence - a.confidence)[0]?.name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {Math.round(predictions.zones.sort((a, b) => b.confidence - a.confidence)[0]?.confidence * 100)}% confidence
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="p-3">
                  <div className="text-center text-gray-500">
                    <div className="font-medium">No zones found</div>
                    <div className="text-sm">Adjust filters to see predictions</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        <Button 
          className="w-full mt-3 bg-coral-500 text-white hover:bg-coral-600"
          onClick={handleStartNavigation}
          disabled={predictionsLoading || !predictions?.zones?.length}
        >
          <Play className="w-4 h-4 mr-2" />
          Start Navigation
        </Button>
      </div>

      {/* Recent Catches */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Fish className="w-5 h-5 text-ocean-500 mr-2" />
          Recent Activity
        </h3>
        
        {reportsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-3">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : catchReports?.length > 0 ? (
          <div className="space-y-3">
            {catchReports.map((report: any) => (
              <Card key={report.id} className="border shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{report.species}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {report.length && <div>{report.length}" • {report.weight} lbs</div>}
                    <div className="flex items-center mt-1">
                      <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                      <span>{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Fish className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent catches</p>
            <p className="text-sm">Submit your first catch report!</p>
          </div>
        )}
      </div>
    </div>
  );
}
