import { useState, useEffect, useRef } from 'react';
import { Phone, Smartphone, CheckCircle2 } from 'lucide-react';

const OTPVerification = ({ onVerify }: { onVerify: () => void }) => {
  const [step, setStep] = useState<'animate' | 'input'>('animate');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [resentMsg, setResentMsg] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setStep('input'), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (step === 'input') {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  const handleChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) {
      const next = [...otp];
      next[index] = '';
      setOtp(next);
      return;
    }
    if (digits.length > 1) {
      const next = [...otp];
      digits.slice(0, 4).split('').forEach((d, idx) => {
        if (index + idx < 4) next[index + idx] = d;
      });
      setOtp(next);
      const focusIdx = Math.min(3, index + digits.length);
      inputRefs.current[focusIdx]?.focus();
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = digits;
    setOtp(newOtp);
    if (digits && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const code = otp.join('');
    if (code === '4375') {
      setError('');
      onVerify();
    } else {
      setError('Invalid verification code. Please enter 4375.');
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    setResentMsg(true);
    setError('');
    window.setTimeout(() => setResentMsg(false), 3000);
  };

  if (step === 'animate') {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Smartphone className="w-11 h-11 text-primary" />
          </div>
          <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-primary/40 animate-pulse-ring" />
          <div
            className="absolute inset-0 w-24 h-24 rounded-full border-2 border-primary/20 animate-pulse-ring"
            style={{ animationDelay: '0.5s' }}
          />
        </div>
        <h1 className="mt-6 text-xl font-bold text-foreground animate-fade-up">
          Sending verification code...
        </h1>
        <p className="mt-2 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Delivering SMS passcode to your registered mobile device
        </p>
        <button
          type="button"
          onClick={() => setStep('input')}
          className="mt-6 text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          Enter code now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Verify Your Identity</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Enter the 4-digit code sent to your phone number ending in <span className="font-semibold text-foreground">***57</span>
        </p>

        <div className="flex gap-3 sm:gap-4 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              aria-label={`Digit ${i + 1}`}
              maxLength={4}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold font-mono border-2 border-border rounded-xl bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors tabular-nums"
            />
          ))}
        </div>

        {error && (
          <p role="alert" className="text-destructive text-sm font-medium mb-4">
            {error}
          </p>
        )}

        {resentMsg && (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>A new verification code has been sent.</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={otp.some((d) => !d)}
          className="w-full py-3 min-h-[48px] bg-primary text-primary-foreground font-semibold rounded-xl text-base hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          Verify & Continue
        </button>

        <p className="mt-5 text-sm text-muted-foreground">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            className="text-primary font-semibold hover:underline cursor-pointer"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
