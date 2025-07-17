import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fishingZones = pgTable("fishing_zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  radius: real("radius").notNull(), // in meters
  confidence: real("confidence").notNull(),
  species: text("species").array(),
  depth: real("depth"),
  lastUpdated: timestamp("last_updated").defaultNow(),
}, (table) => ({
  locationIdx: index("fishing_zones_location_idx").on(table.latitude, table.longitude),
}));

export const catchReports = pgTable("catch_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  species: text("species").notNull(),
  quantity: integer("quantity").notNull(),
  length: real("length"), // in inches
  weight: real("weight"), // in pounds
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => ({
  locationIdx: index("catch_reports_location_idx").on(table.latitude, table.longitude),
  speciesIdx: index("catch_reports_species_idx").on(table.species),
}));

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  waypoints: jsonb("waypoints").notNull(), // Array of {lat, lng, zoneId}
  distance: real("distance").notNull(), // in miles
  estimatedFuel: real("estimated_fuel").notNull(), // in dollars
  estimatedTime: real("estimated_time").notNull(), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  waterTemp: real("water_temp"),
  windSpeed: real("wind_speed"),
  windDirection: text("wind_direction"),
  tideInfo: text("tide_info"),
  visibility: real("visibility"),
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => ({
  locationIdx: index("weather_data_location_idx").on(table.latitude, table.longitude),
  timestampIdx: index("weather_data_timestamp_idx").on(table.timestamp),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  catchReports: many(catchReports),
  routes: many(routes),
}));

export const catchReportsRelations = relations(catchReports, ({ one }) => ({
  user: one(users, {
    fields: [catchReports.userId],
    references: [users.id],
  }),
}));

export const routesRelations = relations(routes, ({ one }) => ({
  user: one(users, {
    fields: [routes.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export const insertFishingZoneSchema = createInsertSchema(fishingZones).omit({
  id: true,
  lastUpdated: true,
});

export const insertCatchReportSchema = createInsertSchema(catchReports).omit({
  id: true,
  timestamp: true,
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
  createdAt: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type FishingZone = typeof fishingZones.$inferSelect;
export type InsertFishingZone = z.infer<typeof insertFishingZoneSchema>;

export type CatchReport = typeof catchReports.$inferSelect;
export type InsertCatchReport = z.infer<typeof insertCatchReportSchema>;

export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;

export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
