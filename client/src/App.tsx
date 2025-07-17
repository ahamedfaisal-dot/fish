import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/LanguageContext";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import FishingLog from "@/pages/FishingLog";
import TidalCharts from "@/pages/TidalCharts";
import WeatherAlerts from "@/pages/WeatherAlerts";
import SpeciesGuide from "@/pages/SpeciesGuide";
import RegulatoryZones from "@/pages/RegulatoryZones";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/fishing-log" component={FishingLog} />
      <Route path="/tidal-charts" component={TidalCharts} />
      <Route path="/weather-alerts" component={WeatherAlerts} />
      <Route path="/species-guide" component={SpeciesGuide} />
      <Route path="/regulatory-zones" component={RegulatoryZones} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
