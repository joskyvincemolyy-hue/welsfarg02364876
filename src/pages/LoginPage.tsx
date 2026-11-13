import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, X, CreditCard, Compass } from 'lucide-react';
import logo from '@/assets/wells-fargo-logo.png';
import heroBg from '@/assets/images/hero_financial_district_1794591896682.jpg';

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [infoModal, setInfoModal] = useState<'forgot' | 'products' | 'points' | null>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'safepal320@gmail.com' && password === 'TH23875L73') {
      setError('');
      onLogin();
    } else {
      setError('Invalid email/username or password. Please check your credentials.');
    }
  };

  const fillDemo = () => {
    setUsername('safepal320@gmail.com');
    setPassword('TH23875L73');
    setError('');
    setInfoModal(null);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col lg:grid lg:grid-cols-12">
      {/* Left Desktop Showcase Column */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative overflow-hidden bg-zinc-950 flex-col justify-between p-10 xl:p-14">
        <img
          src={heroBg}
          alt="Financial district skyline at golden hour"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/45" />

        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="Wells Fargo" className="w-12 h-12 object-contain" />
          <span className="text-white text-xl font-bold tracking-tight">Wells Fargo</span>
        </div>

        <div className="relative z-10 max-w-xl space-y-6">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight [text-wrap:balance]">
            Banking built for clarity on every screen you use.
          </h2>
          <p className="text-zinc-200 text-base leading-relaxed">
            Manage checking, savings, cards, and domestic or international wire transfers from desktop, tablet, or phone with real-time security monitoring.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">256-Bit Encryption</p>
                <p className="text-xs text-zinc-300 mt-0.5">Multi-factor OTP & PIN transfer protection</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">24/7 Fraud Protection</p>
                <p className="text-xs text-zinc-300 mt-0.5">Instant card freeze & real-time alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sign-In Column */}
      <div className="flex-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-between bg-card min-h-screen">
        <div className="flex items-center justify-between px-6 sm:px-10 pt-6 lg:pt-8">
          <div className="flex items-center gap-3 lg:hidden">
            <img src={logo} alt="Wells Fargo" className="w-11 h-11 object-contain" />
            <span className="font-bold text-lg text-foreground">Wells Fargo</span>
          </div>
          <span className="hidden lg:inline-block text-xs font-medium text-muted-foreground">
            Online Banking Sign On
          </span>
          <button
            type="button"
            onClick={() => setInfoModal('forgot')}
            className="text-xs font-semibold text-primary hover:underline min-h-[40px] px-2 cursor-pointer"
          >
            Need help signing on?
          </button>
        </div>

        <div className="w-full max-w-md mx-auto px-6 sm:px-8 py-8 flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="sr-only">Secure Online Banking Login</h1>
            <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{greeting}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Sign on to manage your accounts, transfers, and cards.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="wf-username" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Email / Username
              </label>
              <input
                id="wf-username"
                type="text"
                autoComplete="username"
                placeholder="Enter email or username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-3 min-h-[46px] rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-base transition-colors"
              />
            </div>

            <div>
              <label htmlFor="wf-password" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="wf-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-3 min-h-[46px] pr-16 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-base transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer min-h-[40px]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span>Remember username</span>
              </label>
              <button
                type="button"
                onClick={() => setInfoModal('forgot')}
                className="text-xs sm:text-sm text-primary font-semibold hover:underline cursor-pointer"
              >
                Forgot credentials?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 min-h-[48px] bg-secondary text-secondary-foreground font-bold rounded-xl text-base hover:brightness-95 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
            >
              Sign On
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={() => setInfoModal('products')}
              className="bg-primary text-primary-foreground rounded-xl py-3.5 px-4 min-h-[48px] flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Explore Products</span>
            </button>
            <button
              type="button"
              onClick={() => setInfoModal('points')}
              className="bg-primary text-primary-foreground rounded-xl py-3.5 px-4 min-h-[48px] flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold hover:opacity-95 transition-opacity cursor-pointer"
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Earn More Points</span>
            </button>
          </div>
        </div>

        <footer className="bg-muted/70 border-t border-border px-6 sm:px-10 py-5">
          <p className="text-xs font-semibold text-primary mb-2">Other Services</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span>Corporations & Institutions</span>
            <span>Insights & Economics</span>
            <span>Institutional Investing</span>
            <span>Commercial Real Estate</span>
            <span>Security Center</span>
            <span>Member FDIC</span>
          </div>
        </footer>
      </div>

      {/* Interactive Helper Dialog */}
      {infoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {infoModal === 'forgot'
                  ? 'Sign-On Credentials'
                  : infoModal === 'products'
                    ? 'Personal & Premier Products'
                    : 'Visa Signature Rewards'}
              </h3>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                aria-label="Close dialog"
                className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {infoModal === 'forgot' && (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Use the account credentials below to access the banking portal:</p>
                <div className="bg-muted rounded-xl p-4 space-y-1.5 font-mono text-xs text-foreground">
                  <p>Email / Username: <span className="font-bold">safepal320@gmail.com</span></p>
                  <p>Password: <span className="font-bold">TH23875L73</span></p>
                  <p>OTP Code: <span className="font-bold">4375</span></p>
                  <p>Transfer PIN: <span className="font-bold">7339</span></p>
                </div>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="w-full py-2.5 min-h-[44px] bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 cursor-pointer"
                >
                  Auto-fill Sign On Form
                </button>
              </div>
            )}

            {infoModal === 'products' && (
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border">
                  <p className="font-semibold text-foreground">Everyday Checking</p>
                  <p className="text-xs mt-1">Zero monthly fee options with instant debit controls and mobile deposit.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border">
                  <p className="font-semibold text-foreground">Way2Save Savings</p>
                  <p className="text-xs mt-1">Automated savings transfers and competitive interest tiers.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border">
                  <p className="font-semibold text-foreground">Premier Relationship</p>
                  <p className="text-xs mt-1">Higher daily wire limits and dedicated advisory access.</p>
                </div>
              </div>
            )}

            {infoModal === 'points' && (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Earn 2x cash rewards on travel, dining, and everyday purchases with your Wells Fargo Visa Signature card.</p>
                <p className="text-xs">Redeem points directly for statement credits, travel bookings, or direct checking deposits.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
