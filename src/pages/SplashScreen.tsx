import { useEffect, useState } from 'react';
import logo from '@/assets/wells-fargo-logo.png';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3500;
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(timer);
          onComplete();
          return 100;
        }
        return prev + step;
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen w-full wf-gradient flex flex-col items-center justify-center px-6 py-12 relative">
      <h1 className="sr-only">Wells Fargo Online & Mobile Banking</h1>
      <div className="animate-fade-up flex flex-col items-center text-center">
        <img
          src={logo}
          alt="Wells Fargo"
          className="w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 object-contain mb-6 drop-shadow-md"
        />
        <p className="text-white/90 text-sm sm:text-base font-medium tracking-wide">
          Personal & Premier Banking
        </p>
      </div>

      <div className="w-36 sm:w-48 h-1.5 bg-white/20 rounded-full overflow-hidden mt-8">
        <div
          className="h-full bg-secondary rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="mt-8 px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        Continue to Sign On
      </button>
    </div>
  );
};

export default SplashScreen;
