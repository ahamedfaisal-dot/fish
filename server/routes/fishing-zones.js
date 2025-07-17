import express from 'express';
import { db } from '../index.js';
import { fishingZones } from '../../shared/schema.js';
import { eq, sql } from 'drizzle-orm';

const router = express.Router();

// Get all fishing zones
router.get('/', async (req, res) => {
  try {
    const zones = await db.select().from(fishingZones);
    res.json(zones);
  } catch (error) {
    console.error('Error fetching fishing zones:', error);
    res.status(500).json({ error: 'Failed to fetch fishing zones' });
  }
});

// Get fishing zones by location (with radius search)
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50000 } = req.query; // radius in meters
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const zones = await db.select().from(fishingZones).where(
      sql`ST_DWithin(ST_MakePoint(${lng}, ${lat})::geography, ST_MakePoint(longitude, latitude)::geography, ${radius})`
    );
    
    res.json(zones);
  } catch (error) {
    console.error('Error fetching nearby zones:', error);
    res.status(500).json({ error: 'Failed to fetch nearby zones' });
  }
});

// Create new fishing zone
router.post('/', async (req, res) => {
  try {
    const { name, latitude, longitude, radius, confidence, species, depth } = req.body;
    
    if (!name || !latitude || !longitude || !radius || confidence === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [newZone] = await db.insert(fishingZones).values({
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseFloat(radius),
      confidence: parseFloat(confidence),
      species: species || [],
      depth: depth ? parseFloat(depth) : null,
    }).returning();

    res.status(201).json(newZone);
  } catch (error) {
    console.error('Error creating fishing zone:', error);
    res.status(500).json({ error: 'Failed to create fishing zone' });
  }
});

// Update fishing zone
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updatedZone] = await db.update(fishingZones)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(fishingZones.id, parseInt(id)))
      .returning();

    if (!updatedZone) {
      return res.status(404).json({ error: 'Fishing zone not found' });
    }

    res.json(updatedZone);
  } catch (error) {
    console.error('Error updating fishing zone:', error);
    res.status(500).json({ error: 'Failed to update fishing zone' });
  }
});

// Delete fishing zone
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [deletedZone] = await db.delete(fishingZones)
      .where(eq(fishingZones.id, parseInt(id)))
      .returning();

    if (!deletedZone) {
      return res.status(404).json({ error: 'Fishing zone not found' });
    }

    res.json({ message: 'Fishing zone deleted successfully' });
  } catch (error) {
    console.error('Error deleting fishing zone:', error);
    res.status(500).json({ error: 'Failed to delete fishing zone' });
  }
});

export default router;