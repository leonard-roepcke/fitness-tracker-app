import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
}

export const LanguageContext =
  createContext<LanguageContextProps | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState("english");

  // beim Start laden
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("language");
      if (stored !== null) {
        setLanguageState(stored);
      }
    })();
  }, []);

  // öffentlich
  const setLanguage = async (language: string) => {
    setLanguageState(language);
    await AsyncStorage.setItem("language", language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

