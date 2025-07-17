export interface TranslationDict {
  [key: string]: string;
}

export interface Translations {
  en: TranslationDict;
  ta: TranslationDict;
  hi: TranslationDict;
}

export const translations: Translations = {
  en: {
    // Navigation
    "nav.map": "Map",
    "nav.logbook": "Logbook", 
    "nav.species": "Species",
    "nav.tides": "Tides",
    "nav.weather": "Weather",
    "nav.analytics": "Analytics",
    "nav.report": "Report",
    
    // Dashboard
    "dashboard.title": "Fishing Route Optimizer",
    "dashboard.subtitle": "Smart fishing for Tamil Nadu coastal waters",
    "dashboard.reportCatch": "Report Catch",
    "dashboard.optimizeRoute": "Optimize Route",
    "dashboard.weatherConditions": "Weather Conditions",
    "dashboard.fishingZones": "Fishing Zones",
    
    // Species
    "species.guide": "Species Guide",
    "species.subtitle": "Tamil Nadu marine fish species reference",
    "species.search": "Search fish species...",
    "species.allSpecies": "All Species",
    "species.inSeason": "In Season",
    "species.techniques": "Fishing Techniques",
    "species.season": "Season",
    "species.depth": "Depth",
    "species.size": "Size",
    "species.locations": "Locations",
    "species.bait": "Bait",
    "species.category": "Category",
    
    // Weather
    "weather.alerts": "Weather Alerts",
    "weather.subtitle": "Tamil Nadu coastal weather monitoring",
    "weather.activeAlerts": "Active Alerts",
    "weather.currentConditions": "Current Conditions",
    "weather.forecast": "5-Day Outlook",
    "weather.refresh": "Refresh",
    "weather.allClear": "All Clear",
    "weather.noAlerts": "No active weather alerts for Tamil Nadu coast",
    "weather.temperature": "Temperature",
    "weather.wind": "Wind",
    "weather.waves": "Wave Height",
    "weather.visibility": "Visibility",
    
    // Tides
    "tides.charts": "Tidal Charts",
    "tides.subtitle": "Tamil Nadu coastal tide predictions",
    "tides.selectLocation": "Select Location",
    "tides.currentConditions": "Current Conditions",
    "tides.currentTide": "Current Tide Height",
    "tides.nextTide": "Next Tide",
    "tides.todaySchedule": "Today's Tide Schedule",
    "tides.high": "High",
    "tides.low": "Low",
    "tides.fishingTips": "Fishing Tips for Tamil Nadu Waters",
    "tides.bestTimes": "Best Fishing Times",
    "tides.speciesByTide": "Species by Tide",
    
    // Fishing Log
    "log.title": "Fishing Logbook",
    "log.subtitle": "Track your Tamil Nadu fishing adventures",
    "log.totalCatches": "Total Catches",
    "log.totalWeight": "Total Weight",
    "log.speciesCaught": "Species Caught",
    "log.bestDay": "Best Day",
    "log.recentCatches": "Recent Catches",
    "log.speciesAnalysis": "Species Analysis",
    "log.fishingSpots": "Fishing Spots",
    "log.topSpecies": "Top Species",
    "log.locations": "Fishing Locations",
    "log.noCatches": "No catches recorded yet. Start fishing and log your catches!",
    
    // Common
    "common.fish": "fish",
    "common.caught": "caught",
    "common.excellent": "Excellent",
    "common.good": "Good", 
    "common.fair": "Fair",
    "common.poor": "Poor",
    "common.fishing": "Fishing",
    "common.minutes": "min",
    "common.hours": "hours",
    "common.allTime": "All time",
    "common.combinedWeight": "Combined weight",
    "common.differentSpecies": "Different species",
    "common.fishInOneTrip": "Fish in one trip"
  },

  ta: {
    // Navigation
    "nav.map": "வரைபடம்",
    "nav.logbook": "மீன்பிடி பதிவு",
    "nav.species": "மீன் வகைகள்",
    "nav.tides": "அலை நிலை",
    "nav.weather": "வானிலை",
    "nav.analytics": "பகுப்பாய்வு",
    "nav.report": "பதிவு",
    
    // Dashboard
    "dashboard.title": "மீன்பிடி பாதை மேம்படுத்தி",
    "dashboard.subtitle": "தமிழ்நாடு கடலோர நீரில் திறமையான மீன்பிடித்தல்",
    "dashboard.reportCatch": "மீன்பிடி பதிவு",
    "dashboard.optimizeRoute": "பாதை மேம்படுத்துதல்",
    "dashboard.weatherConditions": "வானிலை நிலைமைகள்",
    "dashboard.fishingZones": "மீன்பிடி பகுதிகள்",
    
    // Species
    "species.guide": "மீன் வகை வழிகாட்டி",
    "species.subtitle": "தமிழ்நாடு கடல் மீன் வகைகள் குறிப்பு",
    "species.search": "மீன் வகைகளை தேடுங்கள்...",
    "species.allSpecies": "அனைத்து மீன் வகைகள்",
    "species.inSeason": "பருவத்தில்",
    "species.techniques": "மீன்பிடி நுட்பங்கள்",
    "species.season": "பருவம்",
    "species.depth": "ஆழம்",
    "species.size": "அளவு",
    "species.locations": "இடங்கள்",
    "species.bait": "தூண்டில்",
    "species.category": "வகை",
    
    // Weather
    "weather.alerts": "வானிலை எச்சரிக்கைகள்",
    "weather.subtitle": "தமிழ்நாடு கடலோர வானிலை கண்காணிப்பு",
    "weather.activeAlerts": "நடப்பு எச்சரிக்கைகள்",
    "weather.currentConditions": "தற்போதைய நிலைமைகள்",
    "weather.forecast": "5-நாள் முன்னறிவிப்பு",
    "weather.refresh": "புதுப்பிக்கவும்",
    "weather.allClear": "அனைத்தும் சாதகம்",
    "weather.noAlerts": "தமிழ்நாடு கடலோரத்திற்கு எச்சரிக்கைகள் எதுவும் இல்லை",
    "weather.temperature": "வெப்பநிலை",
    "weather.wind": "காற்று",
    "weather.waves": "அலை உயரம்",
    "weather.visibility": "தெரிவுநிலை",
    
    // Tides
    "tides.charts": "அலை நிலை அட்டவணை",
    "tides.subtitle": "தமிழ்நாடு கடலோர அலை முன்னறிவிப்பு",
    "tides.selectLocation": "இடத்தை தேர்ந்தெடுக்கவும்",
    "tides.currentConditions": "தற்போதைய நிலைமைகள்",
    "tides.currentTide": "தற்போதைய அலை உயரம்",
    "tides.nextTide": "அடுத்த அலை",
    "tides.todaySchedule": "இன்றைய அலை அட்டவணை",
    "tides.high": "உயர்",
    "tides.low": "தாழ்",
    "tides.fishingTips": "தமிழ்நாடு நீரில் மீன்பிடி குறிப்புகள்",
    "tides.bestTimes": "சிறந்த மீன்பிடி நேரங்கள்",
    "tides.speciesByTide": "அலையின் அடிப்படையில் மீன் வகைகள்",
    
    // Fishing Log
    "log.title": "மீன்பிடி பதிவேடு",
    "log.subtitle": "உங்கள் தமிழ்நாடு மீன்பிடி சாகசங்களை கண்காணிக்கவும்",
    "log.totalCatches": "மொத்த மீன்பிடித்தல்",
    "log.totalWeight": "மொத்த எடை",
    "log.speciesCaught": "பிடித்த மீன் வகைகள்",
    "log.bestDay": "சிறந்த நாள்",
    "log.recentCatches": "சமீபத்திய மீன்பிடித்தல்",
    "log.speciesAnalysis": "மீன் வகை பகுப்பாய்வு",
    "log.fishingSpots": "மீன்பிடி இடங்கள்",
    "log.topSpecies": "முதன்மை மீன் வகைகள்",
    "log.locations": "மீன்பிடி இடங்கள்",
    "log.noCatches": "இன்னும் மீன்பிடித்தல் பதிவு செய்யப்படவில்லை. மீன்பிடித்து பதிவு செய்யத் தொடங்குங்கள்!",
    
    // Common
    "common.fish": "மீன்",
    "common.caught": "பிடித்தது",
    "common.excellent": "சிறந்த",
    "common.good": "நல்ல",
    "common.fair": "நடுத்தர",
    "common.poor": "மோசம்",
    "common.fishing": "மீன்பிடித்தல்",
    "common.minutes": "நிமிடம்",
    "common.hours": "மணி",
    "common.allTime": "எல்லா நேரமும்",
    "common.combinedWeight": "ஒட்டுமொத்த எடை",
    "common.differentSpecies": "வெவ்வேறு வகைகள்",
    "common.fishInOneTrip": "ஒரு பயணத்தில் மீன்"
  },

  hi: {
    // Navigation
    "nav.map": "नक्शा",
    "nav.logbook": "मछली पकड़ने की डायरी",
    "nav.species": "मछली की प्रजातियां",
    "nav.tides": "ज्वार-भाटा",
    "nav.weather": "मौसम",
    "nav.analytics": "विश्लेषण",
    "nav.report": "रिपोर्ट",
    
    // Dashboard
    "dashboard.title": "मछली पकड़ने का रूट ऑप्टिमाइज़र",
    "dashboard.subtitle": "तमिलनाडु तटीय पानी के लिए स्मार्ट मछली पकड़ना",
    "dashboard.reportCatch": "मछली पकड़ने की रिपोर्ट",
    "dashboard.optimizeRoute": "रूट अनुकूलित करें",
    "dashboard.weatherConditions": "मौसम की स्थिति",
    "dashboard.fishingZones": "मछली पकड़ने के क्षेत्र",
    
    // Species
    "species.guide": "मछली प्रजाति गाइड",
    "species.subtitle": "तमिलनाडु समुद्री मछली प्रजातियों का संदर्भ",
    "species.search": "मछली की प्रजातियां खोजें...",
    "species.allSpecies": "सभी प्रजातियां",
    "species.inSeason": "मौसम में",
    "species.techniques": "मछली पकड़ने की तकनीकें",
    "species.season": "मौसम",
    "species.depth": "गहराई",
    "species.size": "आकार",
    "species.locations": "स्थान",
    "species.bait": "चारा",
    "species.category": "श्रेणी",
    
    // Weather
    "weather.alerts": "मौसम चेतावनी",
    "weather.subtitle": "तमिलनाडु तटीय मौसम निगरानी",
    "weather.activeAlerts": "सक्रिय चेतावनी",
    "weather.currentConditions": "वर्तमान स्थितियां",
    "weather.forecast": "5-दिन का पूर्वानुमान",
    "weather.refresh": "रिफ्रेश करें",
    "weather.allClear": "सब ठीक है",
    "weather.noAlerts": "तमिलनाडु तट के लिए कोई सक्रिय मौसम चेतावनी नहीं",
    "weather.temperature": "तापमान",
    "weather.wind": "हवा",
    "weather.waves": "लहर की ऊंचाई",
    "weather.visibility": "दृश्यता",
    
    // Tides
    "tides.charts": "ज्वार-भाटा चार्ट",
    "tides.subtitle": "तमिलनाडु तटीय ज्वार पूर्वानुमान",
    "tides.selectLocation": "स्थान चुनें",
    "tides.currentConditions": "वर्तमान स्थितियां",
    "tides.currentTide": "वर्तमान ज्वार की ऊंचाई",
    "tides.nextTide": "अगला ज्वार",
    "tides.todaySchedule": "आज का ज्वार कार्यक्रम",
    "tides.high": "उच्च",
    "tides.low": "निम्न",
    "tides.fishingTips": "तमिलनाडु पानी के लिए मछली पकड़ने की युक्तियां",
    "tides.bestTimes": "सबसे अच्छा मछली पकड़ने का समय",
    "tides.speciesByTide": "ज्वार के अनुसार प्रजातियां",
    
    // Fishing Log
    "log.title": "मछली पकड़ने की लॉगबुक",
    "log.subtitle": "अपने तमिलनाडु मछली पकड़ने के रोमांच को ट्रैक करें",
    "log.totalCatches": "कुल मछली पकड़ना",
    "log.totalWeight": "कुल वजन",
    "log.speciesCaught": "पकड़ी गई प्रजातियां",
    "log.bestDay": "सबसे अच्छा दिन",
    "log.recentCatches": "हाल की मछली पकड़ना",
    "log.speciesAnalysis": "प्रजाति विश्लेषण",
    "log.fishingSpots": "मछली पकड़ने के स्थान",
    "log.topSpecies": "शीर्ष प्रजातियां",
    "log.locations": "मछली पकड़ने के स्थान",
    "log.noCatches": "अभी तक कोई मछली पकड़ने का रिकॉर्ड नहीं है। मछली पकड़ना शुरू करें और अपने कैच लॉग करें!",
    
    // Common
    "common.fish": "मछली",
    "common.caught": "पकड़ा गया",
    "common.excellent": "उत्कृष्ट",
    "common.good": "अच्छा",
    "common.fair": "मध्यम",
    "common.poor": "खराब",
    "common.fishing": "मछली पकड़ना",
    "common.minutes": "मिनट",
    "common.hours": "घंटे",
    "common.allTime": "सभी समय",
    "common.combinedWeight": "संयुक्त वजन",
    "common.differentSpecies": "विभिन्न प्रजातियां",
    "common.fishInOneTrip": "एक यात्रा में मछली"
  }
};

