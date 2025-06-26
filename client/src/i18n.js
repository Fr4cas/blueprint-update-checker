import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/* ====== Language importing - start ====== */
// English
import commonEn from "./locales/en/common.json"
import homeEn from "./locales/en/home.json"
import scanEn from "./locales/en/scan.json"
import uploadEn from "./locales/en/upload.json"

// Chinese
import commonZh from "./locales/zh/common.json"
import homeZh from "./locales/zh/home.json"
import scanZh from "./locales/zh/scan.json"
import uploadZh from "./locales/zh/upload.json"

/* ====== Language importing - end ====== */

i18n
    .use(initReactI18next).init({
        resources: {
            en: {
                common: commonEn,
                home: homeEn,
                scan: scanEn,
                upload: uploadEn
            },
            zh: {
                common: commonZh,
                home: homeZh,
                scan: scanZh,
                upload: uploadZh
            }
        },
        lng: localStorage.getItem('lang') || 'en',
        fallbackLng: 'en',
        ns: ['common', 'home', 'scan', 'upload'],
        defaultNS: 'home',
        interpolation: {
            escapeValue: false
        }
    });

    export default i18n;