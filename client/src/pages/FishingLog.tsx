import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Fish, MapPin, Trophy, TrendingUp, Clock } from 'lucide-react';
import { CatchReport } from '@shared/schema';
import { format } from 'date-fns';
import { useLanguage } from '@/lib/LanguageContext';
import { fishSpeciesTranslations } from '@/lib/translations';

export default function FishingLog() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { t, language } = useLanguage();

  const { data: catchReports = [], isLoading } = useQuery<CatchReport[]>({
    queryKey: ['/api/catch-reports'],
  });

  // Calculate statistics
  const totalCatches = catchReports.length;
  const totalWeight = catchReports.reduce((sum, report) => sum + (report.weight || 0), 0);
  const uniqueSpecies = new Set(catchReports.map(report => report.species)).size;
  const topSpecies = Object.entries(
    catchReports.reduce((acc, report) => {
      acc[report.species] = (acc[report.species] || 0) + report.quantity;
      return acc;
    }, {} as Record<string, number>)
  ).sort(([,a], [,b]) => b - a).slice(0, 5);

  // Recent catches (last 10)
  const recentCatches = catchReports
    .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('log.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('log.subtitle')}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('log.totalCatches')}</CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCatches}</div>
            <p className="text-xs text-muted-foreground">{t('common.allTime')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('log.totalWeight')}</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">{t('common.combinedWeight')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('log.speciesCaught')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSpecies}</div>
            <p className="text-xs text-muted-foreground">{t('common.differentSpecies')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('log.bestDay')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...catchReports.map(r => r.quantity)) || 0}
            </div>
            <p className="text-xs text-muted-foreground">{t('common.fishInOneTrip')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">{t('log.recentCatches')}</TabsTrigger>
          <TabsTrigger value="species">{t('log.speciesAnalysis')}</TabsTrigger>
          <TabsTrigger value="locations">{t('log.fishingSpots')}</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Fishing Trips</CardTitle>
              <CardDescription>Your latest catches in Tamil Nadu waters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCatches.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No catches recorded yet. Start fishing and log your catches!
                  </p>
                ) : (
                  recentCatches.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Fish className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{report.species}</h3>
                            <Badge variant="secondary">{report.quantity} fish</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{format(new Date(report.timestamp || Date.now()), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{report.weight ? `${report.weight} kg` : 'N/A'}</div>
                        <div className="text-sm text-gray-500">{report.length ? `${report.length} cm` : ''}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="species" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Species</CardTitle>
              <CardDescription>Most frequently caught fish in Tamil Nadu waters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSpecies.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No species data available</p>
                ) : (
                  topSpecies.map(([species, count], index) => (
                    <div key={species} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-700 dark:text-blue-300">#{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{species}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{count} fish caught</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(count / topSpecies[0][1]) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fishing Locations</CardTitle>
              <CardDescription>Your most productive fishing spots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {catchReports.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No location data available</p>
                ) : (
                  (() => {
                    const locationData = catchReports.reduce((acc, report) => {
                      const key = `${report.latitude.toFixed(2)},${report.longitude.toFixed(2)}`;
                      if (!acc[key]) {
                        acc[key] = { lat: report.latitude, lng: report.longitude, count: 0, species: new Set<string>() };
                      }
                      acc[key].count += report.quantity;
                      acc[key].species.add(report.species);
                      return acc;
                    }, {} as Record<string, { lat: number; lng: number; count: number; species: Set<string> }>);

                    return Object.entries(locationData)
                      .sort(([,a], [,b]) => b.count - a.count)
                      .slice(0, 8)
                      .map(([key, data]) => (
                        <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <span className="font-semibold">
                                {data.lat.toFixed(4)}, {data.lng.toFixed(4)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {data.species.size} species: {Array.from(data.species).slice(0, 3).join(', ')}
                              {data.species.size > 3 && ` +${data.species.size - 3} more`}
                            </p>
                          </div>
                          <Badge variant="outline">{data.count} fish</Badge>
                        </div>
                      ));
                  })()
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}