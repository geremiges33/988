import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { translations, Lang } from "../i18n/translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (typeof translations)[Lang];
}

// Provide real defaults so the context is never `undefined` —
// this keeps HMR-triggered re-evaluations from crashing consumers.
const defaultLang: Lang = (() => {
  try {
    const stored = localStorage.getItem("thrift_lang");
    return stored === "mn" ? "mn" : "en";
  } catch {
    return "en";
  }
})();

const LanguageContext = createContext<LanguageContextType>({
  lang: defaultLang,
  setLang: () => {},
  t: translations[defaultLang],
});

const STORAGE_KEY = "thrift_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === "mn" ? "mn" : "en";
    } catch {
      return "en";
    }
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}