export type Language = keyof Translations;

export const getTranslation = (key: string, language: Language): string => {
  return translations[language][key] || translations.en[key] || key;
};

export const getLanguageName = (language: Language): string => {
  const names = {
    en: "English",
    ta: "தமிழ்",
    hi: "हिंदी"
  };
  return names[language];
};

export const fishSpeciesTranslations = {
  "Seer Fish": { ta: "வஞ்சிரம்", hi: "सीर मछली" },
  "Red Snapper": { ta: "சங்கர மீன்", hi: "लाल स्नैपर" },
  "Pearl Spot": { ta: "கரிமீன்", hi: "पर्ल स्पॉट" },
  "Pomfret": { ta: "வாவல்", hi: "पोम्फ्रेट" },
  "Tuna": { ta: "சூரா", hi: "टूना" },
  "Mackerel": { ta: "அயலை", hi: "मैकेरल" },
  "Sardine": { ta: "மத்தி", hi: "सार्डिन" },
  "Flying Fish": { ta: "பறக்கும் மீன்", hi: "उड़ने वाली मछली" },
  "Mullet": { ta: "कदवा", hi: "मुलेट" },
  "Kingfish": { ta: "वनজरम्", hi: "किंगफिश" },
  "Sailfish": { ta: "पाल मीन्", hi: "सेलफिश" },
  "Marlin": { ta: "मार्लिन्", hi: "मार्लिन" },
  "Anchovy": { ta: "नेत्तिली", hi: "एंचोवी" },
  "Hilsa": { ta: "उलुवै", hi: "हिल्सा" },
  "Grouper": { ta: "कल्वा", hi: "ग्रूपर" },
  "Barracuda": { ta: "ओळा", hi: "बैराकुडा" },
  "Shark": { ta: "सराळै", hi: "शार्क" }
};