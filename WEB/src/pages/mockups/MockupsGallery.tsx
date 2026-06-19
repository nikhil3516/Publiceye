import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { LayoutGrid, Smartphone, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { VotedComplaintsMockup } from './VotedComplaintsMockup';
import { PostedMockup } from './PostedMockup';
import { NearbyComplaintsMockup } from './NearbyComplaintsMockup';
import { CityComplaintsMockup } from './CityComplaintsMockup';
import { YourActivityMockup } from './YourActivityMockup';
import { SearchComplaintsMockup } from './SearchComplaintsMockup';
import { ProfileMockup } from './ProfileMockup';
import { ProfilePhotoMockup } from './ProfilePhotoMockup';
import { EditProfileMockup } from './EditProfileMockup';
import { ChangeLanguageMockup } from './ChangeLanguageMockup';

const MOCKUP_LIST = [
  {
    id: 'voted',
    name: 'Voted Complaints',
    theme: 'Purple/Violet Theme',
    bgColor: 'from-violet-500 to-purple-600',
    description: 'Empty-state page highlighting complaints upvoted by the citizen.',
    headerBg: '#6B3EE8',
    bodyBg: '#F0F0F5',
    activeTab: 'Complaints',
    component: VotedComplaintsMockup,
    route: '/home/complaints/voted'
  },
  {
    id: 'posted',
    name: 'Posted',
    theme: 'Teal + Orange Theme',
    bgColor: 'from-teal-500 to-emerald-600',
    description: 'Empty-state page displaying submitted complaints with a 2x2 grid & exclamation badge.',
    headerBg: '#009688',
    bodyBg: '#F0F0F5',
    activeTab: 'Complaints',
    component: PostedMockup,
    route: '/home/complaints/posted'
  },
  {
    id: 'nearby',
    name: 'Nearby Complaints',
    theme: 'Teal + Mint Theme',
    bgColor: 'from-teal-600 to-cyan-600',
    description: 'Empty-state page under Home tab showing nearby community issues.',
    headerBg: '#009688',
    bodyBg: '#F0F0F5',
    activeTab: 'Home',
    component: NearbyComplaintsMockup,
    route: '/home/complaints/nearby'
  },
  {
    id: 'city',
    name: 'City Complaints',
    theme: 'Deep Navy Theme',
    bgColor: 'from-indigo-700 to-blue-900',
    description: 'Empty-state page under Home tab containing stack or building civic outline icon.',
    headerBg: '#1A237E',
    bodyBg: '#EEF0F5',
    activeTab: 'Home',
    component: CityComplaintsMockup,
    route: '/home/complaints/city'
  },
  {
    id: 'activity',
    name: 'Your Activity',
    theme: 'Orange Theme',
    bgColor: 'from-orange-500 to-red-600',
    description: 'Empty-state page showing user stats/activities with an account silhouette.',
    headerBg: '#F15A24',
    bodyBg: '#F0F0F5',
    activeTab: 'Home',
    component: YourActivityMockup,
    route: '/home/complaints/activity'
  },
  {
    id: 'search',
    name: 'Search Complaints',
    theme: 'Forest Green Theme',
    bgColor: 'from-green-600 to-emerald-700',
    description: 'Landing/empty state search screen with a static input field & green search icon.',
    headerBg: '#1B7A3E',
    bodyBg: '#F0F0F5',
    activeTab: 'Home',
    component: SearchComplaintsMockup,
    route: '/home/complaints/search'
  },
  {
    id: 'profile',
    name: 'Profile Page',
    theme: 'Teal + Navy Settings',
    bgColor: 'from-slate-600 to-slate-800',
    description: 'Scrollable Citizen settings and details page with outline icons.',
    headerBg: '#FFFFFF',
    bodyBg: '#FFFFFF',
    activeTab: 'Profile',
    component: ProfileMockup,
    route: '/home/complaints/profile-mockup'
  },
  {
    id: 'profile_photo',
    name: 'Profile Photo Modal',
    theme: 'Teal + Navy Modal Scrim',
    bgColor: 'from-indigo-600 to-violet-800',
    description: 'Profile Page displaying Change Profile Photo bottom sheet overlay.',
    headerBg: '#FFFFFF',
    bodyBg: '#FFFFFF',
    activeTab: 'Profile',
    component: ProfilePhotoMockup,
    route: '/home/complaints/profile-photo-mockup'
  },
  {
    id: 'edit_profile',
    name: 'Edit Profile',
    theme: 'Teal Theme Form',
    bgColor: 'from-cyan-600 to-teal-800',
    description: 'Edit Profile form page with text inputs and orange save button.',
    headerBg: '#009688',
    bodyBg: '#FFFFFF',
    activeTab: 'Profile',
    component: EditProfileMockup,
    route: '/home/complaints/edit-profile-mockup'
  },
  {
    id: 'change_language',
    name: 'Change Language Modal',
    theme: 'Teal + Green Gradient Modal',
    bgColor: 'from-emerald-500 to-teal-700',
    description: 'Branded Splash screen showing language selection modal with 7 active options.',
    headerBg: '#009688',
    bodyBg: '#FFFFFF',
    activeTab: 'Profile',
    component: ChangeLanguageMockup,
    route: '/home/complaints/change-language-mockup'
  }
];

export function MockupsGallery() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'grid' | 'selector'>('grid');
  const [selectedMockup, setSelectedMockup] = useState('voted');

  const activeMockupObj = MOCKUP_LIST.find(m => m.id === selectedMockup) || MOCKUP_LIST[0];
  const SelectedComponent = activeMockupObj.component;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 pb-28 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Mobile Wireframes
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Citizen App Mockups</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Interactive showcase of six core mobile application screens</p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex-shrink-0">
          <button
            onClick={() => setActiveView('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'grid'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Grid View
          </button>
          <button
            onClick={() => setActiveView('selector')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'selector'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Interactive Selector
          </button>
        </div>
      </div>

      {activeView === 'grid' ? (
        /* GRID VIEW: Render all mockups side-by-side */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
          {MOCKUP_LIST.map((mockup) => {
            return (
              <div 
                key={mockup.id} 
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-6 shadow-xl w-full flex flex-col items-center group relative hover:shadow-2xl transition-all duration-300"
              >
                {/* Info Card Header */}
                <div className="w-full mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {mockup.name}
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => navigate(mockup.route)}
                      className="bg-slate-100 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl px-3 font-bold text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{mockup.theme}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium min-h-[32px]">
                    {mockup.description}
                  </p>
                </div>

                {/* Simulated Wireframe Frame Container (scaled down slightly for desktop grids) */}
                <div className="scale-90 origin-top transform -mb-16">
                  {/* Inside layout we need the component without the outside header & buttons to make it compact */}
                  <div className="w-[375px] h-[720px] rounded-[3rem] border-4 border-dashed border-blue-500 bg-white shadow-2xl flex flex-col overflow-hidden relative select-none">
                    
                    {/* Device Status Bar */}
                    <div className="h-6 bg-slate-900 text-white flex justify-between items-center px-6 text-[10px] font-medium z-10">
                      <span>9:41</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-2 border border-white/80 rounded-sm flex items-center justify-start p-0.5"><span className="w-1.5 h-full bg-white rounded-2xs"></span></span>
                      </div>
                    </div>

                    {/* Renders the internal frame contents based on component path */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {mockup.id === 'voted' && (
                        <div className="flex-1 flex flex-col h-full">
                          <div className="h-14 bg-[#6B3EE8] px-4 flex items-center justify-between text-white relative shadow-md">
                            <span className="text-xl">←</span>
                            <span className="font-extrabold text-lg absolute left-1/2 -translate-x-1/2">Voted Complaints</span>
                            <div className="w-10" />
                          </div>
                          <div className="flex-1 bg-[#F0F0F5] flex flex-col items-center justify-center p-6">
                            <div className="flex flex-col items-center text-center -mt-12">
                              <div className="w-[70px] h-[70px] rounded-full bg-purple-100 flex items-center justify-center mb-4">
                                <span className="text-2xl">👍</span>
                              </div>
                              <p className="text-sm font-bold text-slate-500">No Records Found - Yet.</p>
                            </div>
                          </div>
                          <div className="h-16 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative">
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">🏠</span><span className="text-[9px] font-bold">Home</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">🔔</span><span className="text-[9px] font-bold">Notifications</span></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-5"><div className="w-14 h-14 bg-[#00BFA5] rounded-full flex items-center justify-center shadow-lg border-4 border-white text-white font-extrabold text-xl">+</div></div>
                            <div className="w-12" />
                            <div className="flex flex-col items-center w-12 text-[#00BFA5]"><span className="text-[14px]">📄</span><span className="text-[9px] font-bold">Complaints</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">👤</span><span className="text-[9px] font-bold">Profile</span></div>
                          </div>
                        </div>
                      )}

                      {mockup.id === 'posted' && (
                        <div className="flex-1 flex flex-col h-full">
                          <div className="h-14 bg-[#009688] px-4 flex items-center justify-between text-white relative shadow-md">
                            <span className="text-xl">←</span>
                            <span className="font-extrabold text-lg absolute left-1/2 -translate-x-1/2">Posted</span>
                            <div className="w-10" />
                          </div>
                          <div className="flex-1 bg-[#F0F0F5] flex flex-col items-center justify-center p-6">
                            <div className="flex flex-col items-center text-center -mt-8">
                              <div className="grid grid-cols-2 gap-[8px] mb-6 relative">
                                <div className="w-[70px] h-[70px] bg-[#FF6D00] rounded-xl flex items-center justify-center text-white">📄</div>
                                <div className="w-[70px] h-[70px] bg-[#FF6D00] rounded-xl flex items-center justify-center text-white relative">
                                  📄
                                  <div className="absolute -top-[7px] -right-[7px] w-[22px] h-[22px] rounded-full bg-red-600 border border-white flex items-center justify-center text-white text-[11px] font-black">!</div>
                                </div>
                                <div className="w-[70px] h-[70px] bg-[#FF6D00] rounded-xl flex items-center justify-center text-white">📄</div>
                                <div className="w-[70px] h-[70px] bg-[#FF6D00] rounded-xl flex items-center justify-center text-white">📄</div>
                              </div>
                              <div className="w-[70px] h-[70px] rounded-full bg-orange-100 flex items-center justify-center mb-4"><span className="text-3xl">🤔</span></div>
                              <p className="text-sm font-bold text-slate-500">No Records Found - Yet.</p>
                            </div>
                          </div>
                          <div className="h-16 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative">
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">🏠</span><span className="text-[9px] font-bold">Home</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">🔔</span><span className="text-[9px] font-bold">Notifications</span></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-5"><div className="w-14 h-14 bg-[#00BFA5] rounded-full flex items-center justify-center shadow-lg border-4 border-white text-white font-extrabold text-xl">+</div></div>
                            <div className="w-12" />
                            <div className="flex flex-col items-center w-12 text-[#00BFA5]"><span className="text-[14px]">📄</span><span className="text-[9px] font-bold">Complaints</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">👤</span><span className="text-[9px] font-bold">Profile</span></div>
                          </div>
                        </div>
                      )}

                      {mockup.id === 'nearby' && (
                        <div className="flex-1 flex flex-col h-full">
                          <div className="h-16 bg-[#009688] px-4 flex items-center justify-between text-white relative shadow-md">
                            <div className="w-10 h-10 flex items-center justify-center bg-teal-600/50 rounded-xl">←</div>
                            <span className="font-extrabold text-lg absolute left-1/2 -translate-x-1/2">Nearby Complaints</span>
                            <div className="w-10" />
                          </div>
                          <div className="flex-1 bg-[#F0F0F5] flex flex-col items-center p-6">
                            <div className="flex flex-col items-center text-center mt-28">
                              <div className="w-[75px] h-[75px] rounded-full bg-[#B2DFDB] flex items-center justify-center mb-5">
                                <span className="text-teal-700 text-xl rotate-45">➤</span>
                              </div>
                              <p className="text-sm text-slate-500">No Records Found - Yet.</p>
                            </div>
                          </div>
                          <div className="h-16 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative">
                            <div className="flex flex-col items-center w-12 text-[#00BFA5]"><span className="text-[14px]">🏠</span><span className="text-[9px] font-bold">Home</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">🔔</span><span className="text-[9px] font-bold">Notifications</span></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-5"><div className="w-14 h-14 bg-[#00BFA5] rounded-full flex items-center justify-center shadow-lg border-4 border-white text-white font-extrabold text-xl">+</div></div>
                            <div className="w-12" />
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">📄</span><span className="text-[9px] font-bold">Complaints</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">👤</span><span className="text-[9px] font-bold">Profile</span></div>
                          </div>
                        </div>
                      )}

                      {mockup.id === 'city' && (
                        <div className="flex-1 flex flex-col h-full">
                          <div className="h-16 bg-[#1A237E] px-4 flex items-center justify-between text-white relative shadow-md">
                            <div className="w-10 h-10 flex items-center justify-center bg-[#283593] rounded-xl">←</div>
                            <span className="font-extrabold text-lg absolute left-1/2 -translate-x-1/2">City Complaints</span>
                            <div className="w-10" />
                          </div>
                          <div className="flex-1 bg-[#EEF0F5] flex flex-col items-center p-6">
                            <div className="flex flex-col items-center text-center mt-28">
                              <div className="w-[75px] h-[75px] rounded-full bg-[#DDEAF5] flex items-center justify-center mb-5">
                                <span className="text-[#1A237E] text-2xl">🏛️</span>
                              </div>
                              <p className="text-[14px] text-slate-500">No Records Found - Yet.</p>
                            </div>
                          </div>
                          <div className="h-16 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative">
                            <div className="flex flex-col items-center w-12 text-[#00BFA5]"><span className="text-[14px]">🏠</span><span className="text-[9px] font-bold">Home</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">🔔</span><span className="text-[9px] font-bold">Notifications</span></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-5"><div className="w-14 h-14 bg-[#00BFA5] rounded-full flex items-center justify-center shadow-lg border-4 border-white text-white font-extrabold text-xl">+</div></div>
                            <div className="w-12" />
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">📄</span><span className="text-[9px] font-bold">Complaints</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">👤</span><span className="text-[9px] font-bold">Profile</span></div>
                          </div>
                        </div>
                      )}

                      {mockup.id === 'activity' && (
                        <div className="flex-1 flex flex-col h-full">
                          <div className="h-16 bg-[#F15A24] px-4 flex items-center justify-between text-white relative shadow-md">
                            <div className="w-10 h-10 flex items-center justify-center bg-[#E8501A] rounded-xl">←</div>
                            <span className="font-extrabold text-lg absolute left-1/2 -translate-x-1/2">Your Activity</span>
                            <div className="w-10" />
                          </div>
                          <div className="flex-1 bg-[#F0F0F5] flex flex-col items-center p-6">
                            <div className="flex flex-col items-center text-center mt-28">
                              <div className="w-[75px] h-[75px] rounded-full bg-[#FDE8D8] flex items-center justify-center mb-5">
                                <span className="text-[#F15A24] text-2xl">👤</span>
                              </div>
                              <p className="text-[14px] text-slate-500">No Records Found - Yet.</p>
                            </div>
                          </div>
                          <div className="h-16 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative">
                            <div className="flex flex-col items-center w-12 text-[#00BFA5]"><span className="text-[14px]">🏠</span><span className="text-[9px] font-bold">Home</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">🔔</span><span className="text-[9px] font-bold">Notifications</span></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-5"><div className="w-14 h-14 bg-[#00BFA5] rounded-full flex items-center justify-center shadow-lg border-4 border-white text-white font-extrabold text-xl">+</div></div>
                            <div className="w-12" />
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">📄</span><span className="text-[9px] font-bold">Complaints</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">👤</span><span className="text-[9px] font-bold">Profile</span></div>
                          </div>
                        </div>
                      )}

                      {mockup.id === 'search' && (
                        <div className="flex-1 flex flex-col h-full">
                          <div className="h-16 bg-[#1B7A3E] px-4 flex items-center justify-between text-white relative shadow-md">
                            <div className="w-10 h-10 flex items-center justify-center bg-[#1E7D40]/60 rounded-xl">←</div>
                            <span className="font-extrabold text-lg absolute left-1/2 -translate-x-1/2">Search Complaints</span>
                            <div className="w-10" />
                          </div>
                          <div className="flex-1 bg-[#F0F0F5] flex flex-col p-4">
                            <div className="w-full mt-1.5 mb-3 px-2">
                              <div className="relative w-full h-11 bg-white border border-slate-200 rounded-full flex items-center px-4 shadow-sm text-slate-400 text-xs">
                                🔍 Search by location, category, or ID...
                              </div>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center text-center -mt-10">
                              <div className="w-[75px] h-[75px] rounded-full bg-[#DFFAED] flex items-center justify-center mb-5">
                                <span className="text-[#2E9E55] text-2xl">🔍</span>
                              </div>
                              <h4 className="text-[15px] font-semibold text-slate-700 mb-1">Search for complaints</h4>
                              <p className="text-[13px] text-slate-400 leading-tight">Enter a location, category, or ID</p>
                            </div>
                          </div>
                          <div className="h-16 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative">
                            <div className="flex flex-col items-center w-12 text-[#00BFA5]"><span className="text-[14px]">🏠</span><span className="text-[9px] font-bold">Home</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">🔔</span><span className="text-[9px] font-bold">Notifications</span></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-5"><div className="w-14 h-14 bg-[#00BFA5] rounded-full flex items-center justify-center shadow-lg border-4 border-white text-white font-extrabold text-xl">+</div></div>
                            <div className="w-12" />
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">📄</span><span className="text-[9px] font-bold">Complaints</span></div>
                            <div className="flex flex-col items-center w-12 text-slate-400"><span className="text-[14px]">👤</span><span className="text-[9px] font-bold">Profile</span></div>
                          </div>
                        </div>
                      )}

                      {mockup.id === 'profile' && (
                        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
                          {/* Top Bar */}
                          <div className="h-12 bg-white px-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0 relative">
                            <span className="font-bold text-slate-800 text-sm">Profile</span>
                            <div className="bg-[#00BFA5] text-white text-[9px] font-bold rounded-full px-2 py-0.5 flex items-center gap-0.5">
                              <span>🌐 EN</span>
                            </div>
                          </div>
                          {/* Body (Scrollable in mockup) */}
                          <div className="flex-1 bg-white overflow-y-auto px-4 py-3 text-left">
                            <div className="flex flex-col items-center mb-4">
                              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center relative mb-2">
                                <span className="text-xl">👤</span>
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#1A237E] rounded-full border border-white flex items-center justify-center text-[7px] text-white">📷</div>
                              </div>
                              <span className="font-bold text-sm">Active Citizen</span>
                              <span className="text-[10px] text-slate-400 text-center leading-tight">Post complaints in your locality</span>
                              <span className="text-[9px] text-[#F15A24] font-bold mt-1">Post a Complaint Now</span>
                              <div className="bg-[#00BFA5] text-white text-[9px] font-bold rounded-full px-2 py-0.5 mt-2">🌐 EN</div>
                            </div>
                            <div className="h-[1px] bg-slate-200 my-2" />
                            <div className="space-y-1 text-[11px] text-slate-500">
                              <div className="flex items-center gap-2"><span>📞</span><span>9392520125</span></div>
                              <div className="flex items-center gap-2"><span>✉️</span><span className="text-[#F15A24]">Add email</span></div>
                              <div className="flex items-center gap-2"><span>📍</span><span className="truncate">Kuthambakkam, TN</span></div>
                            </div>
                          </div>
                          {/* Bottom Nav */}
                          <div className="h-14 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative flex-shrink-0">
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">🏠</span><span className="text-[8px] font-bold">Home</span></div>
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">🔔</span><span className="text-[8px] font-bold">Notifications</span></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-4"><div className="w-10 h-10 bg-[#00BFA5] rounded-full flex items-center justify-center text-white font-extrabold text-sm border-2 border-white">+</div></div>
                            <div className="w-10" />
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">📄</span><span className="text-[8px] font-bold">Complaints</span></div>
                            <div className="flex flex-col items-center w-10 text-[#00BFA5]"><span className="text-xs">👤</span><span className="text-[8px] font-bold">Profile</span></div>
                          </div>
                        </div>
                      )}

                      {mockup.id === 'profile_photo' && (
                        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
                          {/* Top Bar */}
                          <div className="h-12 bg-white px-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0 relative">
                            <span className="font-bold text-slate-800 text-sm">Profile</span>
                            <div className="bg-[#00BFA5] text-white text-[9px] font-bold rounded-full px-2 py-0.5 flex items-center gap-0.5">
                              <span>🌐 EN</span>
                            </div>
                          </div>
                          {/* Body (Scrollable in mockup) */}
                          <div className="flex-1 bg-white overflow-y-auto px-4 py-3 text-left">
                            <div className="flex flex-col items-center mb-4">
                              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center relative mb-2">
                                <span className="text-xl">👤</span>
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#1A237E] rounded-full border border-white flex items-center justify-center text-[7px] text-white">📷</div>
                              </div>
                              <span className="font-bold text-sm">Active Citizen</span>
                            </div>
                            <div className="h-[1px] bg-slate-200 my-2" />
                            <div className="space-y-1 text-[11px] text-slate-500">
                              <div className="flex items-center gap-2"><span>📞</span><span>9392520125</span></div>
                            </div>
                          </div>
                          {/* Dark Scrim overlay + Bottom sheet modal */}
                          <div className="absolute inset-x-0 top-0 bottom-14 bg-black/45 z-10 flex flex-col justify-end">
                            <div className="bg-white rounded-t-[14px] shadow-lg flex flex-col w-full pb-2 px-3 py-2 text-left">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                                <span className="text-[11px] font-bold text-slate-900">Change Profile Photo</span>
                                <span className="text-[12px] text-slate-400">×</span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px]">
                                  <div className="w-6 h-6 rounded-full bg-[#00BFA5] flex items-center justify-center text-white">↑</div>
                                  <div><p className="font-bold">Upload Image</p><p className="text-slate-400 text-[8px]">From gallery</p></div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px]">
                                  <div className="w-6 h-6 rounded-full bg-[#00BFA5] flex items-center justify-center text-white">📷</div>
                                  <div><p className="font-bold">Take a Photo</p><p className="text-slate-400 text-[8px]">Use camera</p></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Bottom Nav */}
                          <div className="h-14 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative flex-shrink-0 z-20">
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">🏠</span><span className="text-[8px] font-bold">Home</span></div>
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">🔔</span><span className="text-[8px] font-bold">Notifications</span></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-4"><div className="w-10 h-10 bg-[#00BFA5] rounded-full flex items-center justify-center text-white font-extrabold text-sm border-2 border-white">+</div></div>
                            <div className="w-10" />
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">📄</span><span className="text-[8px] font-bold">Complaints</span></div>
                            <div className="flex flex-col items-center w-10 text-[#00BFA5]"><span className="text-xs">👤</span><span className="text-[8px] font-bold">Profile</span></div>
                          </div>
                        </div>
                      )}

                      {mockup.id === 'edit_profile' && (
                        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
                          {/* Header */}
                          <div className="h-12 bg-[#009688] px-3 flex items-center justify-between text-white relative shadow-sm flex-shrink-0">
                            <div className="w-8 h-8 flex items-center justify-center bg-teal-600/50 rounded-lg text-xs">←</div>
                            <span className="font-extrabold text-xs absolute left-1/2 -translate-x-1/2">Edit Profile</span>
                            <div className="w-8" />
                          </div>
                          {/* Body */}
                          <div className="flex-1 bg-white px-4 py-3 text-left space-y-2 overflow-y-auto">
                            <div className="flex flex-col text-[11px] gap-0.5">
                              <span className="text-slate-400">Full name</span>
                              <input type="text" defaultValue="Active Citizen" disabled className="h-8 border border-slate-200 rounded px-2" />
                            </div>
                            <div className="flex flex-col text-[11px] gap-0.5">
                              <span className="text-slate-400">Location</span>
                              <textarea defaultValue="Kuthambakkam, TN" disabled className="h-12 border border-slate-200 rounded px-2 py-1 resize-none" />
                            </div>
                            <div className="flex flex-col text-[11px] gap-0.5">
                              <span className="text-slate-400">Mobile number</span>
                              <input type="text" defaultValue="9392520125" disabled className="h-8 border border-slate-200 rounded px-2" />
                            </div>
                            <div className="flex flex-col text-[11px] gap-0.5">
                              <span className="text-slate-400">Email</span>
                              <input type="text" placeholder="youremail@domain.com" disabled className="h-8 border border-slate-200 rounded px-2" />
                            </div>
                            <div className="pt-1.5">
                              <div className="w-full h-8 bg-[#F15A24] text-white text-xs font-bold rounded-full flex items-center justify-center">Save</div>
                            </div>
                          </div>
                          {/* Bottom Nav */}
                          <div className="h-14 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative flex-shrink-0 z-20">
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">🏠</span><span className="text-[8px] font-bold">Home</span></div>
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">🔔</span><span className="text-[8px] font-bold">Notifications</span></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-4"><div className="w-10 h-10 bg-[#00BFA5] rounded-full flex items-center justify-center text-white font-extrabold text-sm border-2 border-white">+</div></div>
                            <div className="w-10" />
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">📄</span><span className="text-[8px] font-bold">Complaints</span></div>
                            <div className="flex flex-col items-center w-10 text-[#00BFA5]"><span className="text-xs">👤</span><span className="text-[8px] font-bold">Profile</span></div>
                          </div>
                        </div>
                      )}

                      {mockup.id === 'change_language' && (
                        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
                          {/* Branded Splash Background inside Grid */}
                          <div className="flex-1 bg-white px-4 py-3 flex flex-col items-center justify-start text-center">
                            <div className="flex items-center gap-2 mt-1 mb-2">
                              <div className="w-8 h-8 rounded-full bg-[#009688] flex items-center justify-center text-white text-xs">👁</div>
                              <span className="font-bold text-[13px]">PublicEye</span>
                            </div>
                            <p className="text-[9px] text-slate-400">आपकी आवाज़, आपका शहर</p>
                            
                            {/* Inner Selection Modal scaled down */}
                            <div className="w-full bg-gradient-to-br from-[#009688] to-[#43A047] rounded-lg p-2 mt-4 text-white text-left">
                              <div className="flex items-center justify-between text-[9px] font-bold mb-2">
                                <span>Select Language</span>
                                <span className="w-4 h-4 rounded-full border border-white/50 flex items-center justify-center text-[9px]">×</span>
                              </div>
                              <div className="bg-white rounded-md p-1 space-y-1 text-[9px] text-slate-600 text-center">
                                <div className="text-[#009688] font-bold">English ✓</div>
                                <div className="h-[1px] bg-slate-100 w-full" />
                                <div>తెలుగు</div>
                                <div className="h-[1px] bg-slate-100 w-full" />
                                <div>தமிழ்</div>
                              </div>
                            </div>
                          </div>
                          {/* Bottom Nav */}
                          <div className="h-14 bg-white border-t border-slate-200 flex justify-between items-center px-4 relative flex-shrink-0 z-20">
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">🏠</span><span className="text-[8px] font-bold">Home</span></div>
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">🔔</span><span className="text-[8px] font-bold">Notifications</span></div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-4"><div className="w-10 h-10 bg-[#00BFA5] rounded-full flex items-center justify-center text-white font-extrabold text-sm border-2 border-white">+</div></div>
                            <div className="w-10" />
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">📄</span><span className="text-[8px] font-bold">Complaints</span></div>
                            <div className="flex flex-col items-center w-10 text-slate-400"><span className="text-xs">👤</span><span className="text-[8px] font-bold">Profile</span></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Device Home Indicator Bar */}
                    <div className="h-5 bg-white flex justify-center items-center pb-1">
                      <div className="w-32 h-1 bg-slate-300 rounded-full" />
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* SELECTOR VIEW: Interactive mockup selector */
        <div className="flex flex-col xl:flex-row gap-8 items-center xl:items-start justify-center">
          
          {/* Left Panel: Sidebar selector and specifications */}
          <div className="w-full xl:w-96 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">Select a Mockup Page</h3>
              <div className="flex flex-col gap-2">
                {MOCKUP_LIST.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMockup(m.id)}
                    className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all text-sm flex items-center justify-between border ${
                      selectedMockup === m.id
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900 shadow-sm'
                        : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border-transparent'
                    }`}
                  >
                    <span>{m.name}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedMockup === m.id ? 'translate-x-1 text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Spec Details Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
              <h4 className="font-black text-sm uppercase tracking-widest text-teal-400 mb-3">Mockup Specs</h4>
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Header Theme:</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[11px]">{activeMockupObj.headerBg}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Body Background:</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[11px]">{activeMockupObj.bodyBg}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Active Nav Tab:</span>
                  <span className="font-bold text-teal-300">{activeMockupObj.activeTab}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Description:</span>
                  <p className="text-slate-300 font-medium leading-relaxed">{activeMockupObj.description}</p>
                </div>
              </div>

              <Button
                onClick={() => navigate(activeMockupObj.route)}
                className="w-full mt-6 bg-teal-600 hover:bg-teal-500 text-white rounded-xl py-2.5 font-bold shadow-lg"
              >
                Inspect Full-Screen →
              </Button>
            </div>
          </div>

          {/* Right Panel: Simulated Device View */}
          <div className="flex-1 flex justify-center bg-slate-100 dark:bg-slate-800/40 rounded-[3rem] p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
            <SelectedComponent />
          </div>

        </div>
      )}

      {/* Back button */}
      <div className="mt-12 flex justify-center">
        <Button 
          onClick={() => navigate('/home/complaints')}
          className="bg-slate-800 hover:bg-slate-700 text-white rounded-2xl px-8 py-6 font-bold shadow-lg flex items-center gap-2"
        >
          Return to Citizen Dashboard
        </Button>
      </div>

    </div>
  );
}
export default MockupsGallery;
