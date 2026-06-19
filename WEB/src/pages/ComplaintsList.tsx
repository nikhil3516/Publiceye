import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { complaintService } from '@/services/complaintService';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, ThumbsUp, ChevronRight, Bot, ShieldAlert, Plus, Smartphone } from 'lucide-react';
import { ComplaintCardSkeleton } from '@/components/Skeletons';

const CATEGORY_ICONS: Record<string, string> = {
  garbage: '🗑️', pothole: '🕳️', streetlight: '💡', drainage: '💧',
  road_damage: '🚧', roads: '🚧', water_supply: '🚿', public_safety: '⚠️', others: '📋',
};

const STATUS_STYLES: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  classified: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  assigned: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  in_progress: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  escalated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const SEVERITY_DOT: Record<string, string> = {
  low: 'bg-blue-400', medium: 'bg-yellow-400', high: 'bg-orange-500', critical: 'bg-red-600',
};

const TABS = ['All', 'In Progress', 'Resolved', 'Escalated'];

export function ComplaintsList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'severity' | 'votes'>('date');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const { data: complaints, isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: () => complaintService.getComplaints(),
  });

  const filteredComplaints = complaints?.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.ward.includes(searchQuery);

    if (activeTab === 'In Progress') return matchesSearch && c.status === 'in_progress';
    if (activeTab === 'Resolved') return matchesSearch && (c.status === 'resolved' || c.status === 'closed');
    if (activeTab === 'Escalated') return matchesSearch && c.isEscalated;
    return matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'votes') return b.upvoteCount - a.upvoteCount;
    if (sortBy === 'severity') {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 pb-28 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Public Issues</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{complaints?.length || 0} total reports in your city</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/home/complaints/mockups')}
            variant="outline"
            className="border border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/25 rounded-2xl font-bold flex items-center gap-2 h-10 px-4"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Wireframe Mockups</span>
            <span className="sm:hidden">Mockups</span>
          </Button>
          <Button
            onClick={() => navigate('/home/report')}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow-lg shadow-teal-200/40 flex items-center gap-2 h-10 px-4"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">New Report</span>
          </Button>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search by ID, title, or ward..."
            className="pl-12 h-12 md:h-13 bg-white dark:bg-slate-800 border-none shadow-sm dark:shadow-slate-900 rounded-2xl focus:ring-2 focus:ring-teal-500 text-base dark:text-white dark:placeholder:text-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="h-12 bg-white dark:bg-slate-800 border-none shadow-sm rounded-2xl px-4 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-teal-500 cursor-pointer min-w-[140px]"
        >
          <option value="date">Sort: Latest</option>
          <option value="severity">Sort: Severity</option>
          <option value="votes">Sort: Most Voted</option>
        </select>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${activeTab === tab
              ? 'bg-teal-600 text-white shadow-md shadow-teal-200/40'
              : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700'
              } ${tab === 'Escalated' ? 'border border-red-200 dark:border-red-900' : ''}`}
          >
            {tab === 'Escalated' && <span className="mr-1.5">🚨</span>}
            {tab}
            {tab === 'Escalated' && (
              <span className="ml-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {complaints?.filter(c => c.isEscalated).length || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading ? (
          <>{[1,2,3,4].map(i => <ComplaintCardSkeleton key={i} />)}</>
        ) : filteredComplaints && filteredComplaints.length > 0 ? (
          filteredComplaints.map(complaint => (
            <div
              key={complaint.id}
              onClick={() => navigate(`/home/complaints/${complaint.id}`)}
              className={`bg-white dark:bg-slate-800 rounded-[2rem] p-5 border-2 transform transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] cursor-pointer group ${complaint.isEscalated ? 'border-red-200 dark:border-red-900/60' : 'border-slate-100 dark:border-slate-700'}`}
            >
              {/* Top Row */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors flex-shrink-0">
                  {CATEGORY_ICONS[complaint.category] || '📋'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{complaint.id}</span>
                    {complaint.isEscalated && (
                      <span className="flex items-center gap-0.5 text-[10px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                        <ShieldAlert className="w-3 h-3" /> ESCALATED
                      </span>
                    )}
                    {complaint.aiClassification && (
                      <span className="flex items-center gap-0.5 text-[10px] font-black text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full">
                        <Bot className="w-3 h-3" /> AI {complaint.aiClassification.confidenceScore}%
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2">{complaint.title}</h4>
                </div>
              </div>

              {/* Severity + Status */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider ${STATUS_STYLES[complaint.status] || ''}`}>
                  {complaint.status.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${SEVERITY_DOT[complaint.severity]}`} />
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">{complaint.severity}</span>
                </div>
              </div>

              {/* SLA Mini Progress */}
              {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                <div className="mb-4">
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        new Date(complaint.slaDeadline).getTime() < now
                          ? 'bg-red-500'
                          : 'bg-teal-500'
                      }`}
                      style={{
                        width: `${Math.min(100, ((now - new Date(complaint.createdAt).getTime()) / (new Date(complaint.slaDeadline).getTime() - new Date(complaint.createdAt).getTime())) * 100)}%`
                      }}
                    />
                  </div>
                  {new Date(complaint.slaDeadline).getTime() < now && (
                    <p className="text-[10px] text-red-500 font-bold mt-1">SLA Deadline Breached</p>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-500" /> Ward {complaint.location.ward}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <ThumbsUp className="w-3.5 h-3.5" /> {complaint.upvoteCount}
                  </span>
                </div>
                <div className="text-teal-600 dark:text-teal-400 flex items-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  View <ChevronRight className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 shadow-xl rounded-[2rem] flex items-center justify-center mb-5">
              <Search className="w-9 h-9 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No results found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs">Try a different search term or filter.</p>
            <Button variant="link" className="mt-4 text-teal-600 font-bold" onClick={() => { setSearchQuery(''); setActiveTab('All'); }}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
