import React from 'react';
import { useNavigate } from 'react-router';
import { Home, Bell, Plus, FileText, User, Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CityComplaintsMockup() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-slate-50 dark:bg-slate-900">
      {/* Mockup Frame Header */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-black text-slate-800 dark:text-white">City Complaints Mockup</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Interactive wireframe mockup container</p>
      </div>

      {/* Mobile Device Frame */}
      <div className="w-[375px] h-[720px] rounded-[3rem] border-4 border-dashed border-blue-500 bg-white shadow-2xl flex flex-col overflow-hidden relative select-none">
        
        {/* Device Status Bar */}
        <div className="h-6 bg-slate-900 text-white flex justify-between items-center px-6 text-[10px] font-medium z-10">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-2 border border-white/80 rounded-sm flex items-center justify-start p-0.5"><span className="w-1.5 h-full bg-white rounded-2xs"></span></span>
          </div>
        </div>

        {/* Mockup Header */}
        <div className="h-16 bg-[#1A237E] px-4 flex items-center justify-between text-white relative shadow-md">
          {/* Back arrow inside slightly lighter navy rounded square button */}
          <button 
            onClick={() => navigate('/home/complaints')}
            className="w-10 h-10 flex items-center justify-center bg-[#283593] hover:bg-[#303f9f] rounded-xl active:scale-95 transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="font-extrabold text-lg absolute left-1/2 -translate-x-1/2">City Complaints</span>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Mockup Body */}
        <div className="flex-1 bg-[#EEF0F5] flex flex-col items-center p-6 relative">
          
          {/* Centered Empty State Content (with generous space below) */}
          <div className="flex flex-col items-center text-center mt-28">
            <div className="w-[75px] h-[75px] rounded-full bg-[#DDEAF5] flex items-center justify-center shadow-inner mb-5 transition-transform hover:scale-105 duration-300">
              {/* Stacked sheets or civic building icon in navy outline style, ~32px */}
              <Building2 className="w-[32px] h-[32px] text-[#1A237E]" strokeWidth={2} />
            </div>
            <p className="text-[14px] text-slate-500 font-normal tracking-tight">No Records Found - Yet.</p>
          </div>

        </div>

        {/* Mockup Bottom Navigation Bar */}
        <div className="h-16 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative">
          
          {/* Tab 1: Home (Active) */}
          <button className="flex flex-col items-center justify-center w-12 gap-1 text-[#00BFA5]">
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
        <div className="h-5 bg-white flex justify-center items-center pb-1">
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
export default CityComplaintsMockup;
