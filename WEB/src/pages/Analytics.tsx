import React, { useState } from 'react';
import {
  BarChart2, TrendingUp, Clock, CheckCircle2, Users,
  MapPin, Flame, ChevronUp, ChevronDown, Star
} from 'lucide-react';

const CATEGORY_STATS = [
  { category: 'Garbage', total: 342, resolved: 310, avgDays: 1.2, icon: '🗑️', color: 'from-orange-400 to-red-500', trend: +12 },
  { category: 'Potholes', total: 218, resolved: 180, avgDays: 3.8, icon: '🕳️', color: 'from-slate-500 to-slate-700', trend: -5 },
  { category: 'Streetlights', total: 156, resolved: 149, avgDays: 1.5, icon: '💡', color: 'from-yellow-400 to-amber-500', trend: +8 },
  { category: 'Drainage', total: 203, resolved: 165, avgDays: 4.2, icon: '💧', color: 'from-blue-400 to-cyan-500', trend: +3 },
  { category: 'Water Supply', total: 89, resolved: 72, avgDays: 2.1, icon: '🚿', color: 'from-teal-400 to-emerald-500', trend: +6 },
  { category: 'Roads', total: 276, resolved: 220, avgDays: 5.5, icon: '🚧', color: 'from-purple-400 to-indigo-500', trend: -2 },
];

const OFFICER_STATS = [
  { name: 'Kavitha Reddy', dept: 'Public Safety', resolved: 48, total: 50, initials: 'KR', color: 'from-teal-500 to-emerald-600' },
  { name: 'Amit Verma', dept: 'Electrical', resolved: 44, total: 47, initials: 'AV', color: 'from-yellow-500 to-amber-600' },
  { name: 'Rajesh Kumar', dept: 'Sanitation', resolved: 128, total: 140, initials: 'RK', color: 'from-orange-500 to-red-600' },
  { name: 'Sunita Patel', dept: 'Water Supply', resolved: 41, total: 46, initials: 'SP', color: 'from-blue-500 to-cyan-600' },
  { name: 'Priya Sharma', dept: 'Roads & Infra', resolved: 87, total: 102, initials: 'PS', color: 'from-purple-500 to-indigo-600' },
];

const TRENDING = [
  { issue: 'Open Manholes Near Market', count: 8, severity: 'high', area: 'Ward 12' },
  { issue: 'Waterlogging at Main Rd', count: 15, severity: 'high', area: 'Ward 7' },
  { issue: 'Street Light Outage', count: 12, severity: 'medium', area: 'Ward 4' },
  { issue: 'Garbage Bin Overflow', count: 23, severity: 'medium', area: 'Ward 9' },
  { issue: 'Pothole Cluster Zone', count: 19, severity: 'high', area: 'Ward 3' },
];

const HEATMAP_WARDS = [
  { ward: '1', count: 12, level: 1 },{ ward: '2', count: 28, level: 3 },{ ward: '3', count: 45, level: 5 },
  { ward: '4', count: 19, level: 2 },{ ward: '5', count: 8, level: 1 },{ ward: '6', count: 33, level: 4 },
  { ward: '7', count: 52, level: 5 },{ ward: '8', count: 16, level: 2 },{ ward: '9', count: 38, level: 4 },
  { ward: '10', count: 24, level: 3 },{ ward: '11', count: 11, level: 1 },{ ward: '12', count: 47, level: 5 },
  { ward: '13', count: 21, level: 2 },{ ward: '14', count: 9, level: 1 },{ ward: '15', count: 35, level: 4 },
  { ward: '16', count: 18, level: 2 },
];

const HEAT_COLORS = ['bg-green-100', 'bg-yellow-200', 'bg-orange-300', 'bg-red-400', 'bg-red-600'];

