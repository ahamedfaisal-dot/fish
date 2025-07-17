export interface RegulatoryZone {
  id: string;
  name: string;
  type: 'marine_protected_area' | 'seasonal_closure' | 'fishing_ban' | 'coral_reserve' | 'breeding_ground' | 'naval_restricted';
  severity: 'warning' | 'restricted' | 'prohibited';
  coordinates: Array<{ lat: number; lng: number }>;
  center: { lat: number; lng: number };
  radius: number; // in meters
  description: string;
  regulations: string[];
  validFrom?: Date;
  validUntil?: Date;
  isActive: boolean;
  authority: string;
  penalties: string;
  contact: string;
}

// Tamil Nadu Marine Protected Areas and Restricted Zones
export const tamilNaduRegulatoryZones: RegulatoryZone[] = [
  {
    id: 'gulf-of-mannar-mpa',
    name: 'Gulf of Mannar Marine National Park',
    type: 'marine_protected_area',
    severity: 'prohibited',
    coordinates: [
      { lat: 9.105, lng: 79.085 },
      { lat: 9.105, lng: 79.300 },
      { lat: 8.850, lng: 79.300 },
      { lat: 8.850, lng: 79.085 }
    ],
    center: { lat: 8.9775, lng: 79.1925 },
    radius: 25000,
    description: 'India\'s first Marine National Park with 21 islands and coral reefs',
    regulations: [
      'Complete fishing prohibition',
      'No anchoring near coral reefs',
      'Tourist boats require special permits',
      'No collection of marine specimens'
    ],
    isActive: true,
    authority: 'Tamil Nadu Forest Department',
    penalties: 'Fine up to ₹25,000 and/or imprisonment up to 3 years',
    contact: 'Ramanathapuram Forest Division: +91-4567-221234'
  },
  {
    id: 'point-calimere-sanctuary',
    name: 'Point Calimere Wildlife Sanctuary',
    type: 'marine_protected_area',
    severity: 'restricted',
    coordinates: [
      { lat: 10.300, lng: 79.850 },
      { lat: 10.300, lng: 79.900 },
      { lat: 10.270, lng: 79.900 },
      { lat: 10.270, lng: 79.850 }
    ],
    center: { lat: 10.285, lng: 79.875 },
    radius: 8000,
    description: 'Critical habitat for migratory birds and marine life',
    regulations: [
      'Fishing allowed only with permits',
      'No mechanized boats during bird migration (Oct-Feb)',
      'Speed limits enforced near shore',
      'No night fishing during breeding season'
    ],
    isActive: true,
    authority: 'Tamil Nadu Wildlife Department',
    penalties: 'Fine up to ₹10,000 and vessel confiscation',
    contact: 'Thanjavur Wildlife Office: +91-4362-230567'
  },
  {
    id: 'pichavaram-mangroves',
    name: 'Pichavaram Mangrove Reserve',
    type: 'marine_protected_area',
    severity: 'restricted',
    coordinates: [
      { lat: 11.500, lng: 79.760 },
      { lat: 11.500, lng: 79.800 },
      { lat: 11.470, lng: 79.800 },
      { lat: 11.470, lng: 79.760 }
    ],
    center: { lat: 11.485, lng: 79.780 },
    radius: 5000,
    description: 'Protected mangrove ecosystem and nursery grounds',
    regulations: [
      'Traditional fishing allowed in designated areas',
      'No trawling within 2km of mangroves',
      'Crab fishing regulated during monsoon',
      'Tourist boat operations require permits'
    ],
    isActive: true,
    authority: 'Tamil Nadu Forest Department',
    penalties: 'Fine up to ₹15,000 and fishing license suspension',
    contact: 'Cuddalore Forest Range: +91-4142-233445'
  },
  {
    id: 'pulicat-lake-sanctuary',
    name: 'Pulicat Lake Bird Sanctuary',
    type: 'marine_protected_area',
    severity: 'restricted',
    coordinates: [
      { lat: 13.650, lng: 80.180 },
      { lat: 13.650, lng: 80.220 },
      { lat: 13.580, lng: 80.220 },
      { lat: 13.580, lng: 80.180 }
    ],
    center: { lat: 13.615, lng: 80.200 },
    radius: 12000,
    description: 'Largest brackish water lagoon and flamingo habitat',
    regulations: [
      'Fishing permitted in non-core areas only',
      'No mechanized boats Oct-Mar (bird season)',
      'Traditional nets and coracles preferred',
      'Flamingo nesting areas completely protected'
    ],
    isActive: true,
    authority: 'Tamil Nadu Wildlife Department',
    penalties: 'Fine up to ₹8,000 and equipment confiscation',
    contact: 'Tiruvallur Wildlife Office: +91-44-27664523'
  },
  {
    id: 'monsoon-trawling-ban',
    name: 'Tamil Nadu Monsoon Trawling Ban',
    type: 'seasonal_closure',
    severity: 'prohibited',
    coordinates: [
      { lat: 13.500, lng: 80.000 },
      { lat: 13.500, lng: 80.500 },
      { lat: 8.000, lng: 80.500 },
      { lat: 8.000, lng: 80.000 }
    ],
    center: { lat: 10.750, lng: 80.250 },
    radius: 50000,
    description: 'Annual monsoon fishing ban for marine conservation',
    regulations: [
      'No mechanized fishing vessels allowed',
      'Traditional fishermen with country boats exempt',
      'Complete ban on bottom trawling',
      'Deep sea fishing beyond 12 nautical miles allowed'
    ],
    validFrom: new Date('2024-06-15'),
    validUntil: new Date('2024-07-31'),
    isActive: false, // Seasonal - check dates
    authority: 'Tamil Nadu Fisheries Department',
    penalties: 'Fine up to ₹50,000 and vessel seizure for 30 days',
    contact: 'Chennai Fisheries Office: +91-44-28520751'
  },
  {
    id: 'kanyakumari-naval-area',
    name: 'Kanyakumari Naval Restricted Zone',
    type: 'naval_restricted',
    severity: 'prohibited',
    coordinates: [
      { lat: 8.050, lng: 77.480 },
      { lat: 8.050, lng: 77.520 },
      { lat: 8.020, lng: 77.520 },
      { lat: 8.020, lng: 77.480 }
    ],
    center: { lat: 8.035, lng: 77.500 },
    radius: 3000,
    description: 'Naval security zone near southern tip of India',
    regulations: [
      'Absolutely no civilian vessels allowed',
      'Military patrol area',
      'Emergency rescue coordination zone',
      'Radio communication mandatory for nearby vessels'
    ],
    isActive: true,
    authority: 'Indian Navy Southern Command',
    penalties: 'Immediate detention and legal prosecution under Official Secrets Act',
    contact: 'Naval Base Kochi: +91-484-2666822'
  },
  {
    id: 'coral-breeding-season',
    name: 'Coral Spawning Protection Zone',
    type: 'breeding_ground',
    severity: 'restricted',
    coordinates: [
      { lat: 9.200, lng: 79.100 },
      { lat: 9.200, lng: 79.250 },
      { lat: 9.000, lng: 79.250 },
      { lat: 9.000, lng: 79.100 }
    ],
    center: { lat: 9.100, lng: 79.175 },
    radius: 15000,
    description: 'Critical coral spawning and recovery zone',
    regulations: [
      'No anchoring on coral reefs',
      'Reduced boat traffic during spawning (Apr-Jun)',
      'Scientific research permits required',
      'Tourist diving strictly regulated'
    ],
    validFrom: new Date('2024-04-01'),
    validUntil: new Date('2024-06-30'),
    isActive: false, // Seasonal
    authority: 'Marine Biology Research Institute',
    penalties: 'Fine up to ₹20,000 and research vessel ban',
    contact: 'MBRI Mandapam: +91-4567-265432'
  },
  {
    id: 'chennai-port-approach',
    name: 'Chennai Port Traffic Zone',
    type: 'naval_restricted',
    severity: 'warning',
    coordinates: [
      { lat: 13.120, lng: 80.250 },
      { lat: 13.120, lng: 80.350 },
      { lat: 13.050, lng: 80.350 },
      { lat: 13.050, lng: 80.250 }
    ],
    center: { lat: 13.085, lng: 80.300 },
    radius: 8000,
    description: 'High traffic commercial shipping zone',
    regulations: [
      'Small fishing vessels maintain safe distance',
      'Radio communication with port control required',
      'Navigation lights mandatory',
      'Speed restrictions for fishing boats'
    ],
    isActive: true,
    authority: 'Chennai Port Authority',
    penalties: 'Fine up to ₹5,000 and safety course mandatory',
    contact: 'Chennai Port Control: +91-44-25362000'
  }
];

