import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Navigation, MapPin } from "lucide-react";
import type { FishingZone } from "@shared/schema";
import CatchProbabilityHeatmap from './CatchProbabilityHeatmap';

interface InteractiveMapProps {
  center: { lat: number; lng: number };
  zones: FishingZone[];
  weather?: any;
  onZoneSelect: (zone: FishingZone | null) => void;
  selectedZone: FishingZone | null;
  route?: any[];
  heatmapData?: any;
  showHeatmap?: boolean;
}

export default function InteractiveMap({ 
  center, 
  zones, 
  weather, 
  onZoneSelect, 
  selectedZone,
  route = [],
  heatmapData,
  showHeatmap = false
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState(center);
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);

  // Set default Tamil Nadu location
  useEffect(() => {
    const defaultTamilNaduLocation = {
      lat: 13.0827,
      lng: 80.2707
    };
    setCurrentLocation(defaultTamilNaduLocation);
  }, []);

  const generateRoute = async () => {
    if (zones.length === 0 || isGeneratingRoute) return;
    
    setIsGeneratingRoute(true);

    try {
      const response = await fetch("/api/routes/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startPoint: currentLocation,
          targetZones: zones.slice(0, 3),
          preferences: {
            maxDistance: 50,
            fuelPrice: 3.50,
            boatSpeed: 25,
            fuelConsumption: 12
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Route optimization failed: ${response.status}`);
      }
      
      const optimizedRoute = await response.json();
      console.log('Route optimization response:', optimizedRoute);

    } catch (error) {
      console.error('Route generation failed:', error);
    } finally {
      setIsGeneratingRoute(false);
    }
  };

  return (
    <div className="flex-1 relative">
      {/* Map Visualization */}
      <div className="h-full w-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden" style={{ minHeight: '500px' }}>
        {/* Ocean Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 2px, transparent 2px),
              radial-gradient(circle at 60% 70%, rgba(255,255,255,0.2) 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 3px, transparent 3px)
            `,
            backgroundSize: '100px 100px, 150px 150px, 200px 200px'
          }} />
        </div>
        
        {/* Fishing Zones */}
        <div className="absolute inset-0">
          {zones.map((zone, index) => {
            const x = ((zone.longitude - 77) / (81 - 77)) * 100; // Normalize longitude to percentage
            const y = ((13.5 - zone.latitude) / (13.5 - 8)) * 100; // Normalize latitude to percentage
            
            return (
              <div
                key={zone.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                  selectedZone?.id === zone.id ? 'scale-125 z-20' : 'z-10'
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => onZoneSelect(zone === selectedZone ? null : zone)}
              >
                <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg animate-pulse ${
                  zone.confidence >= 0.8 ? 'bg-green-500' :
                  zone.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                    {zone.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Route Lines */}
        {route.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {route.map((point, index) => {
              if (index === route.length - 1) return null;
              const nextPoint = route[index + 1];
              
              const x1 = ((point.lng - 77) / (81 - 77)) * 100;
              const y1 = ((13.5 - point.lat) / (13.5 - 8)) * 100;
              const x2 = ((nextPoint.lng - 77) / (81 - 77)) * 100;
              const y2 = ((13.5 - nextPoint.lat) / (13.5 - 8)) * 100;
              
              return (
                <line
                  key={index}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="#00ffff"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
        )}
        
        {/* Current Location Indicator */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
          style={{ 
            left: `${((currentLocation.lng - 77) / (81 - 77)) * 100}%`, 
            top: `${((13.5 - currentLocation.lat) / (13.5 - 8)) * 100}%` 
          }}
        >
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-ping" />
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Current Location
          </div>
        </div>
        
        {/* Coordinate Grid */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Tamil Nadu Coast • Bay of Bengal
        </div>
      </div>

      {/* Zone Information Card */}
      {selectedZone && (
        <div className="absolute top-4 right-4 z-30">
          <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">{selectedZone.name}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  Confidence: <span className="font-medium text-green-600">{Math.round(selectedZone.confidence * 100)}%</span>
                </div>
                <div>Species: {selectedZone.species?.join(", ") || "Mixed"}</div>
                {selectedZone.depth && <div>Depth: {selectedZone.depth} ft</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Route Generation Button */}
      <div className="absolute bottom-4 right-4 z-30">
        <Button
          onClick={generateRoute}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          disabled={zones.length === 0 || isGeneratingRoute}
        >
          <Navigation className="w-4 h-4 mr-2" />
          {isGeneratingRoute ? 'Generating...' : 'Generate Route'}
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-30">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-3">
            <h4 className="font-medium text-gray-900 mb-2">Fishing Zones</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>High Confidence (80%+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span>Medium Confidence (60-79%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Low Confidence (&lt;60%)</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="text-xs text-gray-500">
                  {zones.length} zones loaded
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{selectedZone.latitude.toFixed(4)}, {selectedZone.longitude.toFixed(4)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}