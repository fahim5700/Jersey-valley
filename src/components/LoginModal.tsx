import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { User, Chrome } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginModal() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome to Jersey Valley!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    // Keep mock for now or replace with Google
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('otp');
        toast.info("OTP sent to your phone (Mock)");
      }
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate('/dashboard')}
        className="relative group"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="profile" className="w-6 h-6 rounded-full border border-zinc-800" />
        ) : (
          <User className="w-5 h-5 text-primary" />
        )}
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[400px] rounded-none border-zinc-900 bg-zinc-950 p-10">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase text-center">
            MEMBER ACCESS
          </DialogTitle>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] text-center mt-2">
            Join the elite valley
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            variant="outline"
            className="w-full rounded-none h-14 text-[10px] font-bold uppercase tracking-widest border-zinc-800 hover:bg-zinc-900 gap-4"
          >
            <Chrome className="w-4 h-4" />
            {loading ? 'CONNECTING...' : 'CONTINUE WITH GOOGLE'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-900" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase tracking-widest font-bold">
              <span className="bg-zinc-950 px-4 text-zinc-600">OR MOBILE ACCESS</span>
            </div>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mobile Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="017XXXXXXXX" 
                required 
                className="rounded-none border-zinc-800 bg-zinc-900 h-12"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-none h-12 text-xs font-bold uppercase tracking-widest">
              {loading ? 'SENDING...' : 'SEND OTP'}
            </Button>
          </form>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-900 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest leading-relaxed">
            By continuing, you agree to Jersey Valley's <br />
            <span className="text-primary cursor-pointer underline">Terms of Service</span> and <span className="text-primary cursor-pointer underline">Privacy Policy</span>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
