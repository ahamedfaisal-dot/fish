import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface HeatmapPoint {
  lat: number;
  lng: number;
  probability: number;
  weight: number;
}

interface CatchProbabilityHeatmapProps {
  map: mapboxgl.Map | null;
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
  const sourceIdRef = useRef('catch-probability-heatmap');
  const layerIdRef = useRef('catch-probability-heatmap-layer');

  useEffect(() => {
    if (!map || !heatmapData.length) return;

    const sourceId = sourceIdRef.current;
    const layerId = layerIdRef.current;

    try {
      // Convert heatmap data to GeoJSON
      const geojsonData = {
        type: 'FeatureCollection' as const,
        features: heatmapData.map(point => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [point.lng, point.lat]
          },
          properties: {
            probability: point.probability,
            weight: point.weight
          }
        }))
      };

      // Remove existing source and layer if they exist
      try {
        if (map.getLayer(layerId + '-point')) {
          map.removeLayer(layerId + '-point');
        }
      } catch (e) {
        // Layer might not exist, continue
      }
      
      try {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      } catch (e) {
        // Layer might not exist, continue
      }
      
      try {
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      } catch (e) {
        // Source might not exist, continue
      }

      // Add new source
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojsonData
      });

      // Add heatmap layer
      map.addLayer({
        id: layerId,
        type: 'heatmap',
        source: sourceId,
        layout: {
          visibility: visible ? 'visible' : 'none'
        },
        paint: {
          // Increase the heatmap weight based on probability and weight
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['*', ['get', 'probability'], ['get', 'weight']],
            0, 0,
            1, 1
          ],
          // Increase the heatmap color intensity as zoom level increases
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            9, 3
          ],
          // Color ramp for heatmap - blue (low) to red (high) probability
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgba(103,169,207,0.3)',
            0.4, 'rgba(209,229,240,0.5)',
            0.6, 'rgba(253,219,199,0.7)',
            0.8, 'rgba(239,138,98,0.8)',
            1, 'rgba(178,24,43,0.9)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            9, 20
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, opacity,
            9, 0
          ]
        }
      });

      // Add a circle layer for high zoom levels
      map.addLayer({
        id: layerId + '-point',
        type: 'circle',
        source: sourceId,
        minzoom: 7,
        layout: {
          visibility: visible ? 'visible' : 'none'
        },
        paint: {
          // Size circle radius by probability
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['*', ['get', 'probability'], ['get', 'weight']],
            0, 1,
            1, 20
          ],
          // Color circles by probability
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'probability'],
            0, '#313695',
            0.1, '#4575b4',
            0.3, '#74add1',
            0.5, '#abd9e9',
            0.7, '#fee090',
            0.9, '#f46d43',
            1, '#a50026'
          ],
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0,
            8, opacity
          ]
        }
      });

    } catch (error) {
      console.error('Heatmap layer error:', error);
    }

    return () => {
      try {
        if (map.getLayer(layerId + '-point')) {
          map.removeLayer(layerId + '-point');
        }
      } catch (e) {
        // Layer cleanup error, ignore
      }
      
      try {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      } catch (e) {
        // Layer cleanup error, ignore
      }
      
      try {
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      } catch (e) {
        // Source cleanup error, ignore
      }
    };
  }, [map, heatmapData, opacity]);

  // Update layer visibility
  useEffect(() => {
    if (!map) return;

    const layerId = layerIdRef.current;
    try {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
      if (map.getLayer(layerId + '-point')) {
        map.setLayoutProperty(layerId + '-point', 'visibility', visible ? 'visible' : 'none');
      }
    } catch (error) {
      console.error('Heatmap visibility error:', error);
    }
  }, [map, visible]);

  return null;
}