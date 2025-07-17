import { useState } from "react";
import Header from "@/components/Navigation/Header";
import ControlsSidebar from "@/components/Sidebar/ControlsSidebar";
import InteractiveMap from "@/components/Map/InteractiveMap";
import CatchReportModal from "@/components/Modals/CatchReportModal";
import MobileBottomNav from "@/components/Navigation/MobileBottomNav";
import ChatBot from "@/components/Chat/ChatBot";
import RegulatoryZonesOverlay from "@/components/Map/RegulatoryZonesOverlay";
import { useWeatherData } from "@/hooks/useWeatherData";
import { usePredictions } from "@/hooks/usePredictions";
import { useHeatmapData } from "@/hooks/useHeatmapData";
import { RegulatoryZone } from "@/lib/regulatoryZones";

export default function Dashboard() {
  const [isCatchReportOpen, setIsCatchReportOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [selectedRegulatoryZone, setSelectedRegulatoryZone] = useState<RegulatoryZone | null>(null);
  const [showRegulatoryZones, setShowRegulatoryZones] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapCenter] = useState({ lat: 13.0827, lng: 80.2707 }); // Chennai coastline, Bay of Bengal
  const [currentRoute, setCurrentRoute] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    species: "All Species",
    timeRange: "Next 12 Hours",
    confidence: 70
  });

  const { data: weather, isLoading: weatherLoading } = useWeatherData(mapCenter.lat, mapCenter.lng);
  const { data: predictions, isLoading: predictionsLoading, refetch: refetchPredictions } = usePredictions({
    species: filters.species,
    timeRange: 12,
    confidence: filters.confidence / 100,
    bounds: {
      north: mapCenter.lat + 0.1,
      south: mapCenter.lat - 0.1,
      east: mapCenter.lng + 0.1,
      west: mapCenter.lng - 0.1
    }
  });

  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmapData({
    bounds: {
      north: mapCenter.lat + 0.1,
      south: mapCenter.lat - 0.1,
      east: mapCenter.lng + 0.1,
      west: mapCenter.lng - 0.1
    },
    species: filters.species,
    timeRange: 24,
    resolution: 0.005
  }, showHeatmap);

  const handleOpenCatchReport = () => {
    setIsCatchReportOpen(true);
  };

  const handleCloseCatchReport = () => {
    setIsCatchReportOpen(false);
  };

  const handleCatchReportSubmit = async () => {
    // Refresh predictions after new catch report
    await refetchPredictions();
    handleCloseCatchReport();
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleGenerateRoute = async (zones: any[]) => {
    if (zones.length === 0) return;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('/api/routes/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startPoint: { lat: mapCenter.lat, lng: mapCenter.lng },
          targetZones: zones,
          preferences: {
            maxDistance: 50,
            fuelPrice: 3.5,
            boatSpeed: 25,
            fuelConsumption: 12
          }
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Route optimization failed: ${response.status}`);
      }
      
      const routeData = await response.json();
      setCurrentRoute(routeData.waypoints || []);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Route request was cancelled');
      } else {
        console.error('Route generation failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onOpenCatchReport={handleOpenCatchReport} />
      
      <div className="flex h-screen pt-16">
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <ControlsSidebar
            weather={weather}
            weatherLoading={weatherLoading}
            predictions={predictions}
            predictionsLoading={predictionsLoading}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            selectedZone={selectedZone}
            onGenerateRoute={handleGenerateRoute}
            showHeatmap={showHeatmap}
            onHeatmapToggle={setShowHeatmap}
          />
          
          {/* Regulatory Zones Section */}
          <div className="p-4 border-t border-gray-200">
            <RegulatoryZonesOverlay
              currentPosition={mapCenter}
              plannedRoute={currentRoute}
              onZoneClick={setSelectedRegulatoryZone}
            />
          </div>
        </div>
        
        <InteractiveMap
          center={mapCenter}
          zones={predictions?.zones || []}
          weather={weather}
          onZoneSelect={setSelectedZone}
          selectedZone={selectedZone}
          route={currentRoute}
          heatmapData={heatmapData}
          showHeatmap={showHeatmap}
        />
      </div>

      <MobileBottomNav onOpenCatchReport={handleOpenCatchReport} />

      <CatchReportModal
        isOpen={isCatchReportOpen}
        onClose={handleCloseCatchReport}
        onSubmit={handleCatchReportSubmit}
      />

      {/* AI Chat Assistant */}
      <ChatBot weather={weather} predictions={predictions} />
    </div>
  );
}
