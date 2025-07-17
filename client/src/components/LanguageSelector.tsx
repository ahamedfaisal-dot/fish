import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/LanguageContext";
import { Language } from "@/lib/translations";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage, getLanguageName } = useLanguage();

  const languages: Language[] = ['en', 'ta', 'hi'];

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-500" />
      <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
        <SelectTrigger className="w-24 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang} className="text-xs">
              {getLanguageName(lang)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}