export function Analytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const totalComplaints = CATEGORY_STATS.reduce((s, c) => s + c.total, 0);
  const totalResolved = CATEGORY_STATS.reduce((s, c) => s + c.resolved, 0);
  const avgResolutionDays = (CATEGORY_STATS.reduce((s, c) => s + c.avgDays, 0) / CATEGORY_STATS.length).toFixed(1);
  const overallRate = Math.round((totalResolved / totalComplaints) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 pb-28 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Public Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Transparency report for your city</p>
          </div>
          <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-sm border border-slate-100 dark:border-slate-700 w-fit">
            {(['7d', '30d', '90d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${timeRange === t ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {t === '7d' ? 'Week' : t === '30d' ? 'Month' : 'Quarter'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Complaints', value: totalComplaints.toLocaleString(), icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: '+18 this week' },
            { label: 'Resolved', value: totalResolved.toLocaleString(), icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', trend: `${overallRate}% rate` },
            { label: 'Avg. Resolution', value: `${avgResolutionDays}d`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', trend: 'vs 4.1d last month' },
            { label: 'Active Citizens', value: '5,420', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: '+142 this month' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
              <div className="text-xs text-teal-600 font-bold mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />{stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl p-8">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Resolution by Category</h2>
          <div className="space-y-5">
            {CATEGORY_STATS.map(stat => {
              const rate = Math.round((stat.resolved / stat.total) * 100);
              return (
                <div key={stat.category} className="flex items-center gap-4">
                  <div className="text-2xl w-8 text-center flex-shrink-0">{stat.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{stat.category}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {stat.trend > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {Math.abs(stat.trend)}%
                        </span>
                        <span className="text-xs font-black text-slate-400">{stat.resolved}/{stat.total} · {stat.avgDays}d avg</span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 w-10 text-right">{rate}%</span>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Officer Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center">
                <Star className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Officer Performance</h2>
                <p className="text-xs text-slate-400">Resolution rates by officer</p>
              </div>
            </div>
            <div className="space-y-4">
              {OFFICER_STATS.map((officer, i) => {
                const rate = Math.round((officer.resolved / officer.total) * 100);
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${officer.color} flex items-center justify-center text-white font-black text-xs flex-shrink-0`}>
                      {officer.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{officer.name}</span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 ml-2">{rate}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${officer.color} transition-all duration-1000`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{officer.dept} · {officer.resolved}/{officer.total} resolved</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complaint Heatmap by Ward */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Complaint Heatmap</h2>
                <p className="text-xs text-slate-400">Density by ward (darker = more issues)</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {HEATMAP_WARDS.map(w => (
                <div
                  key={w.ward}
                  className={`${HEAT_COLORS[w.level - 1]} rounded-xl p-3 text-center cursor-pointer hover:scale-105 transition-transform group relative`}
                  title={`Ward ${w.ward}: ${w.count} complaints`}
                >
                  <div className="text-xs font-black text-slate-700">W{w.ward}</div>
                  <div className="text-[10px] font-bold text-slate-600">{w.count}</div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-xl">
                    <span className="text-[10px] font-black text-white bg-black/50 px-1 rounded">{w.count} issues</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 font-bold">Low</span>
              <div className="flex gap-1">
                {HEAT_COLORS.map((c, i) => (
                  <div key={i} className={`w-6 h-3 rounded ${c}`} />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-bold">High</span>
            </div>
          </div>
        </div>

        {/* Trending Issues */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Trending Issues</h2>
              <p className="text-xs text-slate-400">Most reported problems this week</p>
            </div>
          </div>
          <div className="space-y-3">
            {TRENDING.map((t, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="w-8 h-8 bg-white dark:bg-slate-600 rounded-xl flex items-center justify-center font-black text-slate-700 dark:text-slate-200 text-sm shadow-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{t.issue}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{t.area}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${t.severity === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                    {t.severity}
                  </span>
                  <div className="flex items-center gap-1 text-orange-500 font-black text-sm">
                    <Flame className="w-4 h-4" />{t.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
