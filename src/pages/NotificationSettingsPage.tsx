import { useBanking } from '@/contexts/BankingContext';
import { PageShell, Section, ToggleRow, InputRow, SavedToast } from '@/components/settings/SettingsUI';
import { useSavedToast } from '@/hooks/use-saved-toast';

const NotificationSettingsPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { settings, updateSetting } = useBanking();
  const { show, ping } = useSavedToast();

  const set = <K extends keyof typeof settings>(k: K, v: (typeof settings)[K]) => {
    updateSetting(k, v);
    ping();
  };

  return (
    <PageShell
      title="Notification Preferences"
      subtitle="Alerts and delivery channels"
      onBack={() => onNavigate('profile')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Section title="Channels">
          <ToggleRow
            label="Push notifications"
            desc="Alerts on this device"
            checked={settings.pushNotifications}
            onChange={(v) => set('pushNotifications', v)}
          />
          <ToggleRow
            label="Email alerts"
            desc="Statements and security notices"
            checked={settings.emailAlerts}
            onChange={(v) => set('emailAlerts', v)}
          />
          <ToggleRow
            label="SMS alerts"
            desc="Text messages for key account activity"
            checked={settings.smsAlerts}
            onChange={(v) => set('smsAlerts', v)}
          />
          <ToggleRow
            label="Marketing emails"
            desc="Offers and product updates"
            checked={settings.marketingEmails}
            onChange={(v) => set('marketingEmails', v)}
          />
        </Section>

        <div className="space-y-6">
          <Section title="Balance Alerts">
            <ToggleRow
              label="Low balance alerts"
              desc="Warn me before my checking balance drops too low"
              checked={settings.lowBalanceAlerts}
              onChange={(v) => set('lowBalanceAlerts', v)}
            />
            {settings.lowBalanceAlerts && (
              <InputRow
                label="Alert threshold"
                prefix="$"
                type="number"
                value={settings.lowBalanceThreshold}
                onChange={(v) => set('lowBalanceThreshold', Number(v) || 0)}
              />
            )}
          </Section>

          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            className="w-full bg-card border border-border rounded-2xl p-4 min-h-[48px] text-sm font-semibold text-primary hover:bg-muted transition-colors cursor-pointer"
          >
            View notification inbox
          </button>
        </div>
      </div>

      <SavedToast show={show} />
    </PageShell>
  );
};

export default NotificationSettingsPage;
