import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Settings, Award, History, Globe, Shield, HelpCircle,
  LogOut, ChevronRight, Camera, Trophy, Zap, TrendingUp
} from 'lucide-react';

export function Profile() {
  const { session, logout } = useAuthStore();
  const {
    points, totalComplaints, verifiedComplaints, earnedBadges,
    getCurrentRank, getNextBadge, getProgressToNextBadge
  } = useGamificationStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const currentRank = getCurrentRank();
  const nextBadge = getNextBadge();
  const progress = getProgressToNextBadge();

  const menuItems = [
    { icon: History, label: 'My Complaints', sub: 'Track all your reports', path: '/home/complaints', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { icon: Award, label: 'Rewards & Badges', sub: 'View your achievements', path: '/home/rewards', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
    { icon: Trophy, label: 'Leaderboard', sub: 'See city rankings', path: '/home/leaderboard', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { icon: TrendingUp, label: 'Analytics', sub: 'City transparency data', path: '/home/analytics', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    { icon: Globe, label: 'Change Language', sub: 'App language settings', path: '/home/change-language', color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
    { icon: Shield, label: 'Privacy Policy', sub: 'Data & privacy', path: '/home/privacy', color: 'text-slate-500 bg-slate-50 dark:bg-slate-800' },
    { icon: HelpCircle, label: 'Help & Support', sub: 'Get assistance', path: '/home/help', color: 'text-slate-500 bg-slate-50 dark:bg-slate-800' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 pb-28 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto w-full space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Profile</h2>
          <Button variant="ghost" size="icon" className="bg-white dark:bg-slate-800 shadow-sm rounded-xl h-10 w-10 border border-slate-100 dark:border-slate-700">
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Button>
        </div>

        {/* Profile Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-teal-200/40 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-black text-white">
                  {session?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 bg-white text-teal-700 p-2 rounded-2xl shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-teal-100 text-xs font-black uppercase tracking-[0.2em] mb-1">{currentRank}</p>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-1">{session?.name}</h3>
              <p className="text-teal-100 font-medium text-sm mb-4">{session?.email}</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-sm h-9 px-4"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </div>

            {/* XP Stats */}
            <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-2 md:text-right">
              {[
                { label: 'XP Points', val: points.toLocaleString(), icon: Zap },
                { label: 'Reports', val: totalComplaints, icon: History },
                { label: 'Badges', val: earnedBadges.length, icon: Award },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center">
                  <s.icon className="w-4 h-4 mx-auto mb-1 text-teal-200" />
                  <div className="text-xl font-black">{s.val}</div>
                  <div className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Badge Progress */}
          {nextBadge && (
            <div className="relative z-10 mt-6 pt-6 border-t border-white/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-teal-100">
                  Next Badge: <span className="text-white font-black">{nextBadge.icon} {nextBadge.name}</span>
                </span>
                <span className="text-sm font-black">{progress}%</span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                  style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-teal-100 mt-1.5 font-medium">
                {nextBadge.requiredComplaints - verifiedComplaints} more verified complaints to unlock
              </p>
            </div>
          )}
        </div>

        {/* Earned Badges Row */}
        {earnedBadges.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 dark:text-white">Your Badges</h3>
              <button onClick={() => navigate('/home/rewards')} className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {earnedBadges.map((badge, i) => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {badge.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 text-center max-w-[64px] leading-tight">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="p-6 border-b border-slate-50 dark:border-slate-700">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Account</h3>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-bold text-slate-800 dark:text-slate-200 text-sm">{item.label}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{item.sub}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[2rem] p-6">
          <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-3">Danger Zone</p>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-900/40 rounded-2xl h-12"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out of PublicEye
          </Button>
        </div>
      </div>
    </div>
  );
}
