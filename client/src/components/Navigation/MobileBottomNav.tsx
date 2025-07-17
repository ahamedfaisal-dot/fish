import { Button } from "@/components/ui/button";
import { Map, BookOpen, Fish, Waves, CloudRain, PlusCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/lib/LanguageContext";

interface MobileBottomNavProps {
  onOpenCatchReport: () => void;
}

export default function MobileBottomNav({ onOpenCatchReport }: MobileBottomNavProps) {
  const [location] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/", icon: Map, label: t('nav.map') },
    { path: "/fishing-log", icon: BookOpen, label: t('nav.logbook').substring(0, 3) },
    { path: "/species-guide", icon: Fish, label: t('nav.species').substring(0, 4) },
    { path: "/weather-alerts", icon: CloudRain, label: t('nav.weather').substring(0, 4) }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link key={path} href={path}>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center space-y-1 px-2 py-1 h-auto ${
                location === path 
                  ? "text-ocean-500 dark:text-ocean-400" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Button>
          </Link>
        ))}
        
        <Button 
          variant="ghost" 
          className="flex flex-col items-center space-y-1 text-ocean-500 dark:text-ocean-400 px-2 py-1 h-auto"
          onClick={onOpenCatchReport}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-xs">{t('nav.report')}</span>
        </Button>
      </div>
    </div>
  );
}
