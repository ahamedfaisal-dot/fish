import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  Ban, 
  Calendar, 
  MapPin, 
  Phone, 
  Info,
  Search,
  Navigation,
  Anchor,
  Scale
} from 'lucide-react';
import { 
  tamilNaduRegulatoryZones, 
  isZoneActive, 
  isPointInZone, 
  checkRouteForViolations,
  RegulatoryZone 
} from '@/lib/regulatoryZones';
import { useLanguage } from '@/lib/LanguageContext';

export default function RegulatoryZones() {
  const { t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState<RegulatoryZone | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [currentPosition, setCurrentPosition] = useState({ lat: 13.0827, lng: 80.2707 });
  const [testRoute, setTestRoute] = useState<Array<{ lat: number; lng: number }>>([]);

  const activeZones = tamilNaduRegulatoryZones.filter(isZoneActive);
  
  const filteredZones = activeZones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || zone.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || zone.severity === filterSeverity;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const currentViolations = activeZones.filter(zone => 
    isPointInZone(currentPosition.lat, currentPosition.lng, zone)
  );

  const routeViolations = checkRouteForViolations(testRoute);

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
      case 'coral_reserve': return <Anchor className="h-4 w-4" />;
      case 'breeding_ground': return <Navigation className="h-4 w-4" />;
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

  const generateTestRoute = () => {
    // Create a test route that passes through some restricted zones
    const route = [
      { lat: 13.0827, lng: 80.2707 }, // Chennai
      { lat: 12.6167, lng: 80.1925 }, // Mamallapuram
      { lat: 11.485, lng: 79.780 },   // Pichavaram (Protected)
      { lat: 10.285, lng: 79.875 },   // Point Calimere (Protected)
      { lat: 9.100, lng: 79.175 },    // Gulf of Mannar (Prohibited)
      { lat: 8.035, lng: 77.500 }     // Kanyakumari Naval (Prohibited)
    ];
    setTestRoute(route);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Regulatory & No-Fishing Zones</h1>
          <p className="text-gray-600 dark:text-gray-400">Tamil Nadu marine protected areas and fishing restrictions</p>
        </div>
      </div>

      {/* Current Position Alerts */}
      {currentViolations.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-200">
            ⚠️ REGULATORY ZONE VIOLATION ALERT
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300">
            You are currently positioned in {currentViolations.length} restricted zone{currentViolations.length > 1 ? 's' : ''}:
            <ul className="mt-2 ml-4">
              {currentViolations.map(zone => (
                <li key={zone.id} className="font-medium">• {zone.name} ({zone.severity.toUpperCase()})</li>
              ))}
            </ul>
            Contact authorities immediately if this is unintentional.
          </AlertDescription>
        </Alert>
      )}

      {/* Route Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            <span>Route Compliance Checker</span>
          </CardTitle>
          <CardDescription>
            Test your planned route for regulatory zone violations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={generateTestRoute} className="w-full">
              Generate Test Route (Chennai to Kanyakumari)
            </Button>
            
            {testRoute.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Route Analysis:</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Testing route with {testRoute.length} waypoints
                </div>
                
                {routeViolations.length > 0 ? (
                  <div className="space-y-2">
                    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertTitle className="text-orange-800 dark:text-orange-200">
                        Route Violations Detected
                      </AlertTitle>
                      <AlertDescription className="text-orange-700 dark:text-orange-300">
                        Your route passes through {routeViolations.length} restricted zones:
                      </AlertDescription>
                    </Alert>
                    
                    {routeViolations.map(violation => (
                      <div key={violation.zone.id} className="p-3 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-950">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{violation.zone.name}</span>
                          <Badge className={getSeverityColor(violation.zone.severity)}>
                            {violation.zone.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {violation.violatingPoints.length} waypoint{violation.violatingPoints.length > 1 ? 's' : ''} in violation
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                    <Shield className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800 dark:text-green-200">
                      Route Clear
                    </AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      Your planned route does not violate any regulatory zones.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Zone Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Zone Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="marine_protected_area">Marine Protected Area</SelectItem>
                <SelectItem value="seasonal_closure">Seasonal Closure</SelectItem>
                <SelectItem value="fishing_ban">Fishing Ban</SelectItem>
                <SelectItem value="naval_restricted">Naval Restricted</SelectItem>
                <SelectItem value="coral_reserve">Coral Reserve</SelectItem>
                <SelectItem value="breeding_ground">Breeding Ground</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Severity Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="prohibited">Prohibited</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="zones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zones">All Zones ({filteredZones.length})</TabsTrigger>
          <TabsTrigger value="prohibited">Prohibited ({filteredZones.filter(z => z.severity === 'prohibited').length})</TabsTrigger>
          <TabsTrigger value="restricted">Restricted ({filteredZones.filter(z => z.severity === 'restricted').length})</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredZones.map((zone) => (
              <Card 
                key={zone.id} 
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedZone?.id === zone.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedZone(zone)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(zone.type)}
                      <CardTitle className="text-lg">{zone.name}</CardTitle>
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
                  <CardDescription>{zone.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Regulations */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Regulations:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {zone.regulations.map((reg, idx) => (
                          <li key={idx}>• {reg}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Location and Validity */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-blue-500" />
                        <span>{zone.center.lat.toFixed(3)}, {zone.center.lng.toFixed(3)}</span>
                      </div>
                      
                      {zone.validUntil && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-orange-500" />
                          <span>Until {zone.validUntil.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Authority and Penalties */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Authority:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{zone.authority}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium">Penalties:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{zone.penalties}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3 text-blue-500" />
                        <span className="text-blue-600 dark:text-blue-400">{zone.contact}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prohibited" className="space-y-4">
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
            <Ban className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800 dark:text-red-200">
              Absolutely Prohibited Zones
            </AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              Entry into these zones is completely forbidden. Violation may result in severe penalties including vessel seizure and legal prosecution.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredZones.filter(zone => zone.severity === 'prohibited').map((zone) => (
              <Card key={zone.id} className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800 dark:text-red-200 flex items-center space-x-2">
                    <Ban className="h-5 w-5" />
                    <span>{zone.name}</span>
                  </CardTitle>
                  <CardDescription>{zone.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      ⚠️ COMPLETE PROHIBITION - NO ENTRY ALLOWED
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Penalties: {zone.penalties}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restricted" className="space-y-4">
          <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
            <Shield className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">
              Restricted Access Zones
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              These zones allow limited fishing activities under specific conditions. Permits may be required.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredZones.filter(zone => zone.severity === 'restricted').map((zone) => (
              <Card key={zone.id} className="border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>{zone.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Permitted Activities:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400">
                      {zone.regulations.map((reg, idx) => (
                        <li key={idx}>• {reg}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-red-500" />
                <span>Emergency Contacts</span>
              </CardTitle>
              <CardDescription>
                Important contact numbers for maritime emergencies and violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-red-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-red-700">Emergency Services</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Coast Guard Emergency</span>
                        <span className="font-mono text-red-600">1554</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Marine Police</span>
                        <span className="font-mono text-red-600">+91-44-25362401</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Naval Emergency</span>
                        <span className="font-mono text-red-600">+91-484-2666822</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-700">Regulatory Authorities</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Fisheries Department</span>
                        <span className="font-mono text-blue-600">+91-44-28520751</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Forest Department</span>
                        <span className="font-mono text-blue-600">+91-4567-221234</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Chennai Port Authority</span>
                        <span className="font-mono text-blue-600">+91-44-25362000</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Important Notes</h4>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                          <li>• Always carry valid fishing licenses and permits</li>
                          <li>• Keep emergency contact numbers readily accessible</li>
                          <li>• Report any violations or emergencies immediately</li>
                          <li>• Maintain VHF radio contact in restricted areas</li>
                          <li>• Respect seasonal closures and breeding periods</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}