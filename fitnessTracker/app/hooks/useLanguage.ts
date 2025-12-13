import { LanguageContext } from "@/context/LanguageContext";
import { useContext } from "react"



export const useLanguage = () => {
  const { language, setLanguage } = useContext(LanguageContext);
}
