// Mapbox configuration and utilities
export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

export const DEFAULT_MAP_CONFIG = {
  style: 'mapbox://styles/mapbox/satellite-streets-v12',
  center: [-73.9851, 40.7589] as [number, number], // NYC area
  zoom: 11,
  pitch: 0,
  bearing: 0
};

export const MAP_LAYERS = {
  FISHING_ZONES: 'fishing-zones',
  ROUTES: 'routes',
  WEATHER: 'weather-overlay',
  BATHYMETRY: 'bathymetry'
};

// Utility functions for map operations
export const calculateBounds = (zones: Array<{ latitude: number; longitude: number }>) => {
  if (zones.length === 0) return null;
  
  const lats = zones.map(z => z.latitude);
  const lngs = zones.map(z => z.longitude);
  
  return [
    [Math.min(...lngs), Math.min(...lats)], // Southwest
    [Math.max(...lngs), Math.max(...lats)]  // Northeast
  ] as [[number, number], [number, number]];
};

export const formatCoordinates = (lat: number, lng: number): string => {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
};
