import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fish, Waves, Thermometer, Clock, MapPin, Calendar, Search } from 'lucide-react';

interface FishSpecies {
  name: string;
  tamilName: string;
  scientificName: string;
  category: 'pelagic' | 'demersal' | 'coastal' | 'estuarine';
  season: string[];
  habitat: string;
  depth: string;
  size: string;
  bait: string[];
  techniques: string[];
  locations: string[];
  description: string;
  conservation: 'abundant' | 'moderate' | 'limited' | 'protected';
}

const tamilNaduFishes: FishSpecies[] = [
  {
    name: 'Seer Fish',
    tamilName: 'Vanjaram',
    scientificName: 'Scomberomorus commerson',
    category: 'pelagic',
    season: ['October', 'November', 'December', 'January', 'February'],
    habitat: 'Open ocean, near surface',
    depth: '10-100 meters',
    size: '30-150 cm, 3-40 kg',
    bait: ['Sardines', 'Mackerel', 'Squid', 'Live fish'],
    techniques: ['Trolling', 'Drift fishing', 'Live bait fishing'],
    locations: ['Chennai Deep Waters', 'Rameswaram', 'Tuticorin'],
    description: 'Large predatory fish highly prized in Tamil Nadu. Known for its fighting ability and excellent taste.',
    conservation: 'moderate'
  },
  {
    name: 'Red Snapper',
    tamilName: 'Sankara Meen',
    scientificName: 'Lutjanus argentimaculatus',
    category: 'demersal',
    season: ['November', 'December', 'January', 'February', 'March'],
    habitat: 'Rocky reefs, coral areas',
    depth: '20-150 meters',
    size: '25-80 cm, 1-8 kg',
    bait: ['Prawns', 'Small fish', 'Squid', 'Crab'],
    techniques: ['Bottom fishing', 'Reef fishing', 'Jigging'],
    locations: ['Mamallapuram Reefs', 'Rameshwaram Banks', 'Kanyakumari'],
    description: 'Prized table fish found around rocky reefs. Excellent for both commercial and sport fishing.',
    conservation: 'moderate'
  },
  {
    name: 'Pearl Spot',
    tamilName: 'Karimeen',
    scientificName: 'Etroplus suratensis',
    category: 'estuarine',
    season: ['June', 'July', 'August', 'September', 'October'],
    habitat: 'Backwaters, estuaries, lagoons',
    depth: '1-10 meters',
    size: '15-25 cm, 200-500 grams',
    bait: ['Rice', 'Bread', 'Small prawns', 'Worms'],
    techniques: ['Float fishing', 'Bottom fishing', 'Cast net'],
    locations: ['Pulicat Lake', 'Pichavaram', 'Muthupet'],
    description: 'Endemic to South India backwaters. Considered a delicacy in Tamil Nadu cuisine.',
    conservation: 'abundant'
  },
  {
    name: 'Pomfret',
    tamilName: 'Vavval',
    scientificName: 'Pampus argenteus',
    category: 'pelagic',
    season: ['September', 'October', 'November', 'December'],
    habitat: 'Continental shelf waters',
    depth: '30-80 meters',
    size: '20-40 cm, 500-2000 grams',
    bait: ['Small fish', 'Squid', 'Prawns'],
    techniques: ['Trawling', 'Gill netting', 'Hook and line'],
    locations: ['Chennai Coast', 'Cuddalore', 'Nagapattinam'],
    description: 'High-value commercial fish with excellent taste. Important for both export and domestic markets.',
    conservation: 'moderate'
  },
  {
    name: 'Tuna',
    tamilName: 'Choora',
    scientificName: 'Thunnus albacares',
    category: 'pelagic',
    season: ['November', 'December', 'January', 'February'],
    habitat: 'Deep oceanic waters',
    depth: '50-300 meters',
    size: '50-200 cm, 5-100 kg',
    bait: ['Live sardines', 'Mackerel', 'Squid', 'Artificial lures'],
    techniques: ['Deep sea trolling', 'Long line fishing', 'Pole and line'],
    locations: ['Chennai Deep Sea', 'Rameswaram Deep Waters'],
    description: 'Large oceanic predator. Highly valued for sashimi and export markets.',
    conservation: 'limited'
  },
  {
    name: 'Mackerel',
    tamilName: 'Ayala',
    scientificName: 'Rastrelliger kanagurta',
    category: 'pelagic',
    season: ['August', 'September', 'October', 'November'],
    habitat: 'Coastal and offshore waters',
    depth: '5-50 meters',
    size: '15-25 cm, 100-300 grams',
    bait: ['Small pieces of fish', 'Artificial lures'],
    techniques: ['Purse seining', 'Ring netting', 'Hook and line'],
    locations: ['All Tamil Nadu Coast'],
    description: 'Important commercial fish species. Forms large schools during monsoon season.',
    conservation: 'abundant'
  },
  {
    name: 'Sardine',
    tamilName: 'Mathi',
    scientificName: 'Sardinella longiceps',
    category: 'pelagic',
    season: ['June', 'July', 'August', 'September'],
    habitat: 'Coastal waters, surface',
    depth: '0-30 meters',
    size: '10-20 cm, 50-150 grams',
    bait: ['Plankton', 'Small bait fish'],
    techniques: ['Purse seining', 'Ring netting', 'Shore seining'],
    locations: ['Tuticorin', 'Kanyakumari', 'Chennai'],
    description: 'Important commercial species and bait fish. Forms massive schools.',
    conservation: 'abundant'
  },
  {
    name: 'Flying Fish',
    tamilName: 'Parakum Meen',
    scientificName: 'Exocoetus volitans',
    category: 'pelagic',
    season: ['April', 'May', 'June', 'July'],
    habitat: 'Surface waters, open ocean',
    depth: '0-20 meters',
    size: '15-30 cm, 200-500 grams',
    bait: ['Small artificial lures', 'Surface baits'],
    techniques: ['Surface trolling', 'Night fishing', 'Gill netting'],
    locations: ['Kanyakumari', 'Rameswaram', 'Deep waters'],
    description: 'Unique fish that can glide above water. Popular in coastal Tamil Nadu cuisine.',
    conservation: 'abundant'
  }
];

