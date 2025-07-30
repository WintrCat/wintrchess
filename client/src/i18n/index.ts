import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import httpApi from "i18next-http-backend";

import LocalStorageKey from "@/constants/LocalStorageKey";

import languages from "./languages";

i18next
    .use(initReactI18next)
    .use(httpApi)
    .init({
        fallbackLng: "en",
        backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" }
    })
    .then(() => {
        const preferredLanguage = localStorage.getItem(
            LocalStorageKey.PREFERRED_LANGUAGE
        );

        if (!preferredLanguage) return;
        if (!languages.find(lang => lang.id == preferredLanguage)) return;

        i18next.changeLanguage(preferredLanguage);
    });