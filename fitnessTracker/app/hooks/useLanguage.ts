import { LanguageContext } from "@/context/LanguageContext";
import { useContext } from "react";

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return ctx;
};

