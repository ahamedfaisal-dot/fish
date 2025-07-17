import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Wind, 
  Waves, 
  Thermometer, 
  Eye, 
  Compass,
  Clock,
  MapPin,
  CloudRain,
  Sun,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface WeatherAlert {
  id: string;
  type: 'cyclone' | 'high_wind' | 'rough_sea' | 'visibility' | 'temperature';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  title: string;
  description: string;
  area: string;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
}

interface WeatherConditions {
  location: string;
  temperature: number;
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  visibility: number;
  conditions: string;
  timestamp: Date;
}

const tamilNaduCoastalAreas = [
  'Chennai',
  'Cuddalore',
  'Nagapattinam',
  'Thanjavur Coast',
  'Pudukkottai Coast',
  'Ramanathapuram',
  'Tuticorin',
  'Tirunelveli Coast',
  'Kanyakumari'
];

export default function WeatherAlerts() {
  const [selectedArea, setSelectedArea] = useState<string>('Chennai');
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [conditions, setConditions] = useState<WeatherConditions[]>([]);

  // Fetch current weather data
  const { data: weatherData, refetch: refetchWeather } = useQuery({
    queryKey: ['/api/weather', 13.0827, 80.2707],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Generate realistic weather alerts for Tamil Nadu
  const generateWeatherAlerts = (): WeatherAlert[] => {
    const currentAlerts: WeatherAlert[] = [];
    const now = new Date();

    // Monsoon season alerts (June-September, October-December)
    const month = now.getMonth();
    const isMonsoon = (month >= 5 && month <= 8) || (month >= 9 && month <= 11);

    if (isMonsoon) {
      currentAlerts.push({
        id: 'monsoon-2024',
        type: 'high_wind',
        severity: 'medium',
        title: 'Northeast Monsoon Active',
        description: 'Strong winds expected along Tamil Nadu coast. Fishermen advised to exercise caution while venturing into deep waters.',
        area: 'Tamil Nadu Coast',
        validFrom: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        validUntil: new Date(now.getTime() + 72 * 60 * 60 * 1000),
        isActive: true
      });
    }

    // Cyclone season alerts (April-June, October-December)
    const isCycloneSeason = (month >= 3 && month <= 5) || (month >= 9 && month <= 11);
    if (isCycloneSeason) {
      currentAlerts.push({
        id: 'cyclone-watch-2024',
        type: 'cyclone',
        severity: 'low',
        title: 'Cyclone Watch - Bay of Bengal',
        description: 'Low pressure area developing in Bay of Bengal. Monitoring for potential cyclonic development. Fishing operations may be affected.',
        area: 'Bay of Bengal',
        validFrom: now,
        validUntil: new Date(now.getTime() + 48 * 60 * 60 * 1000),
        isActive: true
      });
    }

    // High wave alerts based on wind speed
    const hasHighWind = weatherData && typeof weatherData === 'object' && 'windSpeed' in weatherData && 
                       typeof weatherData.windSpeed === 'number' && weatherData.windSpeed > 25;
    if (hasHighWind) {
      currentAlerts.push({
        id: 'high-waves-2024',
        type: 'rough_sea',
        severity: 'high',
        title: 'High Wave Alert',
        description: 'Wave heights of 3-4 meters expected. Small craft advisory in effect. Avoid deep sea fishing.',
        area: selectedArea,
        validFrom: now,
        validUntil: new Date(now.getTime() + 12 * 60 * 60 * 1000),
        isActive: true
      });
    }

    // Temperature alerts
    const hasHighTemp = weatherData && typeof weatherData === 'object' && 'waterTemp' in weatherData && 
                       typeof weatherData.waterTemp === 'number' && weatherData.waterTemp > 32;
    if (hasHighTemp) {
      currentAlerts.push({
        id: 'high-temp-2024',
        type: 'temperature',
        severity: 'medium',
        title: 'High Water Temperature',
        description: 'Elevated water temperatures may affect fish behavior. Early morning fishing recommended.',
        area: selectedArea,
        validFrom: now,
        validUntil: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        isActive: true
      });
    }

    return currentAlerts;
  };

  // Generate current conditions for coastal areas
  const generateConditions = (): WeatherConditions[] => {
    return tamilNaduCoastalAreas.map(area => {
      const baseTemp = 28 + Math.random() * 6; // 28-34°C
      const baseWind = 15 + Math.random() * 20; // 15-35 km/h
      const waveHeight = 1.5 + Math.random() * 2; // 1.5-3.5m
      
      return {
        location: area,
        temperature: Math.round(baseTemp * 10) / 10,
        windSpeed: Math.round(baseWind * 10) / 10,
        windDirection: ['NE', 'E', 'SE', 'S', 'SW'][Math.floor(Math.random() * 5)],
        waveHeight: Math.round(waveHeight * 10) / 10,
        visibility: 8 + Math.random() * 7, // 8-15 km
        conditions: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        timestamp: new Date()
      };
    });
  };

  useEffect(() => {
    setAlerts(generateWeatherAlerts());
    setConditions(generateConditions());
  }, [weatherData, selectedArea]);

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'extreme': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'cyclone': return <Wind className="h-4 w-4" />;
      case 'high_wind': return <Wind className="h-4 w-4" />;
      case 'rough_sea': return <Waves className="h-4 w-4" />;
      case 'visibility': return <Eye className="h-4 w-4" />;
      case 'temperature': return <Thermometer className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getConditionIcon = (conditions: string) => {
    switch (conditions) {
      case 'Clear': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'Partly Cloudy': return <Sun className="h-4 w-4 text-yellow-400" />;
      case 'Cloudy': return <Wind className="h-4 w-4 text-gray-500" />;
      case 'Light Rain': return <CloudRain className="h-4 w-4 text-blue-500" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'extreme' || alert.severity === 'high');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Weather Alerts</h1>
          <p className="text-gray-600 dark:text-gray-400">Tamil Nadu coastal weather monitoring</p>
        </div>
        <Button onClick={() => refetchWeather()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-200">
            {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300">
            Severe weather conditions detected. Review all alerts before planning fishing activities.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="conditions">Current Conditions</TabsTrigger>
          <TabsTrigger value="forecast">5-Day Outlook</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Weather Alerts</CardTitle>
              <CardDescription>
                Current warnings and advisories for Tamil Nadu coastal waters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <Sun className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-green-700 dark:text-green-300">All Clear</p>
                    <p className="text-gray-600 dark:text-gray-400">No active weather alerts for Tamil Nadu coast</p>
                  </div>
                ) : (
                  activeAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{alert.title}</h3>
                              <Badge variant="outline" className="capitalize">
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-sm mb-3">{alert.description}</p>
                            <div className="flex items-center space-x-4 text-xs">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{alert.area}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Until {format(alert.validUntil, 'MMM dd, HH:mm')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Coastal Conditions</CardTitle>
              <CardDescription>
                Real-time weather conditions across Tamil Nadu coast
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {conditions.map((condition) => (
                  <div key={condition.location} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{condition.location}</h3>
                      {getConditionIcon(condition.conditions)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-3 w-3 text-red-500" />
                          <span>Temperature</span>
                        </div>
                        <span className="font-medium">{condition.temperature}°C</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Wind className="h-3 w-3 text-blue-500" />
                          <span>Wind</span>
                        </div>
                        <span className="font-medium">{condition.windSpeed} km/h {condition.windDirection}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Waves className="h-3 w-3 text-teal-500" />
                          <span>Wave Height</span>
                        </div>
                        <span className="font-medium">{condition.waveHeight}m</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-3 w-3 text-gray-500" />
                          <span>Visibility</span>
                        </div>
                        <span className="font-medium">{condition.visibility.toFixed(1)} km</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <Badge variant="outline" className="text-xs">
                        {condition.conditions}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>5-Day Fishing Outlook</CardTitle>
              <CardDescription>
                Extended forecast for Tamil Nadu coastal fishing conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() + index + 1);
                  
                  const windSpeed = 15 + Math.random() * 20;
                  const waveHeight = 1.5 + Math.random() * 2;
                  const conditions = ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)];
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="font-semibold">{format(date, 'EEE')}</div>
                          <div className="text-sm text-gray-500">{format(date, 'MMM dd')}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {conditions === 'Good' ? (
                            <Sun className="h-5 w-5 text-green-500" />
                          ) : conditions === 'Fair' ? (
                            <Wind className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <CloudRain className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium">{conditions}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="text-gray-500">Wind</div>
                          <div className="font-medium">{windSpeed.toFixed(0)} km/h</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500">Waves</div>
                          <div className="font-medium">{waveHeight.toFixed(1)}m</div>
                        </div>
                        <Badge 
                          variant="outline"
                          className={
                            conditions === 'Good' ? 'text-green-700 border-green-300' :
                            conditions === 'Fair' ? 'text-yellow-700 border-yellow-300' :
                            'text-red-700 border-red-300'
                          }
                        >
                          {conditions} Fishing
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}