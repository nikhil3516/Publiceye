import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await authService.sendOtp(email);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const valid = await authService.verifyOtp(email, otp);
      if (valid) setStep(3);
      else setError('Invalid OTP');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await authService.resetPassword(email, newPassword);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Create a new password"}
          </p>
        </div>

        {error && <div className="text-sm text-red-500 text-center">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-teal-600">Send OTP</Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/login')} className="w-full">Back to Login</Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input id="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-teal-600">Verify OTP</Button>
            <Button type="button" variant="ghost" onClick={() => setStep(1)} className="w-full">Back</Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-teal-600">Reset Password</Button>
          </form>
        )}
      </div>
    </div>
  );
}
