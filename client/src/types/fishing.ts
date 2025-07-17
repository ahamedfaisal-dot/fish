export interface Coordinates {
  lat: number;
  lng: number;
}

export interface WeatherConditions {
  waterTemp: number;
  windSpeed: number;
  windDirection: string;
  tideInfo: string;
  visibility: number;
  waveHeight?: number;
  pressure?: number;
}

export interface Species {
  name: string;
  commonNames: string[];
  seasonalPattern: number[]; // Monthly multipliers 0-12
  optimalDepth: [number, number]; // Min/max depth range
  optimalTemp: [number, number]; // Min/max temperature range
}

export interface FishingConditions {
  location: Coordinates;
  weather: WeatherConditions;
  bathymetry: {
    depth: number;
    structure: 'flat' | 'drop-off' | 'reef' | 'channel' | 'seamount';
  };
  timestamp: Date;
}

export interface PredictionFactors {
  historical: number; // 0-1 based on past catches
  weather: number; // 0-1 based on current conditions
  seasonal: number; // 0-1 based on time of year
  recent: number; // 0-1 based on recent activity
}

export interface RoutePreferences {
  maxDistance?: number; // Maximum distance in miles
  fuelPrice?: number; // Price per gallon
  boatSpeed?: number; // Speed in knots
  fuelConsumption?: number; // Gallons per hour
  prioritizeConfidence?: boolean; // Weight confidence over distance
}

export interface NavigationWaypoint extends Coordinates {
  zoneId?: number;
  name?: string;
  eta?: Date;
  heading?: number; // Compass heading to next waypoint
}
