import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en/translation.json';
import vi from './vi/translation.json';
import kr from './kr/translation.json';

i18n
    .use(LanguageDetector) // tự động phát hiện ngôn ngữ trình duyệt
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            vi: { translation: vi },
            kr: { translation: kr },
        },
        fallbackLng: 'vi',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
