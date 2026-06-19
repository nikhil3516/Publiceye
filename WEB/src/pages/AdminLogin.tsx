import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ArrowRight, Eye, ShieldAlert, KeyRound, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Security Clearance Verified");
      navigate('/admin/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-[#0a0c10] via-transparent to-[#0a0c10] z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back Button */}
        <button 
          onClick={() => navigate('/portal')}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Exit Secure Zone</span>
        </button>

        <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-teal-500/10 rounded-[2rem] flex items-center justify-center border border-teal-500/20">
                <Eye className="w-10 h-10 text-teal-500" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-teal-500/20 rounded-[2.5rem] scale-125"
              />
            </div>
            
            <div className="px-4 py-1.5 bg-teal-500/10 rounded-full border border-teal-500/20 mb-4">
              <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Secure Administrator Access
              </span>
            </div>
            
            <h2 className="text-3xl font-black text-white tracking-tight">Authority Portal</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Verify your credentials to manage municipal services</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId" className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1">Official Identity ID</Label>
                <div className="relative">
                  <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <Input 
                    id="adminId" 
                    required 
                    className="bg-slate-950/50 border-slate-800 text-white h-14 pl-12 rounded-2xl focus:ring-teal-500 focus:border-teal-500 transition-all font-mono placeholder:text-slate-700" 
                    placeholder="ADM-XXXXX-XXXX" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passkey" className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1">Master Security Key</Label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <Input 
                    id="passkey" 
                    type="password" 
                    required 
                    className="bg-slate-950/50 border-slate-800 text-white h-14 pl-12 rounded-2xl focus:ring-teal-500 focus:border-teal-500 transition-all font-mono placeholder:text-slate-700" 
                    placeholder="••••••••••••" 
                  />
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-teal-600 hover:bg-teal-500 h-16 rounded-2xl text-lg font-black transition-all shadow-[0_0_30px_rgba(20,184,166,0.2)] group"
            >
              {loading ? 'Decrypting...' : 'Initiate Secure Session'} 
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em] font-black">
              Protected by PublicEye Firewall v4.2
            </p>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-pulse delay-75"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500/30 animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
