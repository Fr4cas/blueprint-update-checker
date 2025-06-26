import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/* ====== Language importing - start ====== */
// English
import homeEn from "./locales/en/home.json"

// Chinese
import homeZh from "./locales/zh/home.json"

/* ====== Language importing - end ====== */

i18n
    .use(initReactI18next).init({
        resources: {
            en: {
                home: homeEn
            },
            zh: {
                home: homeZh
            }
        },
        lng: localStorage.getItem('lang') || 'en',
        fallbackLng: 'en',
        ns: ['home'],
        defaultNS: 'home',
        interpolation: {
            escapeValue: false
        }
    });

    export default i18n;