import { Language, fishSpeciesTranslations } from './translations';

export function getSpeciesName(species: string, language: Language): string {
  if (language === 'en') {
    return species;
  }

  const translation = fishSpeciesTranslations[species as keyof typeof fishSpeciesTranslations];
  if (translation && translation[language]) {
    return translation[language];
  }

  return species;
}

export function getSpeciesWithTranslation(species: string, language: Language): string {
  if (language === 'en') {
    return species;
  }

  const translation = fishSpeciesTranslations[species as keyof typeof fishSpeciesTranslations];
  if (translation && translation[language]) {
    return `${species} (${translation[language]})`;
  }

  return species;
}