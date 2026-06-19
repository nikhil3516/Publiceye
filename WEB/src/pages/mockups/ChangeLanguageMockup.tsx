import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Home, Bell, Plus, FileText, User, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' }
];

export function ChangeLanguageMockup() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLanguageSelect = (langName: string) => {
    setSelectedLanguage(langName);
    setToastMessage(`Language changed to ${langName}`);
    
    // Auto-clear toast after 2 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-slate-50 dark:bg-slate-900">
      {/* Mockup Frame Header */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-black text-slate-800 dark:text-white">Change Language Mockup</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Interactive wireframe mockup container with fully functional language selector</p>
      </div>

      {/* Mobile Device Frame */}
      <div className="w-[375px] h-[720px] rounded-[3rem] border-4 border-dashed border-blue-500 bg-white shadow-2xl flex flex-col overflow-hidden relative select-none">
        
        {/* Device Status Bar */}
        <div className="h-6 bg-slate-900 text-white flex justify-between items-center px-6 text-[10px] font-medium z-30 flex-shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-2 border border-white/80 rounded-sm flex items-center justify-start p-0.5"><span className="w-1.5 h-full bg-white rounded-2xs"></span></span>
          </div>
        </div>

        {/* Mockup Body (Branded splash-style background) */}
        <div className="flex-1 bg-white px-5 py-6 flex flex-col items-center relative overflow-hidden">
          
          {/* Logo row centered at top */}
          <div className="flex items-center justify-center gap-3.5 mt-2 mb-4">
            <div className="w-[60px] h-[60px] rounded-full bg-[#009688] flex items-center justify-center shadow-md">
              <Eye className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[20px] font-semibold text-slate-800 leading-none">PublicEye</span>
              <span className="text-[13px] text-slate-400 font-normal leading-relaxed mt-0.5">सार्वजनिक नज़र</span>
            </div>
          </div>

          {/* Centered subtitles */}
          <div className="text-center mb-6">
            <p className="text-[13px] text-slate-400 font-medium">आपकी आवाज़, आपका शहर</p>
            <p className="text-[12px] text-slate-400 font-normal mt-0.5">Your Voice, Your City</p>
          </div>

          {/* Centered Language Selection Modal Overlay Card */}
          <div className="w-full bg-gradient-to-br from-[#009688] to-[#43A047] rounded-[20px] p-4 shadow-xl z-10 my-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[16px] font-medium text-white">Select Language</span>
              
              {/* White circular close button with "×" inside */}
              <button 
                onClick={() => navigate('/home/complaints/profile-mockup')}
                className="w-7 h-7 rounded-full border border-white/45 flex items-center justify-center text-white text-[18px] hover:bg-white/10 active:scale-90 transition-all font-light leading-none"
              >
                ×
              </button>
            </div>

            {/* Inner language card container */}
            <div className="bg-white rounded-[16px] py-2 flex flex-col overflow-hidden">
              
              {LANGUAGES.map((lang, idx) => {
                const isSelected = selectedLanguage === lang.name;
                return (
                  <div key={lang.code}>
                    
                    {/* Row item */}
                    <button 
                      onClick={() => handleLanguageSelect(lang.name)}
                      className="w-full h-[52px] px-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors active:bg-slate-100/80"
                    >
                      {/* Language script centered text */}
                      <span className={`text-[15px] font-normal w-full text-center ${isSelected ? 'text-[#009688] font-medium' : 'text-slate-600'}`}>
                        {lang.name}
                      </span>
                      
                      {/* Right-aligned Checkmark */}
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#009688] flex-shrink-0 absolute right-10" strokeWidth={2.5} />
                      )}
                    </button>

                    {/* Divider line */}
                    {idx < LANGUAGES.length - 1 && (
                      <div className="h-[1px] bg-slate-100 w-full" />
                    )}

                  </div>
                );
              })}

            </div>

          </div>

          {/* Toast / Snackbar notifications at bottom */}
          {toastMessage && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {toastMessage}
            </div>
          )}

        </div>

        {/* Mockup Bottom Navigation Bar (All Inactive) */}
        <div className="h-16 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative flex-shrink-0 z-20">
          
          {/* Tab 1: Home */}
          <button className="flex flex-col items-center justify-center w-12 gap-1 text-slate-400">
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold">Home</span>
          </button>

          {/* Tab 2: Notifications */}
          <button className="flex flex-col items-center justify-center w-12 gap-1 text-slate-400">
            <Bell className="w-5 h-5" />
            <span className="text-[9px] font-bold">Notifications</span>
          </button>

          {/* Center FAB */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-5 flex flex-col items-center justify-center">
            <button className="w-14 h-14 bg-[#00BFA5] rounded-full flex items-center justify-center shadow-lg shadow-teal-300/40 border-4 border-white transform transition-transform hover:scale-105 active:scale-95">
              <Plus className="w-6 h-6 text-white" strokeWidth={3} />
            </button>
          </div>

          {/* Spacer for FAB */}
          <div className="w-12" />

          {/* Tab 4: Complaints */}
          <button className="flex flex-col items-center justify-center w-12 gap-1 text-slate-400">
            <FileText className="w-5 h-5" />
            <span className="text-[9px] font-bold">Complaints</span>
          </button>

          {/* Tab 5: Profile */}
          <button className="flex flex-col items-center justify-center w-12 gap-1 text-slate-400">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-bold">Profile</span>
          </button>

        </div>

        {/* Device Home Indicator Bar */}
        <div className="h-5 bg-white flex justify-center items-center pb-1 flex-shrink-0 z-20">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>

      </div>

      {/* Back to Complaints Dashboard Button */}
      <Button 
        onClick={() => navigate('/home/complaints')}
        className="mt-6 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl px-6 font-bold shadow-md"
      >
        Back to Complaints Dashboard
      </Button>
    </div>
  );
}
export default ChangeLanguageMockup;
