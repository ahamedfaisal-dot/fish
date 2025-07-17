import express from 'express';
import { db } from '../index.js';
import { catchReports } from '../../shared/schema.js';
import { eq, desc, sql } from 'drizzle-orm';

const router = express.Router();

// Get all catch reports
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0, species, userId } = req.query;
    
    let query = db.select().from(catchReports);
    
    if (species) {
      query = query.where(eq(catchReports.species, species));
    }
    
    if (userId) {
      query = query.where(eq(catchReports.userId, parseInt(userId)));
    }
    
    const reports = await query
      .orderBy(desc(catchReports.timestamp))
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    
    res.json(reports);
  } catch (error) {
    console.error('Error fetching catch reports:', error);
    res.status(500).json({ error: 'Failed to fetch catch reports' });
  }
});

// Create new catch report
router.post('/', async (req, res) => {
  try {
    const { userId, species, quantity, length, weight, latitude, longitude, notes } = req.body;
    
    if (!species || !quantity || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [newReport] = await db.insert(catchReports).values({
      userId: userId || 1, // Default user for now
      species,
      quantity: parseInt(quantity),
      length: length ? parseFloat(length) : null,
      weight: weight ? parseFloat(weight) : null,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      notes: notes || null,
    }).returning();

    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error creating catch report:', error);
    res.status(500).json({ error: 'Failed to create catch report' });
  }
});

// Get catch statistics
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    
    let baseQuery = db.select().from(catchReports);
    if (userId) {
      baseQuery = baseQuery.where(eq(catchReports.userId, parseInt(userId)));
    }
    
    const totalCatches = await db.select({ count: sql`count(*)` }).from(catchReports);
    const totalWeight = await db.select({ sum: sql`sum(weight)` }).from(catchReports);
    const speciesCount = await db.select({ count: sql`count(distinct species)` }).from(catchReports);
    
    res.json({
      totalCatches: parseInt(totalCatches[0]?.count || 0),
      totalWeight: parseFloat(totalWeight[0]?.sum || 0),
      speciesCount: parseInt(speciesCount[0]?.count || 0),
    });
  } catch (error) {
    console.error('Error fetching catch statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;