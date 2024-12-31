import React, { useState, useCallback } from 'react';
import { aiService } from '../../services/ai/aiService';

interface LanguageTranslatorProps {
  content: string;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ms', name: 'Bahasa Melayu' }
] as const;

type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export const LanguageTranslator: React.FC<LanguageTranslatorProps> = ({
  content,
  className = ''
}) => {
  const [translations, setTranslations] = useState<Record<LanguageCode, string>>({
    en: content,
    zh: '',
    id: '',
    hi: '',
    ms: ''
  });
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = useCallback(async (langCode: LanguageCode) => {
    if (langCode === selectedLang || translations[langCode]) {
      setSelectedLang(langCode);
      return;
    }
    
    setIsTranslating(true);
    setError(null);
    try {
      const translated = await aiService.translateContent(content, langCode);
      setTranslations(prev => ({
        ...prev,
        [langCode]: translated
      }));
      setSelectedLang(langCode);
    } catch (error) {
      console.error('Translation failed:', error);
      setError('Failed to translate. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  }, [content, selectedLang, translations]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Language:</span>
        <select
          value={selectedLang}
          onChange={(e) => handleTranslate(e.target.value as LanguageCode)}
          disabled={isTranslating}
          className="border rounded-md px-2 py-1 text-sm"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        {isTranslating && (
          <span className="flex items-center text-sm text-gray-500">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Translating...
          </span>
        )}
      </div>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
      <div className="prose max-w-none bg-white p-4 rounded-md border">
        {translations[selectedLang] || content}
      </div>
    </div>
  );
};
