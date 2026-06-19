import React from 'react';
import { useNavigate } from 'react-router';
import { Home, Bell, Plus, FileText, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EditProfileMockup() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-slate-50 dark:bg-slate-900">
      {/* Mockup Frame Header */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-black text-slate-800 dark:text-white">Edit Profile Mockup</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Interactive wireframe mockup container</p>
      </div>

      {/* Mobile Device Frame */}
      <div className="w-[375px] h-[720px] rounded-[3rem] border-4 border-dashed border-blue-500 bg-white shadow-2xl flex flex-col overflow-hidden relative select-none">
        
        {/* Device Status Bar */}
        <div className="h-6 bg-slate-900 text-white flex justify-between items-center px-6 text-[10px] font-medium z-10 flex-shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-2 border border-white/80 rounded-sm flex items-center justify-start p-0.5"><span className="w-1.5 h-full bg-white rounded-2xs"></span></span>
          </div>
        </div>

        {/* Mockup Header */}
        <div className="h-16 bg-[#009688] px-4 flex items-center justify-between text-white relative shadow-md flex-shrink-0">
          {/* Back arrow inside slightly lighter teal rounded square button */}
          <button 
            onClick={() => navigate('/home/complaints/profile-mockup')}
            className="w-10 h-10 flex items-center justify-center bg-teal-600/50 hover:bg-teal-500/50 rounded-xl active:scale-95 transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="font-extrabold text-lg absolute left-1/2 -translate-x-1/2">Edit Profile</span>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Mockup Body (White Background) */}
        <div className="flex-1 bg-white px-5 py-6 overflow-y-auto">
          
          <div className="space-y-4">
            
            {/* Field 1: Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-400 font-normal self-start">Full name</label>
              <input 
                type="text" 
                defaultValue="Active Citizen"
                disabled
                className="w-full h-12 bg-white border border-[#E0E0E0] rounded-lg px-4 text-[14px] text-slate-800 focus:outline-none"
              />
            </div>

            {/* Field 2: Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-400 font-normal self-start">Location</label>
              <textarea 
                defaultValue="22G8 9HP, Kuthambakkam, Tamil Nadu 602105, India"
                disabled
                className="w-full h-[64px] bg-white border border-[#E0E0E0] rounded-lg px-4 py-2.5 text-[14px] text-slate-800 focus:outline-none resize-none leading-snug"
              />
            </div>

            {/* Field 3: Mobile Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-400 font-normal self-start">Mobile number</label>
              <input 
                type="text" 
                defaultValue="9392520125"
                disabled
                className="w-full h-12 bg-white border border-[#E0E0E0] rounded-lg px-4 text-[14px] text-slate-800 focus:outline-none"
              />
            </div>

            {/* Field 4: Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-400 font-normal self-start">Email</label>
              <input 
                type="email" 
                placeholder="youremail@domain.com"
                disabled
                className="w-full h-12 bg-white border border-[#E0E0E0] rounded-lg px-4 text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 px-1">
              <button 
                onClick={() => navigate('/home/complaints/profile-mockup')}
                className="w-full h-12 bg-[#F15A24] hover:bg-[#e04f1a] text-white font-medium text-[16px] rounded-full flex items-center justify-center shadow-md shadow-orange-500/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                Save
              </button>
            </div>

          </div>

        </div>

        {/* Mockup Bottom Navigation Bar */}
        <div className="h-16 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative flex-shrink-0">
          
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

          {/* Tab 5: Profile (Active) */}
          <button className="flex flex-col items-center justify-center w-12 gap-1 text-[#00BFA5]">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-bold">Profile</span>
          </button>

        </div>

        {/* Device Home Indicator Bar */}
        <div className="h-5 bg-white flex justify-center items-center pb-1 flex-shrink-0">
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
export default EditProfileMockup;
