import { Bell, CheckCheck } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import { PageShell } from '@/components/settings/SettingsUI';

const NotificationsPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { notifications, markAllNotificationsRead } = useBanking();
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <PageShell
      title="Notifications"
      subtitle={`${unreadCount} unread alerts`}
      onBack={() => onNavigate('dashboard')}
    >
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('notification-settings')}
          className="text-xs sm:text-sm font-semibold text-primary hover:underline cursor-pointer"
        >
          Manage alert preferences
        </button>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-primary" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 sm:p-5 flex items-start gap-3.5 ${n.unread ? 'bg-primary/[0.03]' : ''}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                n.unread ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
};

export default NotificationsPage;
