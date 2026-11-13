import { useState, useCallback } from 'react';
import { BankingProvider } from '@/contexts/BankingContext';
import AppShell from '@/components/AppShell';
import CircleLoader from '@/components/CircleLoader';
import SplashScreen from '@/pages/SplashScreen';
import LoginPage from '@/pages/LoginPage';
import OTPVerification from '@/pages/OTPVerification';
import Dashboard from '@/pages/Dashboard';
import TransferPage from '@/pages/TransferPage';
import ProfilePage from '@/pages/ProfilePage';
import CardDetailsPage from '@/pages/CardDetailsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import AccountDetailsPage from '@/pages/AccountDetailsPage';
import ManageCardsPage from '@/pages/ManageCardsPage';
import SecurityCenterPage from '@/pages/SecurityCenterPage';
import NotificationSettingsPage from '@/pages/NotificationSettingsPage';
import StatementsPage from '@/pages/StatementsPage';
import WireTransfersPage from '@/pages/WireTransfersPage';
import MobileSettingsPage from '@/pages/MobileSettingsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import HelpSupportPage from '@/pages/HelpSupportPage';
import NotificationsPage from '@/pages/NotificationsPage';
import TransactionHistoryPage from '@/pages/TransactionHistoryPage';

type AppScreen =
  | 'splash'
  | 'login'
  | 'login-loading'
  | 'otp'
  | 'otp-loading'
  | 'dashboard'
  | 'transfer'
  | 'profile'
  | 'card-details'
  | 'analytics'
  | 'support'
  | 'notifications'
  | 'account-details'
  | 'manage-cards'
  | 'security-center'
  | 'notification-settings'
  | 'statements'
  | 'wire-transfers'
  | 'mobile-settings'
  | 'privacy'
  | 'help-support'
  | 'transaction-history';

const VALID_SCREENS = new Set<AppScreen>([
  'dashboard',
  'transfer',
  'profile',
  'card-details',
  'analytics',
  'support',
  'notifications',
  'account-details',
  'manage-cards',
  'security-center',
  'notification-settings',
  'statements',
  'wire-transfers',
  'mobile-settings',
  'privacy',
  'help-support',
  'transaction-history',
]);

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [selectedAccountId, setSelectedAccountId] = useState('1');

  const transitionTo = useCallback((target: AppScreen, loadingScreen?: AppScreen) => {
    if (loadingScreen) {
      setScreen(loadingScreen);
      window.setTimeout(() => setScreen(target), 1400);
    } else {
      setScreen(target);
    }
  }, []);

  const handleNavigate = useCallback(
    (page: string) => {
      if (page.startsWith('card-details:')) {
        setSelectedAccountId(page.split(':')[1]);
        transitionTo('card-details');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (VALID_SCREENS.has(page as AppScreen)) {
        transitionTo(page as AppScreen);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [transitionTo],
  );

  const handleLogout = useCallback(() => {
    setScreen('login');
  }, []);

  const isAuthScreen =
    screen === 'splash' ||
    screen === 'login' ||
    screen === 'login-loading' ||
    screen === 'otp' ||
    screen === 'otp-loading';

  return (
    <BankingProvider>
      {isAuthScreen ? (
        <div className="min-h-screen w-full bg-background">
          {screen === 'splash' && <SplashScreen onComplete={() => transitionTo('login')} />}
          {screen === 'login' && <LoginPage onLogin={() => transitionTo('otp', 'login-loading')} />}
          {screen === 'login-loading' && <CircleLoader message="Signing in..." />}
          {screen === 'otp' && (
            <OTPVerification onVerify={() => transitionTo('dashboard', 'otp-loading')} />
          )}
          {screen === 'otp-loading' && <CircleLoader message="Verifying..." />}
        </div>
      ) : (
        <AppShell currentScreen={screen} onNavigate={handleNavigate} onLogout={handleLogout}>
          {screen === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {screen === 'transfer' && <TransferPage onNavigate={handleNavigate} />}
          {screen === 'profile' && <ProfilePage onNavigate={handleNavigate} onLogout={handleLogout} />}
          {screen === 'card-details' && (
            <CardDetailsPage onNavigate={handleNavigate} accountId={selectedAccountId} />
          )}
          {screen === 'analytics' && <AnalyticsPage onNavigate={handleNavigate} />}
          {(screen === 'support' || screen === 'help-support') && (
            <HelpSupportPage onNavigate={handleNavigate} />
          )}
          {screen === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
          {screen === 'account-details' && <AccountDetailsPage onNavigate={handleNavigate} />}
          {screen === 'manage-cards' && <ManageCardsPage onNavigate={handleNavigate} />}
          {screen === 'security-center' && <SecurityCenterPage onNavigate={handleNavigate} />}
          {screen === 'notification-settings' && (
            <NotificationSettingsPage onNavigate={handleNavigate} />
          )}
          {screen === 'statements' && <StatementsPage onNavigate={handleNavigate} />}
          {screen === 'wire-transfers' && <WireTransfersPage onNavigate={handleNavigate} />}
          {screen === 'mobile-settings' && <MobileSettingsPage onNavigate={handleNavigate} />}
          {screen === 'privacy' && <PrivacyPage onNavigate={handleNavigate} />}
          {screen === 'transaction-history' && (
            <TransactionHistoryPage onNavigate={handleNavigate} />
          )}
        </AppShell>
      )}
    </BankingProvider>
  );
}
