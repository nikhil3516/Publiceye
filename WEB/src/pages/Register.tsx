import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.register(name, email, password);
      toast.success("Account created successfully! Please login.");
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 shadow-lg shadow-teal-100 mb-6">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Join the PublicEye community today</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" placeholder="citizen@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="h-12 rounded-xl pr-12"
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="h-12 rounded-xl pr-12"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg font-bold border border-red-100">{error}</div>}

          <div>
            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 text-lg font-bold shadow-xl shadow-teal-100 transition-all active:scale-95">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>
          
          <div className="text-center text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Already have an account? </span>
            <button type="button" onClick={() => navigate('/login')} className="font-bold text-teal-600 hover:text-teal-500">
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
