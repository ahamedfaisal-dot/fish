import { useEffect } from 'react';

interface HeatmapPoint {
  lat: number;
  lng: number;
  probability: number;
  weight: number;
}

interface CatchProbabilityHeatmapProps {
  map: any;
  heatmapData: HeatmapPoint[];
  visible: boolean;
  opacity?: number;
}

export default function CatchProbabilityHeatmap({ 
  map, 
  heatmapData, 
  visible, 
  opacity = 0.6 
}: CatchProbabilityHeatmapProps) {
  // This component is now simplified since we're using a custom map visualization
  // The heatmap is rendered directly in the InteractiveMap component
  
  useEffect(() => {
    console.log('Heatmap data updated:', heatmapData.length, 'points');
  }, [heatmapData]);

  return null;
}