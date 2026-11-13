import { useState } from 'react';
import { Monitor, ShieldCheck, Smartphone } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import { PageShell, Section, ToggleRow, SavedToast } from '@/components/settings/SettingsUI';
import { useSavedToast } from '@/hooks/use-saved-toast';

const SecurityCenterPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { settings, updateSetting } = useBanking();
  const { show, ping } = useSavedToast();
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [msg, setMsg] = useState('');

  const set = <K extends keyof typeof settings>(k: K, v: (typeof settings)[K]) => {
    updateSetting(k, v);
    ping();
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.current || !pw.next) return setMsg('Please fill in all fields.');
    if (pw.next.length < 8) return setMsg('New password must be at least 8 characters.');
    if (pw.next !== pw.confirm) return setMsg('New passwords do not match.');
    setPw({ current: '', next: '', confirm: '' });
    setMsg('Password updated successfully.');
    ping();
    window.setTimeout(() => setMsg(''), 3000);
  };

  return (
    <PageShell
      title="Security Center"
      subtitle="Password, biometrics, and active sessions"
      onBack={() => onNavigate('profile')}
    >
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Account Protection Enabled</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {settings.twoFactor ? '2FA and login monitoring active' : 'Enable 2FA for stronger protection'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <Section title="Sign-On & Verification">
            <ToggleRow
              label="Biometric sign-in"
              desc="Use Face ID or fingerprint on supported devices"
              checked={settings.biometrics}
              onChange={(v) => set('biometrics', v)}
            />
            <ToggleRow
              label="Two-factor authentication"
              desc="Require 4-digit SMS verification code on sign-in"
              checked={settings.twoFactor}
              onChange={(v) => set('twoFactor', v)}
            />
            <ToggleRow
              label="Login alerts"
              desc="Notify me when a new device signs in"
              checked={settings.loginAlerts}
              onChange={(v) => set('loginAlerts', v)}
            />
          </Section>

          <Section title="Active Sessions">
            {[
              { icon: Smartphone, name: 'iPhone 15 Pro · San Francisco, CA', time: 'Active now' },
              { icon: Monitor, name: 'MacBook Pro · San Francisco, CA', time: '2 days ago' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.time}</p>
                  </div>
                </div>
              );
            })}
          </Section>
        </div>

        <Section title="Change Password">
          <form onSubmit={changePassword} className="p-5 space-y-4">
            {[
              { key: 'current' as const, label: 'Current password' },
              { key: 'next' as const, label: 'New password' },
              { key: 'confirm' as const, label: 'Confirm new password' },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {f.label}
                </label>
                <input
                  type="password"
                  value={pw[f.key]}
                  onChange={(e) => setPw({ ...pw, [f.key]: e.target.value })}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-background border border-border text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            ))}
            {msg && (
              <p className={`text-xs font-medium ${msg.includes('success') ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                {msg}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 min-h-[46px] text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Update password
            </button>
          </form>
        </Section>
      </div>

      <SavedToast show={show} />
    </PageShell>
  );
};

export default SecurityCenterPage;
