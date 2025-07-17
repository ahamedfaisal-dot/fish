import { db } from './index.js';
import { fishingZones } from '../shared/schema.js';

// Tamil Nadu fishing zones data
const tamilNaduZones = [
  {
    name: "Chennai Deep Waters",
    latitude: 13.0827,
    longitude: 80.3707,
    radius: 5000,
    confidence: 0.85,
    species: ["Seer Fish", "Tuna", "Sailfish"],
    depth: 80
  },
  {
    name: "Mamallapuram Reef",
    latitude: 12.6167,
    longitude: 80.2425,
    radius: 3000,
    confidence: 0.78,
    species: ["Red Snapper", "Grouper", "Pomfret"],
    depth: 45
  },
  {
    name: "Rameswaram Banks",
    latitude: 9.2876,
    longitude: 79.3629,
    radius: 8000,
    confidence: 0.92,
    species: ["Seer Fish", "Red Snapper", "Kingfish"],
    depth: 60
  },
  {
    name: "Tuticorin Offshore",
    latitude: 8.8047,
    longitude: 78.1848,
    radius: 6000,
    confidence: 0.73,
    species: ["Pomfret", "Mackerel", "Flying Fish"],
    depth: 35
  },
  {
    name: "Kanyakumari Deep Sea",
    latitude: 8.0883,
    longitude: 77.4885,
    radius: 7000,
    confidence: 0.88,
    species: ["Tuna", "Marlin", "Sailfish"],
    depth: 120
  },
  {
    name: "Nagapattinam Coast",
    latitude: 10.7672,
    longitude: 79.8920,
    radius: 4000,
    confidence: 0.65,
    species: ["Sardine", "Mackerel", "Anchovy"],
    depth: 25
  },
  {
    name: "Cuddalore Banks",
    latitude: 11.7449,
    longitude: 79.8218,
    radius: 4500,
    confidence: 0.71,
    species: ["Pearl Spot", "Mullet", "Pomfret"],
    depth: 30
  },
  {
    name: "Pichavaram Mangroves",
    latitude: 11.4500,
    longitude: 79.7800,
    radius: 2000,
    confidence: 0.82,
    species: ["Pearl Spot", "Mullet", "Crab"],
    depth: 8
  }
];

async function seedFishingZones() {
  try {
    console.log('🌱 Seeding fishing zones...');
    
    // Check if zones already exist
    const existingZones = await db.select().from(fishingZones);
    
    if (existingZones.length === 0) {
      await db.insert(fishingZones).values(tamilNaduZones);
      console.log(`✅ Seeded ${tamilNaduZones.length} fishing zones`);
    } else {
      console.log(`ℹ️  ${existingZones.length} fishing zones already exist`);
    }
  } catch (error) {
    console.error('❌ Error seeding fishing zones:', error);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFishingZones().then(() => process.exit(0));
}

export { seedFishingZones };