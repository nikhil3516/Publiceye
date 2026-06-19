import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, MapPin, X, Check, ChevronLeft, ArrowRight, Trash2, Construction, Lightbulb, Droplets, Waves, Milestone, ClipboardList, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { classifyComplaint } from '@/services/aiClassifier';
import type { AIClassificationResult } from '@/services/aiClassifier';
import { complaintService } from '@/services/complaintService';
import { useGamificationStore } from '@/store/useGamificationStore';
import { PublicEyeMap } from '@/components/Map/GoogleMap';

const CATEGORIES = [
  { id: 'garbage', name: 'Dirty Spot', icon: <Trash2 className="w-8 h-8 text-orange-500" />, description: 'Overflowing bins, illegal dumping' },
  { id: 'pothole', name: 'Road Damage', icon: <Construction className="w-8 h-8 text-amber-600" />, description: 'Road craters and surface damage' },
  { id: 'streetlight', name: 'Streetlight', icon: <Lightbulb className="w-8 h-8 text-yellow-500" />, description: 'Broken or non-working lights' },
  { id: 'water_supply', name: 'Water Leak', icon: <Droplets className="w-8 h-8 text-blue-500" />, description: 'Pipeline leaks, shortage' },
  { id: 'drainage', name: 'Drainage Issue', icon: <Waves className="w-8 h-8 text-teal-500" />, description: 'Blocked drains, overflow' },
  { id: 'roads', name: 'Traffic Issue', icon: <Milestone className="w-8 h-8 text-slate-600" />, description: 'Road damage, signal issues' },
  { id: 'public_safety', name: 'Safety Hazard', icon: <ShieldAlert className="w-8 h-8 text-red-500" />, description: 'Hazards, accidents, unsafe areas' },
  { id: 'others', name: 'Other Issue', icon: <ClipboardList className="w-8 h-8 text-indigo-500" />, description: 'Any other civic issue' },
];

export function ReportIssue() {
  const navigate = useNavigate();
  const { recordComplaint } = useGamificationStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '', 
    categoryName: '',
    description: '', 
    severity: 'medium',
    photos: [] as string[],
    location: { lat: 0, lng: 0, address: 'Main Street, Ward 12, Chennai' },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<AIClassificationResult | null>(null);
  const [submittedId, setSubmittedId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-classify when description changes
  useEffect(() => {
    if (formData.description.length > 20) {
      const result = classifyComplaint(formData.description, formData.category);
      const timer = setTimeout(() => {
        setAiResult(result);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [formData.description, formData.category]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (formData.photos.length + files.length > 3) { toast.error('Max 3 photos'); return; }
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(p => ({ ...p, photos: [...p.photos, reader.result as string] }));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!formData.description) {
        toast.error('Please provide a description');
        return;
    }
    setIsSubmitting(true);
    try {
      const complaint = await complaintService.submitComplaint({
        category: formData.category, description: formData.description,
        severity: aiResult?.severity || 'medium', photos: formData.photos, location: formData.location,
      });
      recordComplaint(aiResult?.severity || 'medium');
      setSubmittedId(complaint.id);
      setStep(3); // Success Screen
    } catch {
      toast.error('Submission failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  // SUCCESS SCREEN
  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-xl">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Submitted!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Reference: <span className="font-black text-teal-600">{submittedId}</span></p>
        
        <div className="w-full max-w-sm space-y-3">
          <Button onClick={() => navigate('/home/complaints')} className="w-full bg-teal-600 hover:bg-teal-700 h-13 rounded-2xl text-base font-black shadow-lg">Track Complaint</Button>
          <Button variant="outline" onClick={() => navigate('/home')} className="w-full h-12 rounded-2xl text-base dark:border-slate-600 dark:text-slate-300">Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Dynamic Header */}
      <div className="bg-teal-600 py-3 px-4 md:py-4 md:px-6 flex items-center gap-3 sticky top-0 z-30 shadow-md text-white">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => step > 1 ? setStep(1) : navigate('/home')} 
          className="bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8 flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-black tracking-tight truncate leading-tight">
            {step === 1 ? 'Choose Category - Post a complaint' : `${formData.categoryName}`}
          </h2>
          <p className="text-teal-50 text-[10px] font-bold uppercase tracking-wider opacity-90 leading-none mt-0.5">
            Submit
          </p>
        </div>
      </div>

      <div className={`flex-1 ${step === 1 ? 'pb-36' : ''}`}>
        {/* STEP 1: Category Selection */}
        {step === 1 && (
          <div className="p-4 md:p-6 max-w-3xl mx-auto w-full animate-in slide-in-from-right duration-300 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {CATEGORIES.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => { 
                    setFormData(p => ({ ...p, category: cat.id, categoryName: cat.name })); 
                    setStep(2); 
                  }}
                  className="p-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-5 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.98] group"
                >
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0">
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <span className="block font-black text-slate-800 dark:text-white text-lg tracking-tight">{cat.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{cat.description}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Unified Map + Details + Photo + Submit */}
        {step === 2 && (
          <div className="animate-in slide-in-from-bottom duration-500 bg-white dark:bg-slate-900 max-w-5xl mx-auto w-full">
            {/* Map Area - Horizontal Rectangle */}
            <div className="relative h-60 md:h-80 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <PublicEyeMap 
                    onLocationSelect={(lat, lng, address) => {
                        setFormData(p => ({ ...p, location: { ...p.location, lat, lng, address } }));
                    }}
                    initialLocation={formData.location.lat !== 0 ? { lat: formData.location.lat, lng: formData.location.lng } : undefined}
                />
            </div>

            {/* Compact Form Wrapper with Padding */}
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Location & Photo */}
                <div className="space-y-4">
                  {/* Select Area */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select area</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            value={formData.location.address}
                            onChange={e => setFormData(p => ({ ...p, location: { ...p.location, address: e.target.value } }))}
                            placeholder="Search address..."
                            className="h-11 pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                        />
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Add a photo</Label>
                    
                    {formData.photos.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.photos.map((p, i) => (
                          <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                            <img src={p} className="w-full h-full object-cover" />
                            <button 
                                onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, j) => j !== i) }))}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                                <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {formData.photos.length < 3 && (
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-video rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400"
                          >
                            <Camera className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-24 bg-[#1a3db1] hover:bg-[#153291] rounded-2xl flex flex-col items-center justify-center text-white gap-2 shadow-md transition-all active:scale-[0.98]"
                      >
                        <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                            <Camera className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black tracking-tight">Tap to upload photo</span>
                      </button>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple onChange={handlePhotoUpload} />
                  </div>
                </div>

                {/* Right Column: Description & Hint */}
                <div className="flex flex-col justify-between space-y-4">
                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Please provide a brief description about the complaint</Label>
                    <Textarea 
                        value={formData.description}
                        onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                        placeholder="Describe the issue..."
                        className="min-h-24 md:min-h-[148px] rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-teal-500"
                    />
                  </div>

                  {/* Status Hint */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3 text-center">
                      <p className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                          Add a description and photo to submit your complaint
                      </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 mt-6 bg-[#8c9fbd] hover:bg-teal-600 text-white rounded-xl text-base font-black shadow-md transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
