"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    try {
      const key = "bioluma:lang";
      const existing = localStorage.getItem(key);
      if (!existing) {
        localStorage.setItem(key, "uk");
        i18n.changeLanguage("uk");
      }
    } catch {
      i18n.changeLanguage("uk");
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
