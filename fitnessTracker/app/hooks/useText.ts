import { useLanguage } from "./useLanguage";
import { German } from "../constants/i18n/German";
import { English } from "../constants/i18n/English";

export const useText = () => {
  const { language } = useLanguage(); // TypeScript weiß jetzt, dass language existiert
  return language === "german" ? German : English;
};
