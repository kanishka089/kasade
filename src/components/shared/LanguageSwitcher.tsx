import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggle = () => {
    i18n.changeLanguage(currentLang === 'si' ? 'en' : 'si');
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <Globe className="h-4 w-4" />
      {currentLang === 'si' ? 'EN' : 'SI'}
    </button>
  );
}
