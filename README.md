#  Smart Fishing Route Optimization Platform

##  Project Overview

Welcome to the **Smart Fishing Route Optimization Platform** – a comprehensive solution built to empower fishermen in **Indian coastal waters**, specifically **Tamil Nadu**. Leveraging **machine learning**, **real-time oceanographic data**, and **advanced route planning**, this platform helps maximize catch potential, reduce fuel costs, and ensure **compliance with regulatory fishing zones**.

 An intuitive UI, interactive map, AI-powered chatbot, and personal fishing logbook come together in a seamless experience backed by a robust backend and a powerful ML engine.

---

##  Features

### 🗺 Interactive Map Visualization
- Dynamic map with optimized routes
- Visual zones with ML-based confidence scores
- Regulatory zone overlays (restricted, prohibited, naval)

###  Smart Route Optimization
- Calculates optimal paths using ML predictions
- Considers fuel efficiency, travel time, and catch probability

###  ML Prediction Models
- Predicts high-potential fishing zones based on historical + live data

###  Real-time Oceanographic & Weather Data
- Live wind speed, tidal charts, visibility, and alerts integration

###  GPS Tracking (Conceptual)
- Foundation laid for real-time boat tracking & path following

###  Regulatory Zone Compliance Checker
- Detects if your route overlaps restricted zones (National Parks, Ports, Naval regions)

###  Comprehensive Species Guide
- In-depth data: season, size, depth, location, bait & fishing techniques for Tamil Nadu marine species

###  Personal Fishing Logbook
- Track catches, weight, species, "best day" data
- Feeds ML models for smarter future predictions

###  Fishing Analytics Dashboard
- Zone performance metrics, average confidence scores, and catch analytics

###  Gemini AI-Powered Chatbot
- Contextual Tamil Nadu-specific fishing guidance using Google Gemini API

---

##  Technologies Used

### Frontend
- **React + Vite** – Fast SPA framework
- **TypeScript** – Type-safe frontend & backend development
- **TailwindCSS** – Utility-first responsive UI
- **shadcn/ui** – Beautiful reusable UI components

### Backend
- **Express.js** – Minimal & fast server framework
- **TypeScript** – Type-safe backend services

### Database
- **PostgreSQL** – Robust relational database
- **Drizzle ORM** – Schema-driven, type-safe database management

### AI/ML
- **Google Gemini API** – Smart fishing chatbot

---

##  Project Architecture

###  Frontend (React + Vite)
- SPA handles all user interactions
- Communicates with backend APIs
- Displays interactive map, analytics, logs, chatbot

###  Backend (Express.js)
- Processes requests (routes, ML predictions, compliance)
- Connects to PostgreSQL
- Makes external API calls (weather, Gemini AI)

###  Database (PostgreSQL + Drizzle ORM)
- Stores:
  - Users & profile data
  - Fishing zones with confidence scores
  - Catch logs
  - Routes & fuel estimations
  - Oceanographic/weather data
  - Marine species reference data
  - Regulatory fishing zones

---

##  Database Schema Overview

| Table           | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `Users`         | Stores login, profile, and personalized settings                            |
| `FishingZones`  | Geospatial zones + ML confidence values                                      |
| `CatchReports`  | Logs user catches: species, weight, date, method, location                  |
| `Routes`        | Optimized fishing paths + estimated fuel and time                           |
| `WeatherData`   | Real-time & historical wind, tide, visibility, alerts                        |
| `Species`       | Fish reference data: size, depth, bait, season                              |
| `RegulatoryZones`| Government-marked restricted/prohibited areas with metadata                |

 Performance optimized using geo-indexing and key column indexing.

---

##  Recent Changes & Fixes

###  Database
- Fixed database connection startup bug
- Migrated from **Neon serverless** to **self-hosted PostgreSQL**
- Updated from `@neondatabase/serverless` → `pg`
- Drizzle schema pushed successfully

###  API / Features
- Fixed JS runtime bugs in maps & API services
- Added fallback configs for robustness
- Fixed empty fishing zones in prediction endpoint
- New `POST` endpoint for creating zones dynamically
- Added seeded Tamil Nadu zone data

- <img width="1837" height="1000" alt="image" src="https://github.com/user-attachments/assets/602d6bd2-3cab-424e-a3d6-f1b09a2c28da" />


###  AI Chatbot
- Gemini parameter fixes
- Fallback message logic added
- Tailored Tamil fishing guidance

###  Deployment
- Runs fully on **port 5000**
- Combined frontend + backend for local development

---

##  Development Setup

###  Prerequisites
- Node.js (LTS recommended)
- npm or Yarn
- PostgreSQL instance
- Google Gemini API (enabled via Google Cloud)

---

###  Steps to Run Locally

#### 1. Clone the Repository

git clone <your-repository-url>
cd smart-fishing-platform
Install Dependencies
### 2. Install Dependencies

npm install  # or yarn install

### 3. Configure Environment Variables
Create a .env file in the root and add:

DATABASE_URL="postgresql://user:password@host:port/database"
GOOGLE_GEMINI_API_KEY="your_gemini_api_key"
# Add other keys as needed
### 4. Setup & Migrate the Database
Ensure PostgreSQL is running and accessible, then run:

npm run db:push

### 5. Seed Sample Data (Optional)

npm run db:seed

### 6. Run the Application

npm run dev
👉 Open your browser and visit: http://localhost:5000


| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start frontend & backend for development |
| `npm run build`     | Build frontend for production            |
| `npm run start`     | Start production server                  |
| `npm run db:push`   | Push Drizzle migrations to PostgreSQL    |
| `npm run db:seed`   | Seed initial data                        |
| `npm run typecheck` | TypeScript validation                    |



### to see the full output 
watch :  https://youtu.be/a8K5KV6XQqo?si=oT3PTbERn1xqIipB
