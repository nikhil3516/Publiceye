import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { Eye, Star, FileText, Users, ChevronRight, BarChart2, Trophy, Zap, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

const BANNERS = [
  { title: "PublicEye — Your Voice Matters", subtitle: "Together we build a better city", color: "from-teal-500 to-emerald-600" },
  { title: "Join 5,420+ Active Citizens", subtitle: "Report issues and track resolution live", color: "from-indigo-500 to-blue-700" },
  { title: "Our Clean City, Our Responsibility", subtitle: "Building a sustainable community", color: "from-orange-500 to-red-600" },
];

const QUICK_ACTIONS = [
  { title: "Report Issue", desc: "Submit civic problems", icon: Eye, color: "from-teal-500 to-teal-700", path: "/home/report" },
  { title: "Track Complaint", desc: "Monitor your reports", icon: FileText, color: "from-slate-700 to-slate-900", path: "/home/complaints" },
  { title: "Analytics", desc: "City-wide statistics", icon: BarChart2, color: "from-indigo-500 to-blue-700", path: "/home/analytics" },
  { title: "Leaderboard", desc: "Top contributors", icon: Trophy, color: "from-amber-400 to-orange-500", path: "/home/leaderboard" },
  { title: "Rewards", desc: "Your badges & XP", icon: Star, color: "from-purple-500 to-pink-600", path: "/home/rewards" },
  { title: "Community", desc: "Latest city updates", icon: Users, color: "from-emerald-500 to-teal-600", path: "/home/notifications" },
];

export function Home() {
  const { session } = useAuthStore();
  const { points, totalComplaints, earnedBadges, getCurrentRank, getNextBadge, getProgressToNextBadge } = useGamificationStore();
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentBanner(p => (p + 1) % BANNERS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentRank = getCurrentRank();
  const nextBadge = getNextBadge();
  const progress = getProgressToNextBadge();
  const latestBadge = earnedBadges[earnedBadges.length - 1];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 pb-28 animate-in fade-in duration-500">

      {/* Mobile Header */}
      <div className="flex md:hidden justify-between items-center pt-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{getGreeting()} 👋</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{session?.name}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/home/change-language')}
          className="rounded-full bg-teal-500 text-white hover:bg-teal-600 hover:text-white border-none px-4"
        >EN</Button>
      </div>

      {/* Desktop Welcome */}
      <div className="hidden md:block">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">{getGreeting()}, {session?.name}!</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Here's what's happening in your community today.</p>
      </div>

      {/* Rotating Banner */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-white transition-all duration-700 bg-gradient-to-br ${BANNERS[currentBanner].color} min-h-[200px] md:min-h-[260px] flex flex-col justify-center`}>
        <div className="relative z-10 space-y-3 max-w-2xl">
          <h3 className="text-2xl md:text-4xl font-black leading-tight tracking-tighter">{BANNERS[currentBanner].title}</h3>
          <p className="text-white/90 text-base md:text-lg font-medium">{BANNERS[currentBanner].subtitle}</p>
          <div className="pt-3 hidden md:block">
            <Button onClick={() => navigate('/home/report')} className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 font-bold shadow-xl">
              <Plus className="w-4 h-4 mr-2" /> Report an Issue
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
        <div className="absolute bottom-6 left-8 md:left-12 flex gap-3">
          {BANNERS.map((_, i) => (
            <div key={i} onClick={() => setCurrentBanner(i)} className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${currentBanner === i ? 'w-10 bg-white' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* Gamification + Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* XP Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-teal-200/40 dark:shadow-teal-900/40 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
          </div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl border border-white/20 flex-shrink-0">
              {latestBadge?.icon || '🌱'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-teal-100 text-xs font-black uppercase tracking-[0.2em] mb-0.5">{currentRank}</p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-black">{points.toLocaleString()}</span>
                <span className="text-teal-100 text-sm font-bold">XP</span>
                <span className="text-teal-100 text-sm">·</span>
                <span className="text-sm font-bold text-teal-100">{totalComplaints} reports</span>
              </div>
              {nextBadge && (
                <>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-teal-100 font-medium">
                    {progress}% to <span className="font-bold">{nextBadge.icon} {nextBadge.name}</span>
                  </p>
                </>
              )}
            </div>
            <button onClick={() => navigate('/home/rewards')} className="flex-shrink-0 bg-white/20 hover:bg-white/30 transition-colors rounded-2xl px-4 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-1">
              View <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* City Stats Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-6 shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider">City Live Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Reports', val: '1,284', icon: TrendingUp },
                { label: 'Resolved', val: '852', icon: Zap },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-3">
                  <s.icon className="w-4 h-4 text-teal-400 mb-1" />
                  <div className="text-xl font-black">{s.val}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/home/analytics')} className="mt-4 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10 rounded-xl w-full font-bold py-2.5 text-sm">
            View Analytics →
          </button>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-xl font-black text-slate-900 dark:text-white">Quick Actions</h4>
          <span onClick={() => navigate('/home/leaderboard')} className="text-sm text-teal-600 font-bold cursor-pointer hover:underline flex items-center gap-1">
            <Trophy className="w-4 h-4" /> Leaderboard
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-5">
          {QUICK_ACTIONS.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className={`bg-gradient-to-br ${item.color} rounded-[2rem] p-6 shadow-lg text-white transform transition-all hover:scale-[1.03] hover:-translate-y-1 active:scale-95 cursor-pointer flex flex-col h-full group`}
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md group-hover:bg-white/30 transition-colors">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-base mb-1 tracking-tight">{item.title}</h4>
              <p className="text-xs opacity-80 leading-relaxed">{item.desc}</p>
              <div className="mt-auto pt-5 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Report Button (Mobile) */}
      <button
        onClick={() => navigate('/home/report')}
        className="md:hidden fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl shadow-2xl shadow-teal-300/50 flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-transform border-4 border-white"
      >
        <Plus className="w-8 h-8 text-white" strokeWidth={3} />
      </button>
    </div>
  );
}
