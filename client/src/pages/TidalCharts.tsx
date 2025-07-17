import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Waves, TrendingUp, TrendingDown, Clock, MapPin, Info } from 'lucide-react';
import { format, addHours, startOfDay } from 'date-fns';

interface TideData {
  time: Date;
  height: number;
  type: 'high' | 'low';
}

interface TidalLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

const tamilNaduTidalLocations: TidalLocation[] = [
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, description: 'Major port city, good for deep sea fishing' },
  { name: 'Pondicherry', lat: 11.9416, lng: 79.8083, description: 'French colonial coast, diverse marine life' },
  { name: 'Rameswaram', lat: 9.2876, lng: 79.3129, description: 'Sacred island, excellent fishing grounds' },
  { name: 'Tuticorin', lat: 8.8047, lng: 78.1348, description: 'Pearl diving heritage, rich coastal waters' },
  { name: 'Kanyakumari', lat: 8.0883, lng: 77.5385, description: 'Southern tip, confluence of three seas' },
  { name: 'Nagapattinam', lat: 10.7672, lng: 79.8420, description: 'Ancient port, traditional fishing community' },
  { name: 'Cuddalore', lat: 11.7449, lng: 79.7718, description: 'Industrial coast, good for shore fishing' },
  { name: 'Mamallapuram', lat: 12.6167, lng: 80.1925, description: 'UNESCO heritage site, rocky shores' }
];

export default function TidalCharts() {
  const [selectedLocation, setSelectedLocation] = useState<string>('Chennai');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tideData, setTideData] = useState<TideData[]>([]);

  // Generate realistic tidal data for Tamil Nadu (Bay of Bengal)
  const generateTideData = (location: string, date: Date): TideData[] => {
    const tides: TideData[] = [];
    const startOfDayTime = startOfDay(date);
    
    // Bay of Bengal has semi-diurnal tides (2 high, 2 low per day)
    // High tides approximately 12 hours 25 minutes apart
    const baseHighTide1 = 6.5; // 6:30 AM
    const baseHighTide2 = 19.0; // 7:00 PM
    const baseLowTide1 = 0.5; // 12:30 AM
    const baseLowTide2 = 12.8; // 12:48 PM

    // Location-specific adjustments
    let heightMultiplier = 1.0;
    let timeOffset = 0;
    
    switch (location) {
      case 'Chennai':
        heightMultiplier = 1.2;
        timeOffset = 0;
        break;
      case 'Pondicherry':
        heightMultiplier = 1.1;
        timeOffset = 0.3;
        break;
      case 'Rameswaram':
        heightMultiplier = 0.9;
        timeOffset = 0.8;
        break;
      case 'Tuticorin':
        heightMultiplier = 0.8;
        timeOffset = 1.2;
        break;
      case 'Kanyakumari':
        heightMultiplier = 1.3;
        timeOffset = 1.5;
        break;
      case 'Nagapattinam':
        heightMultiplier = 1.0;
        timeOffset = 0.5;
        break;
      case 'Cuddalore':
        heightMultiplier = 1.1;
        timeOffset = 0.2;
        break;
      case 'Mamallapuram':
        heightMultiplier = 1.2;
        timeOffset = -0.2;
        break;
    }

    // Generate tides for the day
    const tideSchedule = [
      { hour: baseLowTide1 + timeOffset, type: 'low' as const, baseHeight: 0.3 },
      { hour: baseHighTide1 + timeOffset, type: 'high' as const, baseHeight: 1.4 },
      { hour: baseLowTide2 + timeOffset, type: 'low' as const, baseHeight: 0.2 },
      { hour: baseHighTide2 + timeOffset, type: 'high' as const, baseHeight: 1.6 }
    ];

    tideSchedule.forEach(({ hour, type, baseHeight }) => {
      const tideTime = addHours(startOfDayTime, hour);
      const height = baseHeight * heightMultiplier;
      
      tides.push({
        time: tideTime,
        height: Math.round(height * 10) / 10,
        type
      });
    });

    return tides.sort((a, b) => a.time.getTime() - b.time.getTime());
  };

  useEffect(() => {
    const data = generateTideData(selectedLocation, selectedDate);
    setTideData(data);
  }, [selectedLocation, selectedDate]);

  const currentLocation = tamilNaduTidalLocations.find(loc => loc.name === selectedLocation);
  const currentTime = new Date();
  const nextTide = tideData.find(tide => tide.time > currentTime);
  const currentTideHeight = getCurrentTideHeight();

  function getCurrentTideHeight(): number {
    if (tideData.length < 2) return 0.8;
    
    const now = currentTime.getTime();
    const beforeTide = tideData.filter(tide => tide.time.getTime() <= now).pop();
    const afterTide = tideData.find(tide => tide.time.getTime() > now);
    
    if (!beforeTide || !afterTide) return 0.8;
    
    const timeDiff = afterTide.time.getTime() - beforeTide.time.getTime();
    const timeProgress = (now - beforeTide.time.getTime()) / timeDiff;
    const heightDiff = afterTide.height - beforeTide.height;
    
    return Math.round((beforeTide.height + (heightDiff * timeProgress)) * 10) / 10;
  }

  const getFishingCondition = (tide: TideData, index: number): string => {
    const nextTide = tideData[index + 1];
    if (!nextTide) return 'Good';
    
    const timeDiff = (nextTide.time.getTime() - tide.time.getTime()) / (1000 * 60 * 60);
    
    if (tide.type === 'high' && timeDiff > 2) return 'Excellent';
    if (tide.type === 'low' && timeDiff > 2) return 'Good';
    return 'Fair';
  };

  const getConditionColor = (condition: string): string => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tidal Charts</h1>
          <p className="text-gray-600 dark:text-gray-400">Tamil Nadu coastal tide predictions</p>
        </div>
      </div>

      {/* Location and Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Location</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose fishing location" />
              </SelectTrigger>
              <SelectContent>
                {tamilNaduTidalLocations.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentLocation && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {currentLocation.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Tide Height</span>
                <div className="flex items-center space-x-2">
                  <Waves className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold">{currentTideHeight}m</span>
                </div>
              </div>
              {nextTide && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Next Tide</span>
                  <div className="flex items-center space-x-2">
                    {nextTide.type === 'high' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-semibold">
                      {nextTide.type === 'high' ? 'High' : 'Low'} at {format(nextTide.time, 'HH:mm')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tide Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Tide Schedule</CardTitle>
          <CardDescription>
            Tide times and fishing conditions for {selectedLocation} - {format(selectedDate, 'MMMM dd, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tideData.map((tide, index) => {
              const condition = getFishingCondition(tide, index);
              const isPast = tide.time < currentTime;
              
              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isPast ? 'opacity-60' : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {tide.type === 'high' ? (
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold capitalize">{tide.type} Tide</h3>
                        <Badge className={getConditionColor(condition)}>
                          {condition} Fishing
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(tide.time, 'HH:mm')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Waves className="h-3 w-3" />
                          <span>{tide.height}m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!isPast && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {Math.round((tide.time.getTime() - currentTime.getTime()) / (1000 * 60))} min
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fishing Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Fishing Tips for Tamil Nadu Waters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Best Fishing Times</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• 2 hours before high tide</li>
                <li>• 1 hour after high tide</li>
                <li>• Early morning (5-8 AM)</li>
                <li>• Late evening (6-9 PM)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Species by Tide</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• High tide: Seer Fish, Tuna, Sailfish</li>
                <li>• Low tide: Red Snapper, Grouper</li>
                <li>• Rising tide: Pomfret, Mackerel</li>
                <li>• Falling tide: Pearl Spot, Mullet</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}