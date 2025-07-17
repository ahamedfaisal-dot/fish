import { useQuery } from "@tanstack/react-query";

interface HeatmapPoint {
  lat: number;
  lng: number;
  probability: number;
  weight: number;
}

interface HeatmapParams {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  species?: string;
  timeRange?: number;
  resolution?: number; // Grid resolution for heatmap points
}

interface HeatmapResult {
  points: HeatmapPoint[];
  timestamp: string;
  resolution: number;
  coverage: {
    minProbability: number;
    maxProbability: number;
    averageProbability: number;
  };
}

export function useHeatmapData(params: HeatmapParams, enabled: boolean = true) {
  return useQuery<HeatmapResult>({
    queryKey: ['/api/heatmap', params],
    queryFn: async () => {
      try {
        const response = await fetch('/api/heatmap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });
        
        if (!response.ok) {
          throw new Error(`Heatmap API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate response structure
        if (!data || !Array.isArray(data.points)) {
          throw new Error('Invalid heatmap data format');
        }
        
        return data;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw error; // Let React Query handle abort errors
        }
        console.error('Heatmap fetch error:', error);
        throw error;
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 2,
    retryDelay: 1000,
  });
}