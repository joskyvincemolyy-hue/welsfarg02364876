import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  History,
  Lock,
  LogOut,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';

const defaultProfilePhoto = '/assets/aistudio/PHOTO-2026-11-11-12-59-01_82eea4b0.jpg';

const ProfilePage = ({
  onNavigate,
  onLogout,
}: {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}) => {
  const { userName, profile, accountNumber, routingNumber } = useBanking();
  const profilePhoto = profile.avatarUrl || defaultProfilePhoto;

  const menuItems = [
    { icon: CreditCard, label: 'Manage Cards', desc: 'View and manage your cards', page: 'manage-cards' },
    { icon: Shield, label: 'Security Center', desc: 'Password, biometrics, 2FA', page: 'security-center' },
    { icon: Bell, label: 'Notifications', desc: 'Alerts and preferences', page: 'notification-settings' },
    { icon: FileText, label: 'Statements', desc: 'Download account statements', page: 'statements' },
    { icon: Globe, label: 'Wire Transfers', desc: 'International wire settings', page: 'wire-transfers' },
    { icon: Smartphone, label: 'App Preferences', desc: 'Theme, language & balance privacy', page: 'mobile-settings' },
    { icon: Lock, label: 'Privacy', desc: 'Data sharing & privacy', page: 'privacy' },
    { icon: History, label: 'Transaction History', desc: 'All account activity', page: 'transaction-history' },
    { icon: HelpCircle, label: 'Help & Support', desc: 'Contact us, FAQ', page: 'help-support' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          aria-label="Go back"
          className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Profile & Settings</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage personal details, security, and preferences
          </p>
        </div>
      </div>

      {/* Member Banner */}
      <button
        type="button"
        onClick={() => onNavigate('account-details')}
        className="w-full bg-card border border-border rounded-2xl p-5 sm:p-6 flex items-center gap-4 text-left hover:border-primary/40 transition-colors active:scale-[0.99] cursor-pointer"
      >
        <img
          src={profilePhoto}
          alt={userName}
          referrerPolicy="no-referrer"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">{userName}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Premier Account Member</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground font-mono tabular-nums">
            <span>Account: {accountNumber}</span>
            <span>Routing: {routingNumber}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
      </button>

      {/* Responsive Grid of Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.page)}
              className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 text-left hover:border-primary/40 transition-colors active:scale-[0.99] cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Sign Out */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full sm:w-auto sm:min-w-[240px] bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-3 text-destructive hover:bg-destructive/5 transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
          <LogOut className="w-5 h-5" />
        </div>
        <span className="text-sm font-semibold">Sign Out</span>
      </button>
    </div>
  );
};

export default ProfilePage;
