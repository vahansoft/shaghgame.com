// Translation Manager Utility
const TranslationManager = {
    currentLanguage: 'en',
    
    setLanguage(lang) {
        if (typeof translations !== 'undefined' && translations[lang]) {
            this.currentLanguage = lang;
        } else {
            this.currentLanguage = 'en';
        }
    },
    
    getLanguage() {
        return this.currentLanguage;
    },
    
    t(key, params = {}) {
        if (typeof translations === 'undefined') {
            return key;
        }
        
        const translation = translations[this.currentLanguage];
        if (!translation) {
            console.warn(`Translation not found for language: ${this.currentLanguage}`);
            return key;
        }

        let text = translation[key];
        if (!text) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }

        // Replace parameters in the translation
        Object.keys(params).forEach(param => {
            text = text.replace(`{{${param}}}`, params[param]);
        });

        return text;
    }
};

