import React, { useState } from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Zap, CheckCircle2, Clock, Lock } from 'lucide-react';

export function Rewards() {
  const { points, verifiedComplaints, totalComplaints, earnedBadges, recentActivity, getAllBadges, getCurrentRank, getNextBadge, getProgressToNextBadge } = useGamificationStore();
  const { session } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'badges' | 'activity'>('badges');

  const allBadges = getAllBadges();
  const currentRank = getCurrentRank();
  const nextBadge = getNextBadge();
  const progress = getProgressToNextBadge();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 pb-28 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">

        {/* Hero Stats Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 p-8 mb-8 shadow-2xl shadow-teal-200/40 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-black rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl shadow-xl border border-white/20">
              {earnedBadges[earnedBadges.length - 1]?.icon || '🌱'}
            </div>
            <div className="flex-1">
              <p className="text-teal-100 text-xs font-black uppercase tracking-[0.25em] mb-1">Current Rank</p>
              <h2 className="text-3xl font-black tracking-tight mb-1">{currentRank}</h2>
              <p className="text-teal-100 font-medium">{session?.name || 'Citizen'} · {verifiedComplaints} verified complaints</p>
            </div>
            <div className="flex gap-6 md:text-right">
              <div>
                <div className="text-4xl font-black">{points.toLocaleString()}</div>
                <div className="text-teal-100 text-xs font-bold uppercase tracking-wider">Total XP</div>
              </div>
              <div>
                <div className="text-4xl font-black">{totalComplaints}</div>
                <div className="text-teal-100 text-xs font-bold uppercase tracking-wider">Reports</div>
              </div>
            </div>
          </div>

          {/* Progress to next badge */}
          {nextBadge && (
            <div className="relative z-10 mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-teal-100">
                  Next: <span className="text-white">{nextBadge.icon} {nextBadge.name}</span>
                </span>
                <span className="text-sm font-black text-white">{progress}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-teal-100 mt-1 font-medium">
                {nextBadge.requiredComplaints - verifiedComplaints} more complaints to unlock
              </p>
            </div>
          )}
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 mb-8 bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-sm border border-slate-100 dark:border-slate-700">
          {(['badges', 'activity'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm capitalize transition-all ${activeTab === tab ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              {tab === 'badges' ? '🏅 Badges' : '⚡ Activity Log'}
            </button>
          ))}
        </div>

        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allBadges.map(badge => {
              const isEarned = !!badge.unlockedAt;
              return (
                <div
                  key={badge.id}
                  className={`rounded-[2rem] p-6 border transition-all duration-300 ${isEarned
                    ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-xl hover:-translate-y-1 hover:shadow-2xl'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-dashed border-slate-200 dark:border-slate-700 opacity-60'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${isEarned ? `bg-gradient-to-br ${badge.color} shadow-lg` : 'bg-slate-100 dark:bg-slate-700'}`}>
                      {isEarned ? badge.icon : <Lock className="w-7 h-7 text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-slate-900 dark:text-white">{badge.name}</h4>
                        {isEarned && <CheckCircle2 className="w-4 h-4 text-teal-500" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{badge.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-lg">
                          +{badge.points} XP
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {badge.requiredComplaints} reports needed
                        </span>
                      </div>
                      {isEarned && badge.unlockedAt && (
                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          Earned {new Date(badge.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">Recent Activity</h3>
              <p className="text-sm text-slate-500 mt-1">Your civic contribution history</p>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
              {recentActivity.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-bold">No activity yet. Submit a complaint to earn points!</p>
                </div>
              ) : (
                recentActivity.map((act, i) => (
                  <div key={i} className="flex items-center gap-5 p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{act.action}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(act.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-teal-600">+{act.points}</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">XP</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
