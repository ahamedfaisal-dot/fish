# Smart Fishing Route Optimization Platform

## Project Overview
A comprehensive fishing platform that leverages machine learning, real-time weather data, and advanced routing algorithms to help fishermen maximize their catch potential in Indian coastal waters.

### Technologies Used
- **Frontend**: React with Vite, TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Features**: Interactive map visualization, ML prediction models, real-time oceanographic data, GPS tracking, Gemini AI-powered chatbot

## Project Architecture
- **Frontend**: React SPA served via Vite development server
- **Backend**: Express.js API server handling data persistence and external API calls
- **Database**: PostgreSQL with comprehensive schema for fishing zones, catch reports, routes, and weather data
- **Shared Types**: Common TypeScript definitions in `shared/schema.ts` using Drizzle ORM

## Recent Changes
**July 17, 2025**
- ✓ Fixed database connection issue that was causing app startup failure
- ✓ Migrated from Neon serverless database to PostgreSQL 
- ✓ Updated database driver from `@neondatabase/serverless` to `pg`
- ✓ Successfully pushed database schema to PostgreSQL
- ✓ Fixed JavaScript runtime errors in map and API services
- ✓ Added graceful fallbacks for missing API configurations
- ✓ Fixed empty fishing zones issue in predictions API
- ✓ Added POST endpoint for creating fishing zones
- ✓ Seeded database with sample Tamil Nadu fishing zones
- ✓ All core features now working: predictions, route optimization, weather integration
- ✓ Fixed Gemini AI chatbot parameter mapping and added fallback responses
- ✓ Gemini API now providing comprehensive fishing advice in Tamil context
- ✓ **NEW: Real-time catch probability heatmap overlay implemented**
- ✓ Heatmap service calculates probability based on fishing zones, weather, historical data
- ✓ Interactive heatmap toggle in sidebar with visual probability indicators
- ✓ Application fully operational on port 5000

## Database Schema
The application includes comprehensive tables for:
- Users (authentication and profile management)
- Fishing zones (location-based fishing hotspots with ML confidence scoring)
- Catch reports (user-submitted fishing data for ML training)
- Routes (optimized fishing routes with fuel/time estimates)
- Weather data (real-time oceanographic conditions)

## Development Notes
- Database migrations handled via Drizzle: `npm run db:push`
- Development server combines frontend and backend on port 5000
- Application uses PostgreSQL with proper indexing for location-based queries

## User Preferences
None specified yet.