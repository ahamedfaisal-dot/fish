import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Navigation } from "lucide-react";
import type { FishingZone } from "@shared/schema";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN } from '@/lib/mapbox';
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
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState(center);
  const [mapLoadError, setMapLoadError] = useState(false);
  const routeMarkers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // Check if Mapbox access token is available
      if (!MAPBOX_ACCESS_TOKEN) {
        console.warn("Mapbox token not configured - map features will be limited");
        setMapLoadError(true);
        return;
      }

      // Set Mapbox access token
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

      // Initialize map with satellite view (no streets for ocean focus)
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [center.lng, center.lat],
        zoom: 10,
        pitch: 0,
        bearing: 0
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add geolocate control with error handling
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
      });
      
      geolocate.on('error', (error) => {
        console.log('Geolocation error:', error);
      });
      
      map.current.addControl(geolocate, 'top-right');

      // For Tamil Nadu coastal fishing, use default Chennai location instead of GPS
      // This ensures routes are generated in Bay of Bengal waters
      const defaultTamilNaduLocation = {
        lat: 13.0827,
        lng: 80.2707
      };
      setCurrentLocation(defaultTamilNaduLocation);
    } catch (error) {
      console.error("Map initialization error:", error);
    }

    return () => {
      try {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      } catch (error) {
        console.log("Map cleanup error:", error);
      }
    };
  }, [center]);

  // Update fishing zones on map
  useEffect(() => {
    if (!map.current) return;

    const addZones = () => {
      if (!map.current || zones.length === 0) return;

      try {
        // Remove existing layers and sources safely
        if (map.current.getLayer('fishing-zones-layer')) {
          map.current.removeLayer('fishing-zones-layer');
        }
        if (map.current.getSource('fishing-zones')) {
          map.current.removeSource('fishing-zones');
        }

        const geojsonData = {
          type: 'FeatureCollection' as const,
          features: zones.map(zone => ({
            type: 'Feature' as const,
            properties: {
              id: zone.id,
              name: zone.name,
              confidence: zone.confidence,
              species: zone.species || [],
              depth: zone.depth
            },
            geometry: {
              type: 'Point' as const,
              coordinates: [zone.longitude, zone.latitude]
            }
          }))
        };

        map.current.addSource('fishing-zones', {
          type: 'geojson',
          data: geojsonData
        });

        // Add fishing zones layer
        map.current.addLayer({
          id: 'fishing-zones-layer',
          type: 'circle',
          source: 'fishing-zones',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'confidence'],
              0.5, 8,
              0.8, 16,
              1.0, 24
            ],
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'confidence'],
              0.5, '#ef4444',
              0.7, '#eab308',
              0.8, '#22c55e'
            ],
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });

      } catch (error) {
        console.error('Error adding fishing zones to map:', error);
      }
    };

    // Set up event handlers only once
    const handleZoneClick = (e: any) => {
      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const zoneId = feature.properties?.id;
        const zone = zones.find(z => z.id === zoneId);
        if (zone) {
          onZoneSelect(zone === selectedZone ? null : zone);
        }
      }
    };

    const handleMouseEnter = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    };

    const handleMouseLeave = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    };

    if (map.current.isStyleLoaded()) {
      addZones();
      // Remove existing event listeners to prevent duplicates
      map.current.off('click', 'fishing-zones-layer', handleZoneClick);
      map.current.off('mouseenter', 'fishing-zones-layer', handleMouseEnter);
      map.current.off('mouseleave', 'fishing-zones-layer', handleMouseLeave);
      // Add new event listeners
      map.current.on('click', 'fishing-zones-layer', handleZoneClick);
      map.current.on('mouseenter', 'fishing-zones-layer', handleMouseEnter);
      map.current.on('mouseleave', 'fishing-zones-layer', handleMouseLeave);
    } else {
      const onLoad = () => {
        addZones();
        if (map.current) {
          map.current.on('click', 'fishing-zones-layer', handleZoneClick);
          map.current.on('mouseenter', 'fishing-zones-layer', handleMouseEnter);
          map.current.on('mouseleave', 'fishing-zones-layer', handleMouseLeave);
        }
      };
      map.current.once('load', onLoad);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        try {
          map.current.off('click', 'fishing-zones-layer', handleZoneClick);
          map.current.off('mouseenter', 'fishing-zones-layer', handleMouseEnter);
          map.current.off('mouseleave', 'fishing-zones-layer', handleMouseLeave);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, [zones, selectedZone, onZoneSelect]);

  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);

  const generateRoute = async () => {
    if (!map.current || zones.length === 0 || isGeneratingRoute) return;
    
    setIsGeneratingRoute(true);
    let controller: AbortController | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    try {
      controller = new AbortController();
      timeoutId = setTimeout(() => {
        if (controller && !controller.signal.aborted) {
          controller.abort();
        }
      }, 15000);

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
        signal: controller.signal
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (controller.signal.aborted) {
        return;
      }

      if (!response.ok) {
        throw new Error(`Route optimization failed: ${response.status}`);
      }
      
      const optimizedRoute = await response.json();
      
      if (controller.signal.aborted) {
        return;
      }
      
      console.log('Route optimization response:', optimizedRoute);
      
      if (!map.current || !optimizedRoute.waypoints || optimizedRoute.waypoints.length < 2) {
        console.warn('Invalid route data received:', optimizedRoute);
        return;
      }

      // Add route to map safely
      if (map.current && !controller.signal.aborted) {
        try {
          // Remove existing route and markers
          if (map.current.getLayer('route-layer')) {
            map.current.removeLayer('route-layer');
          }
          if (map.current.getSource('route')) {
            map.current.removeSource('route');
          }
          
          // Clear existing route markers
          routeMarkers.current.forEach(marker => marker.remove());
          routeMarkers.current = [];

          const routeCoordinates = optimizedRoute.waypoints.map((point: any) => {
            const lng = point.lng || point.longitude;
            const lat = point.lat || point.latitude;
            return [lng, lat];
          });
          
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            }
          });

          map.current.addLayer({
            id: 'route-layer',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#00ffff',
              'line-width': 6,
              'line-opacity': 0.9
            }
          });

          // Add route waypoint markers
          optimizedRoute.waypoints.forEach((waypoint: any, index: number) => {
            const marker = new mapboxgl.Marker({
              color: index === 0 ? '#00ff00' : '#ff6600',
              scale: 0.8
            })
            .setLngLat([waypoint.lng, waypoint.lat])
            .setPopup(new mapboxgl.Popup().setHTML(
              `<div class="p-2">
                <h3 class="font-bold">${index === 0 ? 'Start' : `Zone ${index}`}</h3>
                <p>Lat: ${waypoint.lat.toFixed(4)}</p>
                <p>Lng: ${waypoint.lng.toFixed(4)}</p>
              </div>`
            ))
            .addTo(map.current!);
            
            routeMarkers.current.push(marker);
          });

          console.log('Route added successfully to map with', routeCoordinates.length, 'waypoints');
          
          // Fit map bounds to show the entire route
          if (routeCoordinates.length > 1 && !controller.signal.aborted) {
            setTimeout(() => {
              if (map.current && !controller?.signal.aborted) {
                try {
                  const bounds = new mapboxgl.LngLatBounds();
                  routeCoordinates.forEach((coord: [number, number]) => bounds.extend(coord));
                  map.current.fitBounds(bounds, { padding: 50 });
                } catch (boundsError) {
                  console.log('Bounds calculation skipped');
                }
              }
            }, 200);
          }
        } catch (mapError) {
          console.error('Error adding route to map:', mapError);
        }
      }

    } catch (error) {
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
        // Silently handle abort errors
      } else {
        console.error('Route generation failed:', error);
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsGeneratingRoute(false);
    }
  };

  return (
    <div className="flex-1 relative">
      {/* Mapbox Map Container or Fallback */}
      {mapLoadError ? (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300" style={{ minHeight: '500px' }}>
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map Unavailable</h3>
            <p className="text-gray-600 mb-4">Map features require configuration</p>
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">Current Location: Tamil Nadu Coast</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Latitude: {center.lat.toFixed(4)}</div>
                <div>Longitude: {center.lng.toFixed(4)}</div>
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-gray-500">
                    {zones.length} fishing zones available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div 
          ref={mapContainer}
          className="h-full w-full"
          style={{ minHeight: '500px' }}
        />
      )}

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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Overlay */}
      {map.current && heatmapData && (
        <CatchProbabilityHeatmap
          map={map.current}
          heatmapData={heatmapData.points || []}
          visible={showHeatmap}
          opacity={0.6}
        />
      )}
    </div>
  );
}