export function isPointInZone(lat: number, lng: number, zone: RegulatoryZone): boolean {
  // Simple point-in-polygon check for rectangular zones
  if (zone.coordinates.length >= 4) {
    const minLat = Math.min(...zone.coordinates.map(c => c.lat));
    const maxLat = Math.max(...zone.coordinates.map(c => c.lat));
    const minLng = Math.min(...zone.coordinates.map(c => c.lng));
    const maxLng = Math.max(...zone.coordinates.map(c => c.lng));
    
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  }
  
  // Fallback to radius check
  const distance = calculateDistance(lat, lng, zone.center.lat, zone.center.lng);
  return distance <= zone.radius;
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function isZoneActive(zone: RegulatoryZone): boolean {
  if (!zone.isActive) return false;
  
  const now = new Date();
  if (zone.validFrom && now < zone.validFrom) return false;
  if (zone.validUntil && now > zone.validUntil) return false;
  
  return true;
}

export function checkRouteForViolations(waypoints: Array<{ lat: number; lng: number }>): Array<{
  zone: RegulatoryZone;
  violatingPoints: Array<{ lat: number; lng: number }>;
}> {
  const violations: Array<{
    zone: RegulatoryZone;
    violatingPoints: Array<{ lat: number; lng: number }>;
  }> = [];

  for (const zone of tamilNaduRegulatoryZones) {
    if (!isZoneActive(zone)) continue;
    
    const violatingPoints = waypoints.filter(point => 
      isPointInZone(point.lat, point.lng, zone)
    );
    
    if (violatingPoints.length > 0) {
      violations.push({ zone, violatingPoints });
    }
  }

  return violations;
}