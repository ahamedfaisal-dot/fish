import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Ban, Info, Phone, MapPin, Calendar } from 'lucide-react';
import { tamilNaduRegulatoryZones, isZoneActive, isPointInZone, RegulatoryZone } from '@/lib/regulatoryZones';
import { useLanguage } from '@/lib/LanguageContext';

interface RegulatoryZonesOverlayProps {
  currentPosition: { lat: number; lng: number };
  plannedRoute?: Array<{ lat: number; lng: number }>;
  onZoneClick?: (zone: RegulatoryZone) => void;
}

export default function RegulatoryZonesOverlay({ 
  currentPosition, 
  plannedRoute = [], 
  onZoneClick 
}: RegulatoryZonesOverlayProps) {
  const { t } = useLanguage();
  const [activeZones, setActiveZones] = useState<RegulatoryZone[]>([]);
  const [currentViolations, setCurrentViolations] = useState<RegulatoryZone[]>([]);
  const [routeViolations, setRouteViolations] = useState<Array<{
    zone: RegulatoryZone;
    violatingPoints: Array<{ lat: number; lng: number }>;
  }>>([]);

  useEffect(() => {
    // Filter active zones
    const active = tamilNaduRegulatoryZones.filter(isZoneActive);
    setActiveZones(active);

    // Check current position violations
    const currentViols = active.filter(zone => 
      isPointInZone(currentPosition.lat, currentPosition.lng, zone)
    );
    setCurrentViolations(currentViols);

    // Check route violations
    if (plannedRoute.length > 0) {
      const routeViols: Array<{
        zone: RegulatoryZone;
        violatingPoints: Array<{ lat: number; lng: number }>;
      }> = [];

      for (const zone of active) {
        const violatingPoints = plannedRoute.filter(point => 
          isPointInZone(point.lat, point.lng, zone)
        );
        
        if (violatingPoints.length > 0) {
          routeViols.push({ zone, violatingPoints });
        }
      }
      setRouteViolations(routeViols);
    }
  }, [currentPosition, plannedRoute]);

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'prohibited': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
      case 'restricted': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
      case 'warning': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'marine_protected_area': return <Shield className="h-4 w-4" />;
      case 'seasonal_closure': return <Calendar className="h-4 w-4" />;
      case 'fishing_ban': return <Ban className="h-4 w-4" />;
      case 'naval_restricted': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'marine_protected_area': return 'Marine Protected Area';
      case 'seasonal_closure': return 'Seasonal Closure';
      case 'fishing_ban': return 'Fishing Ban';
      case 'coral_reserve': return 'Coral Reserve';
      case 'breeding_ground': return 'Breeding Ground';
      case 'naval_restricted': return 'Naval Restricted';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Position Violations */}
      {currentViolations.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-200">
            Current Location Alert!
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300">
            You are currently in {currentViolations.length} restricted zone{currentViolations.length > 1 ? 's' : ''}. 
            Immediate action required.
          </AlertDescription>
        </Alert>
      )}

      {/* Route Violations */}
      {routeViolations.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800 dark:text-orange-200">
            Route Violation Warning!
          </AlertTitle>
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            Your planned route passes through {routeViolations.length} restricted zone{routeViolations.length > 1 ? 's' : ''}. 
            Please modify your route to avoid these areas.
          </AlertDescription>
        </Alert>
      )}

      {/* Active Regulatory Zones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Active Regulatory Zones</span>
          </CardTitle>
          <CardDescription>
            {activeZones.length} active zones in Tamil Nadu waters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activeZones.map((zone) => {
              const isCurrentViolation = currentViolations.includes(zone);
              const routeViolation = routeViolations.find(v => v.zone.id === zone.id);
              
              return (
                <div 
                  key={zone.id} 
                  className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                    isCurrentViolation ? 'border-red-300 bg-red-50 dark:bg-red-950' :
                    routeViolation ? 'border-orange-300 bg-orange-50 dark:bg-orange-950' :
                    'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                  onClick={() => onZoneClick?.(zone)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(zone.type)}
                      <h3 className="font-semibold text-sm">{zone.name}</h3>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={getSeverityColor(zone.severity)} variant="outline">
                        {zone.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(zone.type)}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {zone.description}
                  </p>
                  
                  {/* Status Indicators */}
                  {isCurrentViolation && (
                    <div className="mb-2">
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        ⚠️ CURRENTLY IN THIS ZONE
                      </Badge>
                    </div>
                  )}
                  
                  {routeViolation && (
                    <div className="mb-2">
                      <Badge className="bg-orange-100 text-orange-800 text-xs">
                        🚫 ROUTE PASSES THROUGH ({routeViolation.violatingPoints.length} points)
                      </Badge>
                    </div>
                  )}

                  {/* Key Regulations */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Key Regulations:</span>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                        {zone.regulations.slice(0, 2).map((reg, idx) => (
                          <li key={idx}>• {reg}</li>
                        ))}
                        {zone.regulations.length > 2 && (
                          <li>• +{zone.regulations.length - 2} more regulations</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{zone.center.lat.toFixed(3)}, {zone.center.lng.toFixed(3)}</span>
                      </div>
                      
                      {zone.validUntil && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Until {zone.validUntil.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Authority:</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">{zone.authority}</span>
                      </div>
                      
                      <div className="text-xs mt-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Penalties:</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">{zone.penalties}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs mt-1">
                        <Phone className="h-3 w-3 text-blue-500" />
                        <span className="text-blue-600 dark:text-blue-400">{zone.contact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <Phone className="h-3 w-3 text-red-500" />
              <span className="font-medium">Coast Guard Emergency:</span>
              <span className="text-red-600">1554</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-3 w-3 text-blue-500" />
              <span className="font-medium">Marine Police:</span>
              <span className="text-blue-600">+91-44-25362401</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-3 w-3 text-green-500" />
              <span className="font-medium">Fisheries Department:</span>
              <span className="text-green-600">+91-44-28520751</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}