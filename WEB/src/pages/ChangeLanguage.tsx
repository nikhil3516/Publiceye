import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft, Globe, Languages } from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = [
  { id: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { id: 'mr', name: 'Marathi', native: 'మరాठी', flag: '🇮🇳' },
  { id: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { id: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
];

export function ChangeLanguage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('en');

  const handleApply = () => {
    toast.success(`Language changed to ${LANGUAGES.find(l => l.id === selected)?.name}`, {
        icon: <Languages className="w-4 h-4" />,
    });
    setTimeout(() => navigate(-1), 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 md:p-6 flex items-center gap-4 sticky top-0 md:top-16 z-30">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">App Language</h2>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Personalize your experience</p>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
        <div className="bg-teal-600 rounded-[2rem] p-6 mb-8 text-white shadow-xl shadow-teal-200/40 dark:shadow-teal-900/20 relative overflow-hidden">
            <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-1">Select Language</h3>
                <p className="text-teal-100 text-sm font-medium">Choose your preferred language for reports and notifications.</p>
            </div>
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {LANGUAGES.map((lang) => (
            <div 
              key={lang.id}
              onClick={() => setSelected(lang.id)}
              className={`p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer flex items-center justify-between group ${
                selected === lang.id 
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-md scale-[1.01]' 
                  : 'border-white dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm hover:border-slate-100 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl group-hover:scale-110 transition-transform">
                    {lang.flag}
                </div>
                <div>
                  <p className={`text-base font-black tracking-tight ${selected === lang.id ? 'text-teal-700 dark:text-teal-400' : 'text-slate-900 dark:text-white'}`}>
                    {lang.name}
                  </p>
                  <p className={`text-xs font-bold ${selected === lang.id ? 'text-teal-600/70 dark:text-teal-400/70' : 'text-slate-400 dark:text-slate-500'}`}>
                    {lang.native}
                  </p>
                </div>
              </div>
              {selected === lang.id && (
                <div className="w-8 h-8 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200/50">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 lg:left-72 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 p-6 z-40">
        <div className="max-w-2xl mx-auto">
            <Button 
                onClick={handleApply}
                className="w-full bg-teal-600 hover:bg-teal-700 h-14 rounded-2xl text-lg font-black shadow-xl shadow-teal-200/40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <Languages className="w-5 h-5" />
                Apply Language Settings
            </Button>
        </div>
      </div>
    </div>
  );
}
