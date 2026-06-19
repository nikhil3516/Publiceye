import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const session = await authService.login(email, password);
      login(session, remember);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2000" 
          alt="City Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <button 
            onClick={() => navigate('/portal')}
            className="mb-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Back to Portals</span>
          </button>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl border border-white/20 dark:border-slate-800/50">
            <div className="text-center mb-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-teal-500 shadow-xl shadow-teal-500/30 mb-6">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">User Login</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Access your personal city dashboard</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-600 dark:text-slate-300 font-bold ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-12 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-teal-500 text-slate-900 dark:text-slate-100 font-medium"
                      placeholder="citizen@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-600 dark:text-slate-300 font-bold ml-1">Secure Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 pl-12 pr-12 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-teal-500 text-slate-900 dark:text-slate-100 font-medium"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={remember}
                    onCheckedChange={(c) => setRemember(c as boolean)}
                    className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <Label htmlFor="remember-me" className="text-sm font-semibold text-slate-600 dark:text-slate-300">Remember me</Label>
                </div>
                <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-500">
                  Forgot Password?
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-lg font-bold shadow-xl shadow-teal-200 transition-all active:scale-95"
              >
                {loading ? 'Authenticating...' : 'Sign In Now'}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-slate-500 dark:text-slate-400 font-bold mb-4">New to PublicEye?</p>
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-teal-600/20 text-teal-600 font-black hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors"
                onClick={() => navigate('/register')}
              >
                Register Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
