import { useBanking } from '@/contexts/BankingContext';
import { PageShell, Section, ToggleRow, SelectRow, SavedToast } from '@/components/settings/SettingsUI';
import { useSavedToast } from '@/hooks/use-saved-toast';

const MobileSettingsPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { settings, updateSetting } = useBanking();
  const { show, ping } = useSavedToast();

  const set = <K extends keyof typeof settings>(k: K, v: (typeof settings)[K]) => {
    updateSetting(k, v);
    ping();
  };

  return (
    <PageShell
      title="App Preferences"
      subtitle="Appearance, privacy masking, and language"
      onBack={() => onNavigate('profile')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Section title="Appearance">
          <ToggleRow
            label="Dark mode"
            desc="Use the dark theme across all screens"
            checked={settings.darkMode}
            onChange={(v) => set('darkMode', v)}
          />
          <SelectRow
            label="Language"
            value={settings.language}
            options={['English', 'Español', 'Français', 'Deutsch', '中文']}
            onChange={(v) => set('language', v)}
          />
        </Section>

        <Section title="Balance Display">
          <ToggleRow
            label="Hide balances"
            desc="Mask dollar amounts on the dashboard"
            checked={settings.hideBalances}
            onChange={(v) => set('hideBalances', v)}
          />
          <ToggleRow
            label="Quick balance"
            desc="Allow quick account summary preview"
            checked={settings.quickBalance}
            onChange={(v) => set('quickBalance', v)}
          />
        </Section>
      </div>

      <SavedToast show={show} />
    </PageShell>
  );
};

export default MobileSettingsPage;
