import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Home, Bell, Plus, FileText, User, Camera, Phone, Mail, MapPin, 
  Globe, Star, Clock, Lock, Info, LogOut, ChevronRight, Upload, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProfileMockup() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-slate-50 dark:bg-slate-900">
      {/* Mockup Frame Header */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-black text-slate-800 dark:text-white">Profile Page Mockup</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Interactive scrollable wireframe mockup container</p>
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

        {/* Outer wrapper to containerize scroll body, modal overlay and bottom nav */}
        <div className="flex-1 flex flex-col relative overflow-hidden min-h-[400px]">

          {/* Top Bar with Language switcher badge */}
          <div className="h-14 bg-white px-5 flex items-center justify-between border-b border-slate-100 flex-shrink-0 relative">
            <span className="font-bold text-slate-800 text-base">Profile</span>
            
            {/* Top-right teal language switcher badge */}
            <button className="bg-[#00BFA5] hover:bg-teal-600 text-white text-xs font-bold rounded-full px-3 py-1 flex items-center gap-1 transition-transform active:scale-95">
              <Globe className="w-3.5 h-3.5 text-white" />
              <span>EN</span>
            </button>
          </div>

          {/* Mockup Body (Scrollable viewport) */}
          <div className="flex-1 bg-white overflow-y-auto px-6 py-5 scrollbar-hide">
            
            {/* Upper Body Profile Section */}
            <div className="flex flex-col items-start mb-6">
              
              {/* Centered Avatar container block */}
              <div className="w-full flex justify-center mb-4">
                <div className="relative w-[90px] h-[90px]">
                  {/* 90px Avatar */}
                  <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
                    <User className="w-12 h-12 text-slate-400" strokeWidth={1.5} />
                  </div>
                  {/* Camera / photo edit button overlay */}
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-0 right-0 w-[24px] h-[24px] rounded-full bg-[#1A237E] flex items-center justify-center text-white border border-white shadow-md active:scale-90 transition-transform"
                  >
                    <Camera className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Name */}
              <h4 className="text-[20px] font-medium text-slate-800 mb-1.5 self-start">Active Citizen</h4>

              {/* Description lines */}
              <p className="text-[13px] text-slate-500 font-normal leading-tight self-start mb-1">
                Post a complaint in your locality to become a PublicEye Champion
              </p>
              <p className="text-[13px] text-slate-500 font-normal leading-tight self-start mb-3">
                Thank you for your support to PublicEye Mission. Update your profile to experience enhanced features.
              </p>

              {/* Orange Button link */}
              <button 
                onClick={() => navigate('/home/report')}
                className="text-[#F15A24] font-bold text-[14px] hover:underline mb-4 cursor-pointer"
              >
                Post a Complaint Now
              </button>

              {/* Language pill (EN) below Profile Icon description */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] text-slate-400 font-medium">Selected Language:</span>
                <button className="bg-[#00BFA5] text-white text-[11px] font-bold rounded-full px-2.5 py-0.5 flex items-center gap-1 shadow-sm">
                  <Globe className="w-3 h-3" />
                  <span>EN</span>
                </button>
              </div>

            </div>

            {/* Your Details Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[15px] font-bold text-slate-800">Your Details</span>
                <button 
                  onClick={() => navigate('/home/complaints/edit-profile-mockup')}
                  className="text-[#F15A24] font-bold text-xs hover:underline cursor-pointer"
                >
                  EDIT
                </button>
              </div>
              
              {/* Header Divider */}
              <div className="h-[1px] bg-slate-200 w-full mb-3" />

              <div className="space-y-3">
                {/* Row 1: Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#1A237E]" strokeWidth={2} />
                  <span className="text-xs text-slate-500 font-medium">9392520125</span>
                </div>
                
                {/* Row Divider */}
                <div className="h-[1px] bg-slate-100 w-full" />

                {/* Row 2: Add Email */}
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#1A237E]" strokeWidth={2} />
                  <button className="text-[#F15A24] font-bold text-xs hover:underline">Add your email</button>
                </div>
                
                {/* Row Divider */}
                <div className="h-[1px] bg-slate-100 w-full" />

                {/* Row 3: Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#1A237E] mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs text-slate-500 font-medium leading-tight">
                    22G8 9HP, Kuthambakkam, Tamil Nadu 602105, India
                  </span>
                </div>

              </div>
            </div>

            {/* You Can Also Section */}
            <div className="mb-6">
              <span className="text-[13px] text-slate-400 font-medium block mb-3">You can also</span>
              
              <div className="space-y-1">
                
                {[
                  { icon: Bell, label: 'Check Notifications' },
                  { icon: Globe, label: 'Change language' },
                  { icon: Star, label: 'Rate Us on Playstore' },
                  { icon: Clock, label: 'Report issue' },
                  { icon: Lock, label: 'Privacy policy' },
                  { icon: Info, label: "What's New" },
                  { icon: LogOut, label: 'Logout' },
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  const handleRowClick = () => {
                    if (item.label === 'Check Notifications') {
                      navigate('/home/notifications');
                    } else if (item.label === 'Change language') {
                      navigate('/home/complaints/change-language-mockup');
                    } else if (item.label === 'Report issue') {
                      navigate('/home/report');
                    }
                  };
                  return (
                    <div key={index}>
                      <button 
                        onClick={handleRowClick}
                        className="w-full flex items-center justify-between py-3 group hover:bg-slate-50 rounded-xl px-1.5 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 text-[#1A237E]">
                          <IconComponent className="w-[18px] h-[18px]" strokeWidth={2} />
                          <span className="text-xs font-normal">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#1A237E]/60 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                      {/* Divider except for last element */}
                      {index < 6 && <div className="h-[1px] bg-slate-100 w-full" />}
                    </div>
                  );
                })}

              </div>
            </div>

            {/* App Version Footer */}
            <div className="text-center py-4 mb-2">
              <span className="text-[11px] text-slate-400 font-medium">PublicEye V2.10.6</span>
            </div>

          </div>

          {/* Modal bottom sheet layer */}
          {isModalOpen && (
            <div className="absolute inset-0 bg-black/45 z-10 flex flex-col justify-end">
              <div className="bg-white rounded-t-[20px] shadow-2xl flex flex-col w-full z-20 pb-4 animate-in slide-in-from-bottom duration-300">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <span className="text-[16px] font-medium text-slate-900">Change Profile Photo</span>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 active:scale-90 transition-all text-[18px]"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                {/* Modal Options Body */}
                <div className="px-5 py-2">
                  
                  {/* Option 1 */}
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full flex items-center py-3 text-left hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="w-[44px] h-[44px] rounded-full bg-[#00BFA5] flex items-center justify-center text-white mr-4 shadow-sm flex-shrink-0">
                      <Upload className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h5 className="text-[14px] font-medium text-slate-950 leading-snug">Upload Image</h5>
                      <p className="text-[12px] text-slate-500 font-normal">Choose from gallery</p>
                    </div>
                  </button>

                  <div className="h-[1px] bg-slate-100 w-full my-1" />

                  {/* Option 2 */}
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full flex items-center py-3 text-left hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="w-[44px] h-[44px] rounded-full bg-[#00BFA5] flex items-center justify-center text-white mr-4 shadow-sm flex-shrink-0">
                      <Camera className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h5 className="text-[14px] font-medium text-slate-950 leading-snug">Take a Photo</h5>
                      <p className="text-[12px] text-slate-500 font-normal">Use your camera</p>
                    </div>
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* Mockup Bottom Navigation Bar (Uncovered by modal) */}
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

            {/* Tab 5: Profile (Active) */}
            <button className="flex flex-col items-center justify-center w-12 gap-1 text-[#00BFA5]">
              <User className="w-5 h-5" />
              <span className="text-[9px] font-bold">Profile</span>
            </button>

          </div>

          {/* Device Home Indicator Bar */}
          <div className="h-5 bg-white flex justify-center items-center pb-1 flex-shrink-0 z-20">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>

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
export default ProfileMockup;
