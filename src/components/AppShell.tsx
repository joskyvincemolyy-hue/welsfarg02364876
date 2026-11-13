import { ReactNode } from 'react';
import {
  Home,
  BarChart3,
  ArrowUpRight,
  Headphones,
  User,
  Bell,
  Eye,
  EyeOff,
  Moon,
  Sun,
  CreditCard,
  History,
  FileText,
  LogOut,
} from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import logo from '@/assets/wells-fargo-logo.png';

const defaultProfileAvatar = '/assets/aistudio/PHOTO-2026-11-11-12-59-01_82eea4b0.jpg';

interface AppShellProps {
  currentScreen: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  children: ReactNode;
}

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: Home },
  { id: 'transfer', label: 'Transfer Money', icon: ArrowUpRight },
  { id: 'transaction-history', label: 'Transactions', icon: History },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'manage-cards', label: 'Manage Cards', icon: CreditCard },
  { id: 'statements', label: 'Statements', icon: FileText },
  { id: 'help-support', label: 'Help & Support', icon: Headphones },
  { id: 'profile', label: 'Profile & Settings', icon: User },
];

const SCREEN_TITLES: Record<string, string> = {
  dashboard: 'Account Overview',
  transfer: 'Transfer Money',
  'transaction-history': 'Transaction History',
  analytics: 'Financial Analytics',
  'card-details': 'Card & Account Details',
  'manage-cards': 'Manage Cards',
  statements: 'Account Statements',
  'wire-transfers': 'Wire Transfers',
  'security-center': 'Security Center',
  'notification-settings': 'Notification Preferences',
  notifications: 'Notifications',
  'mobile-settings': 'App Preferences',
  privacy: 'Privacy & Data',
  'account-details': 'Account Details',
  'help-support': 'Help & Support',
  support: 'Help & Support',
  profile: 'Profile & Settings',
};

const MOBILE_BOTTOM_TABS = new Set(['dashboard', 'analytics', 'support', 'help-support', 'profile']);

export default function AppShell({ currentScreen, onNavigate, onLogout, children }: AppShellProps) {
  const { userName, profile, settings, updateSetting, notifications } = useBanking();
  const profileAvatar = profile.avatarUrl || defaultProfileAvatar;
  const unreadCount = notifications.filter((n) => n.unread).length;
  const pageTitle = SCREEN_TITLES[currentScreen] ?? 'Wells Fargo';
  const showMobileBottomBar = MOBILE_BOTTOM_TABS.has(currentScreen);

  const isActive = (id: string) => {
    if (id === 'help-support' && (currentScreen === 'support' || currentScreen === 'help-support')) return true;
    if (id === 'manage-cards' && (currentScreen === 'manage-cards' || currentScreen === 'card-details')) return true;
    if (
      id === 'profile' &&
      [
        'profile',
        'account-details',
        'security-center',
        'notification-settings',
        'wire-transfers',
        'mobile-settings',
        'privacy',
      ].includes(currentScreen)
    ) {
      return true;
    }
    return currentScreen === id;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 shrink-0 bg-card border-r border-border sticky top-0 h-screen">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-border">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <img src={logo} alt="Wells Fargo" className="w-9 h-9 object-contain shrink-0" />
            <span className="font-bold text-base tracking-tight text-foreground whitespace-nowrap">
              Wells Fargo
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main navigation">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button
            type="button"
            onClick={() => onNavigate('account-details')}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors text-left cursor-pointer"
          >
            <img
              src={profileAvatar}
              alt={userName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">Premier Member</p>
            </div>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 min-h-[42px] rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar (Responsive across Mobile, Tablet, Desktop) */}
        <header className="sticky top-0 z-30 h-14 lg:h-16 bg-card/95 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="lg:hidden flex items-center gap-2 shrink-0"
              aria-label="Go to Overview"
            >
              <img src={logo} alt="Wells Fargo" className="w-8 h-8 object-contain" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
                {pageTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => updateSetting('hideBalances', !settings.hideBalances)}
              aria-label={settings.hideBalances ? 'Show balances' : 'Hide balances'}
              title={settings.hideBalances ? 'Show balances' : 'Hide balances'}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] px-2.5 rounded-xl border border-border bg-background hover:bg-muted flex items-center justify-center gap-2 text-xs font-medium text-foreground transition-colors cursor-pointer"
            >
              {settings.hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden md:inline whitespace-nowrap">
                {settings.hideBalances ? 'Show Balances' : 'Hide Balances'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => updateSetting('darkMode', !settings.darkMode)}
              aria-label={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={settings.darkMode ? 'Light mode' : 'Dark mode'}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-xl border border-border bg-background hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
            >
              {settings.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              aria-label="Notifications"
              className="relative min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] rounded-xl border border-border bg-background hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('transfer')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] lg:min-h-[44px] rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Transfer</span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Viewport */}
        <main
          className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 ${
            showMobileBottomBar ? 'pb-24 lg:pb-8' : 'pb-10'
          }`}
        >
          {children}
        </main>
      </div>

      {/* Mobile & Tablet Thumb-Zone Bottom Navigation */}
      {showMobileBottomBar && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-card/95 backdrop-blur-md border-t border-border grid grid-cols-5 items-center px-2"
        >
          <MobileTab
            icon={<Home className="w-5 h-5" />}
            label="Home"
            active={currentScreen === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          />
          <MobileTab
            icon={<BarChart3 className="w-5 h-5" />}
            label="Analytics"
            active={currentScreen === 'analytics'}
            onClick={() => onNavigate('analytics')}
          />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onNavigate('transfer')}
              aria-label="Transfer money"
              className="w-12 h-12 -mt-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <MobileTab
            icon={<Headphones className="w-5 h-5" />}
            label="Support"
            active={currentScreen === 'support' || currentScreen === 'help-support'}
            onClick={() => onNavigate('help-support')}
          />
          <MobileTab
            icon={<User className="w-5 h-5" />}
            label="Profile"
            active={currentScreen === 'profile'}
            onClick={() => onNavigate('profile')}
          />
        </nav>
      )}
    </div>
  );
}

function MobileTab({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon}
      <span className="text-[11px] font-medium whitespace-nowrap">{label}</span>
    </button>
  );
}
