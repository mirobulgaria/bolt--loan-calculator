import { useLanguage } from '../LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Globe size={14} />
        <span>EN</span>
      </button>
      <button
        onClick={() => setLanguage('bg')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          language === 'bg'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Globe size={14} />
        <span>BG</span>
      </button>
    </div>
  );
}
