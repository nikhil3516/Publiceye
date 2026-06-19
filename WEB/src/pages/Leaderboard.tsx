import React from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Trophy, Crown, Medal, Star } from 'lucide-react';

const RANK_ICONS = [Crown, Trophy, Medal];
const RANK_COLORS = [
  'from-yellow-400 to-amber-500 shadow-amber-200',
  'from-slate-300 to-slate-400 shadow-slate-200',
  'from-orange-300 to-orange-500 shadow-orange-200',
];

export function Leaderboard() {
  const { getLeaderboard } = useGamificationStore();
  const { session } = useAuthStore();
  const entries = getLeaderboard(session?.name);
  const currentUser = entries.find(e => e.isCurrentUser);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 pb-28 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-200">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">City Champions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Top civic contributors in your city</p>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-10">
          {[entries[1], entries[0], entries[2]].filter(Boolean).map((entry, i) => {
            const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd
            const actualRank = podiumOrder[i];
            const heights = ['h-28', 'h-36', 'h-24'];
            const RankIcon = RANK_ICONS[actualRank] || Star;
            return (
              <div key={entry?.rank} className={`flex flex-col items-center ${i === 1 ? 'scale-110' : ''}`}>
                <div className="text-3xl mb-2">{entry?.badge}</div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-xl bg-gradient-to-br ${RANK_COLORS[actualRank]} mb-2 ${entry?.isCurrentUser ? 'ring-4 ring-teal-400 ring-offset-2' : ''}`}>
                  {entry?.initials}
                </div>
                <p className={`text-xs font-black text-slate-700 dark:text-slate-200 text-center max-w-[80px] truncate ${entry?.isCurrentUser ? 'text-teal-600' : ''}`}>
                  {entry?.isCurrentUser ? 'You' : entry?.name?.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-400 font-bold">{entry?.points.toLocaleString()} XP</p>
                <div className={`${heights[i]} bg-gradient-to-t ${RANK_COLORS[actualRank]} rounded-t-2xl w-full mt-2 flex items-start justify-center pt-2 shadow-lg min-w-[64px]`}>
                  <RankIcon className="w-5 h-5 text-white/80" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-50 dark:border-slate-700">
            <h3 className="font-black text-slate-900 dark:text-white">Full Rankings</h3>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700">
            {entries.map(entry => (
              <div
                key={entry.rank}
                className={`flex items-center gap-4 p-5 transition-colors ${entry.isCurrentUser
                  ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${entry.rank <= 3
                  ? `bg-gradient-to-br ${RANK_COLORS[entry.rank - 1]} text-white`
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                  {entry.rank}
                </div>

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0 ${entry.isCurrentUser ? 'bg-teal-600' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
                  {entry.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm truncate ${entry.isCurrentUser ? 'text-teal-700 dark:text-teal-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {entry.isCurrentUser ? `${entry.name} (You)` : entry.name}
                  </p>
                  <p className="text-xs text-slate-400">{entry.complaints} complaints · {entry.badge}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={`font-black text-base ${entry.isCurrentUser ? 'text-teal-600' : 'text-slate-900 dark:text-slate-200'}`}>
                    {entry.points.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Position */}
        {currentUser && (
          <div className="mt-6 bg-gradient-to-r from-teal-600 to-teal-700 rounded-[2rem] p-6 text-white shadow-2xl shadow-teal-200">
            <p className="text-xs text-teal-100 font-black uppercase tracking-widest mb-1">Your Position</p>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black">Rank #{currentUser.rank}</h3>
                <p className="text-teal-100 text-sm">{currentUser.points.toLocaleString()} XP · {currentUser.complaints} complaints</p>
              </div>
              <div className="text-5xl">{currentUser.badge}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
