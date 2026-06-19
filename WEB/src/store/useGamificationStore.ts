import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requiredComplaints: number;
  points: number;
  color: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  complaints: number;
  badge: string;
  initials: string;
  isCurrentUser?: boolean;
}

const ALL_BADGES: Badge[] = [
  { id: 'first_report', name: 'First Step', description: 'Submit your first complaint', icon: '🌱', requiredComplaints: 1, points: 5, color: 'from-green-400 to-emerald-500' },
  { id: 'civic_hero', name: 'Civic Hero', description: 'Submit 10 verified complaints', icon: '🦸', requiredComplaints: 10, points: 50, color: 'from-blue-400 to-indigo-500' },
  { id: 'neighborhood_champion', name: 'Neighborhood Champion', description: 'Submit 25 complaints', icon: '🏆', requiredComplaints: 25, points: 150, color: 'from-amber-400 to-orange-500' },
  { id: 'city_guardian', name: 'City Guardian', description: 'Submit 50 complaints', icon: '🛡️', requiredComplaints: 50, points: 400, color: 'from-purple-400 to-pink-500' },
  { id: 'legend', name: 'Urban Legend', description: 'Submit 100 complaints', icon: '👑', requiredComplaints: 100, points: 1000, color: 'from-yellow-400 to-red-500' },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Arjun Mehta', points: 4250, complaints: 87, badge: '👑', initials: 'AM' },
  { rank: 2, name: 'Deepa Nair', points: 3820, complaints: 74, badge: '🛡️', initials: 'DN' },
  { rank: 3, name: 'Sanjay Pillai', points: 3100, complaints: 61, badge: '🛡️', initials: 'SP' },
  { rank: 4, name: 'Rekha Singh', points: 2760, complaints: 55, badge: '🏆', initials: 'RS' },
  { rank: 5, name: 'Vikram Rao', points: 2450, complaints: 48, badge: '🏆', initials: 'VR' },
  { rank: 6, name: 'Meena Joshi', points: 1980, complaints: 39, badge: '🦸', initials: 'MJ' },
  { rank: 7, name: 'Praveen Kumar', points: 1540, complaints: 30, badge: '🦸', initials: 'PK' },
  { rank: 8, name: 'Lakshmi Devi', points: 1200, complaints: 24, badge: '🦸', initials: 'LD' },
];

interface GamificationState {
  points: number;
  totalComplaints: number;
  verifiedComplaints: number;
  earnedBadges: Badge[];
  recentActivity: { action: string; points: number; timestamp: string }[];
  addPoints: (amount: number, reason: string) => void;
  recordComplaint: (severity: 'low' | 'medium' | 'high' | 'critical') => void;
  getAllBadges: () => Badge[];
  getLeaderboard: (currentUserName?: string) => LeaderboardEntry[];
  getCurrentRank: () => string;
  getNextBadge: () => Badge | null;
  getProgressToNextBadge: () => number;
}

const SEVERITY_POINTS: Record<string, number> = {
  critical: 15,
  high: 10,
  medium: 7,
  low: 5,
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      points: 2450,
      totalComplaints: 12,
      verifiedComplaints: 10,
      earnedBadges: [ALL_BADGES[0], ALL_BADGES[1]],
      recentActivity: [
        { action: 'Submitted garbage complaint', points: 10, timestamp: new Date(Date.now() - 86400000).toISOString() },
        { action: 'Issue verified resolved', points: 5, timestamp: new Date(Date.now() - 172800000).toISOString() },
        { action: 'Civic Hero badge earned', points: 50, timestamp: new Date(Date.now() - 259200000).toISOString() },
      ],

      addPoints: (amount, reason) => set(state => ({
        points: state.points + amount,
        recentActivity: [
          { action: reason, points: amount, timestamp: new Date().toISOString() },
          ...state.recentActivity.slice(0, 9),
        ],
      })),

      recordComplaint: (severity) => {
        const points = SEVERITY_POINTS[severity] || 5;
        set(state => {
          const newTotal = state.totalComplaints + 1;
          const newVerified = state.verifiedComplaints + 1;
          const newPoints = state.points + points;

          // Check for new badges
          const newBadges = ALL_BADGES.filter(b =>
            b.requiredComplaints <= newVerified &&
            !state.earnedBadges.find(eb => eb.id === b.id)
          ).map(b => ({ ...b, unlockedAt: new Date().toISOString() }));

          return {
            points: newPoints,
            totalComplaints: newTotal,
            verifiedComplaints: newVerified,
            earnedBadges: [...state.earnedBadges, ...newBadges],
            recentActivity: [
              { action: `Submitted ${severity} severity complaint`, points, timestamp: new Date().toISOString() },
              ...state.recentActivity.slice(0, 9),
            ],
          };
        });
      },

      getAllBadges: () => {
        const { earnedBadges } = get();
        return ALL_BADGES.map(b => {
          const earned = earnedBadges.find(eb => eb.id === b.id);
          return earned ? { ...b, unlockedAt: earned.unlockedAt } : b;
        });
      },

      getLeaderboard: (currentUserName) => {
        const { points, totalComplaints, earnedBadges } = get();
        const userBadge = earnedBadges[earnedBadges.length - 1]?.icon || '🌱';
        const initials = currentUserName ? currentUserName.split(' ').map(n => n[0]).join('').toUpperCase() : 'ME';
        const name = currentUserName || 'You';

        const userEntry: LeaderboardEntry = {
          rank: 0,
          name,
          points,
          complaints: totalComplaints,
          badge: userBadge,
          initials,
          isCurrentUser: true,
        };

        const allEntries = [...MOCK_LEADERBOARD, userEntry].sort((a, b) => b.points - a.points);
        return allEntries.map((e, i) => ({ ...e, rank: i + 1 }));
      },

      getCurrentRank: () => {
        const { verifiedComplaints } = get();
        if (verifiedComplaints >= 100) return 'Urban Legend';
        if (verifiedComplaints >= 50) return 'City Guardian';
        if (verifiedComplaints >= 25) return 'Neighborhood Champion';
        if (verifiedComplaints >= 10) return 'Civic Hero';
        if (verifiedComplaints >= 1) return 'Active Citizen';
        return 'New Member';
      },

      getNextBadge: () => {
        const { verifiedComplaints, earnedBadges } = get();
        return ALL_BADGES.find(b =>
          b.requiredComplaints > verifiedComplaints &&
          !earnedBadges.find(eb => eb.id === b.id)
        ) || null;
      },

      getProgressToNextBadge: () => {
        const { verifiedComplaints, earnedBadges } = get();
        const nextBadge = ALL_BADGES.find(b =>
          b.requiredComplaints > verifiedComplaints &&
          !earnedBadges.find(eb => eb.id === b.id)
        );
        if (!nextBadge) return 100;
        const prevBadge = ALL_BADGES.filter(b => b.requiredComplaints <= verifiedComplaints).pop();
        const base = prevBadge?.requiredComplaints || 0;
        return Math.round(((verifiedComplaints - base) / (nextBadge.requiredComplaints - base)) * 100);
      },
    }),
    { name: 'public-eye-gamification' }
  )
);
