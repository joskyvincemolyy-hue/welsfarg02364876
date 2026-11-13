import { useState, useRef } from 'react';
import { BadgeCheck, Camera, Check, Copy, Pencil } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import { PageShell, Section, InputRow, SavedToast } from '@/components/settings/SettingsUI';
import { useSavedToast } from '@/hooks/use-saved-toast';

const defaultProfilePhoto = '/assets/aistudio/PHOTO-2026-11-11-12-59-01_82eea4b0.jpg';

const AccountDetailsPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { profile, updateProfile, accounts, accountNumber, routingNumber, transactions, formatMoney } =
    useBanking();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [copied, setCopied] = useState('');
  const { show, ping } = useSavedToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const profilePhoto = profile.avatarUrl || defaultProfilePhoto;

  const totalBalance = accounts.reduce((s, a) => s + (a.type === 'credit' ? 0 : a.balance), 0);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProfile({ avatarUrl: reader.result });
        ping();
      }
    };
    reader.readAsDataURL(file);
  };

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1500);
  };

  const save = () => {
    updateProfile(draft);
    setEditing(false);
    ping();
  };

  return (
    <PageShell
      title="Account Details"
      subtitle="Personal & banking information"
      onBack={() => onNavigate('profile')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={profilePhoto}
                alt={profile.userName}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Upload profile photo"
                title="Change profile photo"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:opacity-90 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold text-foreground truncate">{profile.userName}</h2>
                <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground">Premier Account Member since 2014</p>
              <p className="text-xs text-muted-foreground mt-1">{profile.occupation}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-xs text-muted-foreground">Total deposit balance</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1 tabular-nums">
              {formatMoney(totalBalance)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 tabular-nums">
              {transactions.length.toLocaleString()} transactions on record
            </p>
          </div>

          <Section title="Banking Information">
            {[
              { label: 'Account number', value: accountNumber },
              { label: 'Routing number', value: routingNumber },
              { label: 'SWIFT / BIC', value: 'WFBIUS6S' },
              { label: 'Branch', value: 'Riverside Branch, IL' },
            ].map((row) => (
              <button
                key={row.label}
                type="button"
                onClick={() => copy(row.label, row.value)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="text-sm font-semibold text-foreground font-mono tabular-nums mt-0.5">
                    {row.value}
                  </p>
                </div>
                {copied === row.label ? (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
            ))}
          </Section>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <Section title="Your Accounts">
            {accounts.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onNavigate(`card-details:${a.id}`)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <span className="w-12 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-mono font-bold shrink-0">
                  {a.lastFour}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{a.type}</p>
                </div>
                <p className="text-sm font-bold text-foreground tabular-nums whitespace-nowrap">
                  {formatMoney(a.balance)}
                </p>
              </button>
            ))}
          </Section>

          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h2 className="text-xs font-semibold tracking-wide text-muted-foreground">
                Personal Details
              </h2>
              <button
                type="button"
                onClick={() => (editing ? save() : (setDraft(profile), setEditing(true)))}
                className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer"
              >
                {editing ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Save
                  </>
                ) : (
                  <>
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </>
                )}
              </button>
            </div>
            <Section>
              {editing ? (
                <>
                  <InputRow
                    label="Full name"
                    value={draft.userName}
                    onChange={(v) => setDraft({ ...draft, userName: v })}
                  />
                  <InputRow
                    label="Sex"
                    value={draft.sex}
                    onChange={(v) => setDraft({ ...draft, sex: v })}
                  />
                  <InputRow
                    label="Email"
                    value={draft.email}
                    onChange={(v) => setDraft({ ...draft, email: v })}
                  />
                  <InputRow
                    label="Phone"
                    value={draft.phone}
                    onChange={(v) => setDraft({ ...draft, phone: v })}
                  />
                  <InputRow
                    label="Address"
                    value={draft.address}
                    onChange={(v) => setDraft({ ...draft, address: v })}
                  />
                  <InputRow
                    label="Date of birth"
                    value={draft.dateOfBirth}
                    onChange={(v) => setDraft({ ...draft, dateOfBirth: v })}
                  />
                  <InputRow
                    label="Occupation"
                    value={draft.occupation}
                    onChange={(v) => setDraft({ ...draft, occupation: v })}
                  />
                </>
              ) : (
                [
                  { label: 'Full name', value: profile.userName },
                  { label: 'Sex', value: profile.sex },
                  { label: 'Email', value: profile.email },
                  { label: 'Phone', value: profile.phone },
                  { label: 'Address', value: profile.address },
                  { label: 'Date of birth', value: profile.dateOfBirth },
                  { label: 'Occupation', value: profile.occupation },
                ].map((r) => (
                  <div key={r.label} className="p-4">
                    <p className="text-xs text-muted-foreground">{r.label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{r.value}</p>
                  </div>
                ))
              )}
            </Section>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('transaction-history')}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 min-h-[48px] text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            View full transaction history
          </button>
        </div>
      </div>

      <SavedToast show={show} />
    </PageShell>
  );
};

export default AccountDetailsPage;
