import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { complaintService } from '@/services/complaintService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft, Share2, MapPin, Clock, Phone, User, ThumbsUp,
  AlertTriangle, CheckCircle2, Star, Bot, ShieldAlert, Timer, Camera, Navigation
} from 'lucide-react';
import { toast } from 'sonner';
import { PublicEyeMap } from '@/components/Map/GoogleMap';

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  classified: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  assigned: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  in_progress: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  closed: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  escalated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const SEVERITY_GRADIENT: Record<string, string> = {
  low: "from-blue-500 to-blue-700",
  medium: "from-yellow-500 to-orange-500",
  high: "from-orange-500 to-red-500",
  critical: "from-red-600 to-red-800",
};

const CATEGORY_EMOJI: Record<string, string> = {
  garbage: '🗑️', pothole: '🕳️', streetlight: '💡', water_supply: '🚿',
  drainage: '💧', roads: '🚧', public_safety: '⚠️', others: '📋',
};

export function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const { data: complaint, isLoading } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintService.getComplaintById(id!),
    enabled: !!id,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleRatingSubmit = async () => {
    if (!rating) return toast.error("Please select a star rating");
    setSubmittingRating(true);
    await complaintService.submitCitizenRating(id!, rating, feedback);
    queryClient.invalidateQueries({ queryKey: ['complaint', id] });
    toast.success("Thank you for your feedback!");
    setSubmittingRating(false);
  };

  const handleConfirmResolved = async () => {
    toast.success("Resolution confirmed! +5 XP earned 🎉");
  };

  const handleReopen = async () => {
    toast.info("Complaint reopened. The authority has been notified.");
  };

  if (isLoading) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Loading complaint details...</p>
    </div>
  );
  if (!complaint) return (
    <div className="p-8 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Complaint not found</h3>
    </div>
  );

  const timeLeft = new Date(complaint.slaDeadline).getTime() - now;
  const isSlaBreached = timeLeft < 0;
  const slaHoursTotal = complaint.severity === 'critical' ? 2 : complaint.severity === 'high' ? 24 : complaint.severity === 'medium' ? 72 : 168;
  const elapsed = (now - new Date(complaint.createdAt).getTime()) / 3600000;
  const progressPercent = Math.min(100, Math.max(0, (elapsed / slaHoursTotal) * 100));

  const hoursLeft = Math.abs(Math.floor(timeLeft / 3600000));
  const minutesLeft = Math.abs(Math.floor((timeLeft % 3600000) / 60000));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 pb-28 md:pb-12">
      {/* Hero Image */}
      <div className="relative h-56 md:h-80 bg-slate-200 overflow-hidden md:rounded-b-[4rem]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=1200"
          alt="Issue"
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 md:top-6 left-4 md:left-8 right-4 md:right-8 flex justify-between items-start z-20">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/40">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex gap-2">
            {complaint.isEscalated && (
              <div className="bg-red-500/90 backdrop-blur-md text-white rounded-2xl px-4 py-2 flex items-center gap-2 text-xs font-black uppercase animate-pulse">
                <ShieldAlert className="w-4 h-4" /> Escalated
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={handleShare} className="bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/40">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 md:bottom-10 left-4 md:left-10 z-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl drop-shadow-lg">{CATEGORY_EMOJI[complaint.category] || '📋'}</span>
            <span className={`text-xs px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-xl ${STATUS_COLORS[complaint.status]}`}>
              {complaint.status.replace('_', ' ')}
            </span>
            <span className={`text-xs px-3 py-1.5 rounded-full font-black uppercase text-white bg-gradient-to-r ${SEVERITY_GRADIENT[complaint.severity]} shadow-lg`}>
              {complaint.severity}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md max-w-lg">{complaint.title}</h2>
          <div className="flex items-center gap-4 text-white/80 font-medium text-sm">
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Ward {complaint.location.ward}</div>
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(complaint.createdAt).toLocaleDateString()}</div>
            <div className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" /> {complaint.upvoteCount} votes</div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 -mt-6 md:-mt-10 relative z-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6">

            {/* AI Classification Badge */}
            {complaint.aiClassification && (
              <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-[2rem] p-6 shadow-2xl shadow-purple-200/40 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-base">AI Classification</p>
                    <p className="text-purple-200 text-xs">PublicEye Intelligence Engine</p>
                  </div>
                  <div className="ml-auto bg-white/20 rounded-xl px-3 py-1.5 text-xs font-black">
                    {complaint.aiClassification.confidenceScore}% confidence
                  </div>
                </div>
                <p className="text-purple-100 text-sm leading-relaxed mb-4">{complaint.aiClassification.aiSummary}</p>
                <div className="flex flex-wrap gap-2">
                  {complaint.aiClassification.keywords.map((kw, i) => (
                    <span key={i} className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">#{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Issue Details */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Issue Details</h3>
                <span className="text-xs font-black text-slate-300 dark:text-slate-500 uppercase tracking-[0.2em]">{complaint.id}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base mb-6">{complaint.description}</p>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                {[
                  { label: "Category", val: complaint.category.replace('_', ' ') },
                  { label: "Severity", val: complaint.severity, color: complaint.severity === 'critical' || complaint.severity === 'high' ? 'text-red-600' : 'text-orange-500' },
                  { label: "Ward", val: `Ward ${complaint.location.ward}` },
                  { label: "Votes", val: `${complaint.upvoteCount} upvotes` },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.label}</span>
                    <span className={`font-bold text-slate-900 dark:text-white capitalize ${item.color || ''}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA Countdown */}
            <div className={`rounded-[2rem] p-6 md:p-8 shadow-2xl text-white relative overflow-hidden ${isSlaBreached ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${isSlaBreached ? 'bg-white/20' : 'bg-teal-500/20'}`}>
                      {isSlaBreached ? <ShieldAlert className="w-6 h-6 text-red-300" /> : <Timer className="w-6 h-6 text-teal-400" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-black">SLA Countdown</h3>
                      <p className={`text-xs font-bold ${isSlaBreached ? 'text-red-200' : 'text-slate-400'}`}>
                        {slaHoursTotal}h resolution window
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest ${isSlaBreached ? 'bg-white/20 text-red-200' : 'bg-teal-500/20 text-teal-300'}`}>
                    {isSlaBreached ? '⚠️ SLA Breached' : '✅ On Track'}
                  </span>
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl font-black font-mono tabular-nums">
                    {isSlaBreached ? `+${hoursLeft}h ${minutesLeft}m overdue` : `${hoursLeft}h ${minutesLeft}m`}
                  </div>
                  <p className="text-white/60 text-sm mt-1">{isSlaBreached ? 'Overdue' : 'Remaining'}</p>
                </div>

                <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${isSlaBreached ? 'bg-red-400' : progressPercent > 80 ? 'bg-orange-400' : 'bg-teal-400'}`}
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-white/40">
                  <span>REPORTED: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  <span>DEADLINE: {new Date(complaint.slaDeadline).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Escalation History */}
            {complaint.escalationHistory && complaint.escalationHistory.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-[2rem] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="font-black text-red-700 dark:text-red-400">Escalation History</h3>
                </div>
                {complaint.escalationHistory.map((esc, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-bold text-red-700 dark:text-red-300">{esc.reason}</p>
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">Escalated to: {esc.escalatedTo} · {new Date(esc.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Issue Location Map */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" /> Issue Location
              </h3>
              <div className="h-64 md:h-80 w-full rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                <PublicEyeMap 
                  interactive={true}
                  showRouteButton={true}
                  initialLocation={{ lat: complaint.location.lat, lng: complaint.location.lng }}
                  markers={[{ id: complaint.id, lat: complaint.location.lat, lng: complaint.location.lng, title: complaint.title }]}
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 font-medium flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-600" /> 
                {complaint.location.address || "Location pinned on map"}
              </p>
            </div>

            {/* Before/After Photos */}
            {complaint.resolvedPhoto && (
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-teal-600" /> Before / After
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400" alt="Before" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg">BEFORE</div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100">
                    <img src={complaint.resolvedPhoto} alt="After" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-black px-2 py-1 rounded-lg">AFTER</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Live Timeline</h3>
              <div className="space-y-6">
                {complaint.timeline.map((item, index) => {
                  const isLatest = index === complaint.timeline.length - 1;
                  return (
                    <div key={index} className="flex gap-5 relative">
                      {index !== complaint.timeline.length - 1 && (
                        <div className="absolute left-[13px] top-8 bottom-0 w-[2px] bg-slate-100 dark:bg-slate-700" />
                      )}
                      <div className={`w-7 h-7 rounded-full flex-shrink-0 z-10 flex items-center justify-center border-4 border-white dark:border-slate-800 ${isLatest ? 'bg-teal-500 shadow-lg shadow-teal-200 scale-125' : 'bg-slate-200 dark:bg-slate-600'}`}>
                        {isLatest ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-bold text-sm ${isLatest ? 'text-teal-600 dark:text-teal-400' : 'text-slate-800 dark:text-slate-200'}`}>{item.status}</h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-2 flex-shrink-0">{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 leading-relaxed">{item.note}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-slate-400" />
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.actor}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Authority Card */}
            {complaint.authority && (
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Assigned Official</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
                    {complaint.authority.photoInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">{complaint.authority.name}</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{complaint.authority.dept}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${complaint.authority.resolutionRate}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-teal-600">{complaint.authority.resolutionRate}% resolve rate</span>
                    </div>
                  </div>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 w-12 p-0 shadow-lg flex-shrink-0"
                    onClick={() => window.open(`tel:${complaint.authority?.contact}`)}
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Citizen Verification + Rating */}
            {complaint.status === 'resolved' && !complaint.citizenRating && (
              <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-teal-200/40 text-white">
                <h3 className="text-xl font-black mb-2">Issue Resolved?</h3>
                <p className="text-teal-100 text-sm mb-6">Please verify and rate the resolution quality.</p>

                {/* Star Rating */}
                <div className="flex gap-3 mb-5 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-125 active:scale-95"
                    >
                      <Star className={`w-10 h-10 ${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'} transition-colors`} />
                    </button>
                  ))}
                </div>

                <Textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Share your experience (optional)..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-teal-200 rounded-2xl mb-4 resize-none"
                  rows={3}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleConfirmResolved}
                    className="bg-white text-teal-700 hover:bg-teal-50 h-12 rounded-2xl font-black"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleReopen}
                    className="bg-teal-700/40 hover:bg-teal-700 text-white h-12 rounded-2xl font-black border border-white/10"
                  >
                    Still Pending
                  </Button>
                </div>

                {rating > 0 && (
                  <Button
                    disabled={submittingRating}
                    onClick={handleRatingSubmit}
                    className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 h-12 rounded-2xl font-black shadow-lg"
                  >
                    <Star className="w-4 h-4 mr-2 fill-yellow-900" /> Submit {rating}-Star Rating
                  </Button>
                )}
              </div>
            )}

            {/* Existing Rating Display */}
            {complaint.citizenRating && (
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Citizen Verification</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-6 h-6 ${s <= (complaint.citizenRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200">{complaint.citizenRating}/5 Stars</span>
                </div>
                {complaint.citizenFeedback && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{complaint.citizenFeedback}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
