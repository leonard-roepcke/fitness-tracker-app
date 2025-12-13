import { LanguageContext } from "@/context/LanguageContext";
import { useContext } from "react";
import { German } from "../constants/i18n/German";
import { English } from "../constants/i18n/English";

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return ctx;
};

