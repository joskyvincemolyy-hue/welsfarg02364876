import { Lock } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import { PageShell, Section, ToggleRow, SavedToast } from '@/components/settings/SettingsUI';
import { useSavedToast } from '@/hooks/use-saved-toast';

const PrivacyPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { settings, updateSetting, profile, transactions } = useBanking();
  const { show, ping } = useSavedToast();

  const set = <K extends keyof typeof settings>(k: K, v: (typeof settings)[K]) => {
    updateSetting(k, v);
    ping();
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ profile, settings, transactions }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    ping();
  };

  return (
    <PageShell
      title="Privacy"
      subtitle="Data sharing preferences and export"
      onBack={() => onNavigate('profile')}
    >
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">You control your data</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Privacy selections apply immediately to your banking profile
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Section title="Data Sharing">
          <ToggleRow
            label="Share data with partners"
            desc="Third-party marketing partners"
            checked={settings.shareDataPartners}
            onChange={(v) => set('shareDataPartners', v)}
          />
          <ToggleRow
            label="Personalized offers"
            desc="Use account activity to tailor offers"
            checked={settings.personalizedOffers}
            onChange={(v) => set('personalizedOffers', v)}
          />
          <ToggleRow
            label="Location tracking"
            desc="Used for fraud detection & branch finder"
            checked={settings.locationTracking}
            onChange={(v) => set('locationTracking', v)}
          />
          <ToggleRow
            label="Usage analytics"
            desc="Help improve banking reliability"
            checked={settings.analyticsOptIn}
            onChange={(v) => set('analyticsOptIn', v)}
          />
        </Section>

        <Section title="Your Data Archive">
          <div className="p-5 space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              We never sell your personal banking information. You can download a complete copy of your profile, settings, and transaction ledger at any time.
            </p>
            <button
              type="button"
              onClick={exportData}
              className="w-full py-3 min-h-[46px] rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Download my data (JSON)
            </button>
          </div>
        </Section>
      </div>

      <SavedToast show={show} />
    </PageShell>
  );
};

export default PrivacyPage;
