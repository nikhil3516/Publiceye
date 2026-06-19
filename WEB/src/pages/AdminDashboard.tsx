import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { complaintService } from '@/services/complaintService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LayoutDashboard, Users, MessageSquare,
  Download, Search, CheckCircle2, Clock,
  Eye, ShieldAlert, Bot, Star, LogOut, BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { getAllOfficers } from '@/services/aiClassifier';

const STATS = [
  { label: 'Total Complaints', value: '1,284', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: '+18 today' },
  { label: 'Pending Resolution', value: '432', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', trend: '-5 from yesterday' },
  { label: 'Resolved Monthly', value: '852', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', trend: '66% rate' },
  { label: 'Active Citizens', value: '5,420', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: '+142 this month' },
  { label: 'Escalated', value: '12', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', trend: 'Needs attention' },
  { label: 'AI Classified', value: '1,241', icon: Bot, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20', trend: '96.7% auto-classified' },
];

const SEV_BADGE: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'officers'>('overview');
  const [search, setSearch] = useState('');
  const officers = getAllOfficers();

  const { data: complaints } = useQuery({
    queryKey: ['complaints'],
    queryFn: () => complaintService.getComplaints(),
  });

  const filtered = complaints?.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const escalated = complaints?.filter(c => c.isEscalated) || [];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black">PublicEye</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Portal</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: 'Overview', icon: LayoutDashboard, tab: 'overview' },
            { label: 'Complaints', icon: MessageSquare, tab: 'complaints' },
            { label: 'Officers', icon: Users, tab: 'officers' },
          ].map(item => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === item.tab ? 'bg-teal-500/20 text-teal-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
              {item.label === 'Complaints' && escalated.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{escalated.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-1">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="text-lg font-black text-slate-800 dark:text-white capitalize">{activeTab}</h2>
          <div className="flex items-center gap-3">
            {escalated.length > 0 && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl px-3 py-1.5 text-xs font-black animate-pulse">
                <ShieldAlert className="w-4 h-4" /> {escalated.length} Escalated
              </div>
            )}
            <Button variant="outline" size="sm" className="gap-2 dark:border-slate-600 dark:text-slate-300" onClick={() => toast.success('Report exported!')}>
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              {/* Escalation Alert */}
              {escalated.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-[2rem] p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-red-700 dark:text-red-400">{escalated.length} complaint(s) escalated due to SLA breach</p>
                    <p className="text-red-500 dark:text-red-500 text-xs mt-0.5">Immediate action required · Auto-notified senior authority</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-xl" onClick={() => setActiveTab('complaints')}>
                    Review
                  </Button>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {STATS.map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-2xl ${stat.bg}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div className="text-green-600 dark:text-green-400 font-bold text-[10px] uppercase tracking-wider">{stat.trend}</div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Category Breakdown Mini */}
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                <h3 className="font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-teal-600" /> Resolution Overview
                </h3>
                <div className="space-y-3">
                  {[
                    { cat: 'Garbage', pct: 91, color: 'bg-orange-500' },
                    { cat: 'Streetlights', pct: 96, color: 'bg-yellow-500' },
                    { cat: 'Potholes', pct: 83, color: 'bg-slate-600' },
                    { cat: 'Drainage', pct: 81, color: 'bg-blue-500' },
                  ].map(b => (
                    <div key={b.cat} className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 w-28">{b.cat}</span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.pct}%` }} />
                      </div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300 w-8 text-right">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* COMPLAINTS TAB */}
          {activeTab === 'complaints' && (
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h3 className="font-black text-slate-900 dark:text-white">All Complaints</h3>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                    className="pl-10 rounded-xl border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white h-10" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700/50 text-[10px] uppercase tracking-widest text-slate-400 font-black">
                      {['ID', 'Title', 'Ward', 'Severity', 'Status', 'Officer', 'Date', ''].map(h => (
                        <th key={h} className="px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                    {(filtered || []).map(c => (
                      <tr key={c.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${c.isEscalated ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                        <td className="px-5 py-3.5 text-xs font-black text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1">
                            {c.isEscalated && <ShieldAlert className="w-3.5 h-3.5 text-red-500" />}
                            {c.id}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 max-w-[180px]">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{c.title}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            {c.aiClassification && <><Bot className="w-3 h-3 text-violet-500" /> AI: {c.aiClassification.confidenceScore}%</>}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400">W{c.location.ward}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${SEV_BADGE[c.severity] || ''}`}>{c.severity}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                            <div className={`w-2 h-2 rounded-full ${c.status === 'resolved' || c.status === 'closed' ? 'bg-green-500' : c.status === 'escalated' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                          {c.authority?.name || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3.5">
                          <Button variant="ghost" size="sm" className="rounded-xl text-xs font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                            onClick={() => toast.info(`Viewing ${c.id}`)}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-5 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Showing {filtered?.length || 0} results</p>
              </div>
            </div>
          )}

          {/* OFFICERS TAB */}
          {activeTab === 'officers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {officers.map(officer => (
                <div key={officer.id} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {officer.photoInitials}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white">{officer.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{officer.department}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{officer.zone}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Resolution Rate</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{officer.resolutionRate}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${officer.resolutionRate >= 90 ? 'bg-teal-500' : officer.resolutionRate >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                          style={{ width: `${officer.resolutionRate}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= Math.round(officer.resolutionRate / 20) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 dark:text-slate-600'}`} />
                        ))}
                      </div>
                      <button
                        onClick={() => toast.success(`Calling ${officer.name}...`)}
                        className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        {officer.contact}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
