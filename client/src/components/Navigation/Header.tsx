import { Button } from "@/components/ui/button";
import { Anchor, Plus, User } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/LanguageContext";

interface HeaderProps {
  onOpenCatchReport: () => void;
}

export default function Header({ onOpenCatchReport }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Anchor className="text-ocean-500 w-6 h-6" />
              <h1 className="text-xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-ocean-500 font-medium">{t('nav.map')}</a>
              <a href="/fishing-log" className="text-gray-500 hover:text-gray-700 transition-colors">{t('nav.logbook')}</a>
              <a href="/species-guide" className="text-gray-500 hover:text-gray-700 transition-colors">{t('nav.species')}</a>
              <a href="/regulatory-zones" className="text-gray-500 hover:text-gray-700 transition-colors">Zones</a>
              <a href="/tidal-charts" className="text-gray-500 hover:text-gray-700 transition-colors">{t('nav.tides')}</a>
              <a href="/weather-alerts" className="text-gray-500 hover:text-gray-700 transition-colors">{t('nav.weather')}</a>
              <a href="/analytics" className="text-gray-500 hover:text-gray-700 transition-colors">{t('nav.analytics')}</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            <Button 
              className="bg-ocean-500 text-white hover:bg-ocean-600 transition-colors"
              onClick={onOpenCatchReport}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('dashboard.reportCatch')}
            </Button>
            
            <div className="relative">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <div className="w-8 h-8 bg-ocean-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block">Captain Smith</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
