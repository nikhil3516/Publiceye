import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, Bell, Plus, FileText, User, LogOut, Settings, HelpCircle, Eye, Sun, Moon, BarChart2, Trophy } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { Button } from '@/components/ui/button';

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, session } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { points, earnedBadges } = useGamificationStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Bell, label: 'Notifications', path: '/home/notifications' },
    { icon: Plus, label: 'Report', path: '/home/report', isCenter: true },
    { icon: FileText, label: 'Complaints', path: '/home/complaints' },
    { icon: User, label: 'Profile', path: '/home/profile' },
  ];

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/home' },
    { icon: Bell, label: 'Notifications', path: '/home/notifications' },
    { icon: FileText, label: 'My Issues', path: '/home/complaints' },
    { icon: BarChart2, label: 'Analytics', path: '/home/analytics' },
    { icon: Trophy, label: 'Leaderboard', path: '/home/leaderboard' },
    { icon: User, label: 'Profile', path: '/home/profile' },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };
  const latestBadge = earnedBadges[earnedBadges.length - 1];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row relative">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 sticky top-0 h-screen z-30">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
              <Eye className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">PublicEye</h1>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {sidebarItems.map((item, i) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/home' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.label === 'Notifications' && (
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
          {/* XP Mini Card */}
          <div
            onClick={() => navigate('/home/rewards')}
            className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-4 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-3 text-white">
              <span className="text-2xl">{latestBadge?.icon || '🌱'}</span>
              <div>
                <p className="text-xs text-teal-100 font-black uppercase tracking-wider">Your XP</p>
                <p className="font-black text-lg">{points.toLocaleString()} pts</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center font-black text-teal-700 dark:text-teal-400 text-sm border border-teal-200 dark:border-teal-800">
              {session?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{session?.name || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session?.email}</p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-1">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
              <HelpCircle className="w-4 h-4" /> Help Center
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors mt-1"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 px-8 items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Dashboard</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white font-semibold capitalize">
              {location.pathname.split('/').pop() || 'Home'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <div
              className="relative cursor-pointer"
              onClick={() => navigate('/home/notifications')}
            >
              <Bell className="w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
            </div>
            <Button
              onClick={() => navigate('/home/report')}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-5 h-9 font-bold text-sm shadow-md shadow-teal-200"
            >
              <Plus className="w-4 h-4 mr-1" /> Report Issue
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto w-full">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 px-6 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.07)] rounded-t-[2rem] z-50">
        <div className="flex justify-between items-center relative max-w-md mx-auto">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/home' && location.pathname.startsWith(item.path));

            if (item.isCenter) {
              return (
                <div key={i} className="flex flex-col items-center justify-center relative -top-7">
                  <button
                    onClick={() => navigate(item.path)}
                    className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-300/40 transform transition-all hover:scale-105 active:scale-95 border-4 border-white dark:border-slate-800"
                  >
                    <item.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-12 gap-1.5 transition-all duration-200 ${isActive ? 'text-teal-600 dark:text-teal-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-teal-500'}`}
              >
                <div className="relative">
                  <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {item.label === 'Notifications' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </div>
                <span className={`text-[10px] tracking-tight ${isActive ? 'font-black' : 'font-medium'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