export default function SpeciesGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });

  const filteredFishes = tamilNaduFishes.filter(fish => {
    const matchesSearch = fish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fish.tamilName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fish.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || fish.category === selectedCategory;
    const matchesSeason = selectedSeason === 'all' || fish.season.includes(selectedSeason);
    
    return matchesSearch && matchesCategory && matchesSeason;
  });

  const getConservationColor = (status: string): string => {
    switch (status) {
      case 'abundant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'limited': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'protected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'pelagic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'demersal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'coastal': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'estuarine': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const seasonalFishes = tamilNaduFishes.filter(fish => fish.season.includes(currentMonth));

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Species Guide</h1>
          <p className="text-gray-600 dark:text-gray-400">Tamil Nadu marine fish species reference</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Fish Species</CardTitle>
          <CardDescription>Search by name or filter by category and season</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search fish species..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pelagic">Pelagic (Open water)</SelectItem>
                <SelectItem value="demersal">Demersal (Bottom dwelling)</SelectItem>
                <SelectItem value="coastal">Coastal</SelectItem>
                <SelectItem value="estuarine">Estuarine (Backwater)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger>
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                {['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Species ({filteredFishes.length})</TabsTrigger>
          <TabsTrigger value="seasonal">In Season ({seasonalFishes.length})</TabsTrigger>
          <TabsTrigger value="techniques">Fishing Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFishes.map((fish) => (
              <Card key={fish.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Fish className="h-5 w-5 text-blue-500" />
                        <span>{fish.name}</span>
                      </CardTitle>
                      <CardDescription>
                        <span className="font-medium">{fish.tamilName}</span> • <em>{fish.scientificName}</em>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={getCategoryColor(fish.category)} variant="outline">
                        {fish.category}
                      </Badge>
                      <Badge className={getConservationColor(fish.conservation)} variant="outline">
                        {fish.conservation}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{fish.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Season:</span>
                      <span>{fish.season.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Waves className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Depth:</span>
                      <span>{fish.depth}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Fish className="h-4 w-4 text-teal-500" />
                      <span className="font-medium">Size:</span>
                      <span>{fish.size}</span>
                    </div>
                    
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Locations:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {fish.locations.map(location => (
                            <Badge key={location} variant="outline" className="text-xs">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Bait:</span>
                      <span>{fish.bait.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-start space-x-2 text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Techniques:</span>
                      <span>{fish.techniques.join(', ')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <span>Fish in Season - {currentMonth}</span>
              </CardTitle>
              <CardDescription>
                Species that are currently in their peak season for Tamil Nadu waters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seasonalFishes.map((fish) => (
                  <div key={fish.name} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{fish.name}</h3>
                      <Badge className={getCategoryColor(fish.category)} variant="outline">
                        {fish.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{fish.tamilName}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{fish.depth}</span>
                      <span>{fish.size}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-medium">Best bait: </span>
                      <span className="text-xs">{fish.bait.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="techniques" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Trolling', 'Bottom Fishing', 'Reef Fishing', 'Shore Fishing', 'Deep Sea Fishing', 'Backwater Fishing'].map((technique) => {
              const relevantFish = tamilNaduFishes.filter(fish => 
                fish.techniques.some(t => t.toLowerCase().includes(technique.toLowerCase().split(' ')[0]))
              );
              
              return (
                <Card key={technique}>
                  <CardHeader>
                    <CardTitle className="text-lg">{technique}</CardTitle>
                    <CardDescription>{relevantFish.length} species</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {relevantFish.slice(0, 4).map((fish) => (
                        <div key={fish.name} className="flex items-center justify-between text-sm">
                          <span>{fish.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {fish.season.includes(currentMonth) ? 'In Season' : 'Off Season'}
                          </Badge>
                        </div>
                      ))}
                      {relevantFish.length > 4 && (
                        <p className="text-xs text-gray-500">+{relevantFish.length - 4} more species</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}