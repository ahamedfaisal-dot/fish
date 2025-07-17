import { useQuery } from "@tanstack/react-query";
import type { FishingZone } from "@shared/schema";

interface PredictionParams {
  species?: string;
  timeRange: number;
  confidence: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface PredictionResult {
  zones: FishingZone[];
  confidence: number;
  factors: {
    historical: number;
    weather: number;
    seasonal: number;
    recent: number;
  };
}

export function usePredictions(params: PredictionParams) {
  return useQuery<PredictionResult>({
    queryKey: ['/api/predictions', params],
    queryFn: async () => {
      try {
        const response = await fetch('/api/predictions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });
        
        if (!response.ok) {
          throw new Error(`Predictions API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !Array.isArray(data.zones)) {
          throw new Error('Invalid predictions data format');
        }
        
        return data;
      } catch (error) {
        console.error('Predictions fetch error:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    retry: 2,
    retryDelay: 1000,
  });
}
