import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  waterTemp: number;
  windSpeed: number;
  windDirection: string;
  tideInfo: string;
  visibility: number;
  timestamp: Date;
}

export function useWeatherData(lat: number, lng: number) {
  return useQuery<WeatherData>({
    queryKey: [`/api/weather/${lat}/${lng}`],
    queryFn: async () => {
      const response = await fetch(`/api/weather/${lat}/${lng}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      return response.json();
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider stale after 2 minutes
  });
}
