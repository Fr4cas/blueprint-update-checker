import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/* ====== Language importing - start ====== */
// English
import commonEn from "./locales/en/common.json"
import homeEn from "./locales/en/home.json"

// Chinese
import commonZh from "./locales/zh/common.json"
import homeZh from "./locales/zh/home.json"

/* ====== Language importing - end ====== */

i18n
    .use(initReactI18next).init({
        resources: {
            en: {
                common: commonEn,
                home: homeEn
            },
            zh: {
                common: commonZh,
                home: homeZh
            }
        },
        lng: localStorage.getItem('lang') || 'en',
        fallbackLng: 'en',
        ns: ['common', 'home'],
        defaultNS: 'home',
        interpolation: {
            escapeValue: false
        }
    });

    export default i18n;