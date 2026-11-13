import { Globe } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import {
  PageShell,
  Section,
  ToggleRow,
  SelectRow,
  InputRow,
  SavedToast,
} from '@/components/settings/SettingsUI';
import { useSavedToast } from '@/hooks/use-saved-toast';

const WireTransfersPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { settings, updateSetting } = useBanking();
  const { show, ping } = useSavedToast();

  const set = <K extends keyof typeof settings>(k: K, v: (typeof settings)[K]) => {
    updateSetting(k, v);
    ping();
  };

  return (
    <PageShell
      title="Wire Transfers"
      subtitle="International wire settings and fee schedule"
      onBack={() => onNavigate('profile')}
    >
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">
            International wires {settings.internationalWires ? 'enabled' : 'disabled'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
            Daily limit ${settings.wireDailyLimit.toLocaleString()} · {settings.wireCurrency}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Section title="Preferences">
          <ToggleRow
            label="Allow international wires"
            desc="Send funds outside the United States"
            checked={settings.internationalWires}
            onChange={(v) => set('internationalWires', v)}
          />
          <SelectRow
            label="Default currency"
            value={settings.wireCurrency}
            options={['USD', 'EUR', 'GBP', 'CAD', 'NGN', 'JPY', 'AUD']}
            onChange={(v) => set('wireCurrency', v)}
          />
          <InputRow
            label="Daily wire limit"
            prefix="$"
            type="number"
            value={settings.wireDailyLimit}
            onChange={(v) => set('wireDailyLimit', Number(v) || 0)}
          />
          <InputRow
            label="SWIFT / BIC code"
            value={settings.swiftCode}
            onChange={(v) => set('swiftCode', v.toUpperCase())}
          />
        </Section>

        <div className="space-y-6">
          <Section title="Standard Wire Fees">
            {[
              { label: 'Domestic wire (outgoing)', value: '$25.00' },
              { label: 'International wire (outgoing)', value: '$45.00' },
              { label: 'Incoming wire', value: '$15.00' },
            ].map((f) => (
              <div key={f.label} className="p-4 flex justify-between items-center">
                <p className="text-sm text-foreground">{f.label}</p>
                <p className="text-sm font-semibold text-foreground font-mono tabular-nums">
                  {f.value}
                </p>
              </div>
            ))}
          </Section>

          <button
            type="button"
            onClick={() => onNavigate('transfer')}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 min-h-[48px] text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Start a wire transfer
          </button>
        </div>
      </div>

      <SavedToast show={show} />
    </PageShell>
  );
};

export default WireTransfersPage;
