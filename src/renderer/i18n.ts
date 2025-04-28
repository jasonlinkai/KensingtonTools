import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';
import zhTWTranslation from './locales/zh-TW/translation.json';
import jaTranslation from './locales/ja/translation.json';
import koTranslation from './locales/ko/translation.json';

// 取得 Electron 系統語言
async function getInitialLanguage() {
  if (typeof window !== 'undefined' && (window as any).electron && (window as any).electron.getSystemLanguage) {
    let lang = await (window as any).electron.getSystemLanguage();
    // 只取前2碼（如 zh-TW, zh-CN, en, ja, ko）
    if (lang.startsWith('zh-TW') || lang.startsWith('zh-HK')) return 'zh-TW';
    if (lang.startsWith('zh')) return 'zh';
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('ko')) return 'ko';
    return 'en';
  }
  return 'en';
}

// 動態初始化 i18n
getInitialLanguage().then((lng) => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslation },
        zh: { translation: zhTranslation },
        'zh-TW': { translation: zhTWTranslation },
        ja: { translation: jaTranslation },
        ko: { translation: koTranslation },
      },
      lng,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
});

export default i18n; 