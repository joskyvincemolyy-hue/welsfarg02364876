import { useState } from 'react';
import { ArrowLeft, Check, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import CircleLoader from '@/components/CircleLoader';

const QUICK_RECIPIENTS = [
  { name: 'Emily Gordon', bank: 'Wells Fargo Bank', account: '9042-1180-3341' },
  { name: 'Marcus Reed', bank: 'Chase Bank', account: '7740-9821-0045' },
  { name: 'Casey Newman', bank: 'Bank of America', account: '3319-5502-8812' },
];

const TransferPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { accounts, addTransaction, debitAccount, formatMoney } = useBanking();
  const [step, setStep] = useState<'form' | 'pin' | 'loading' | 'success'>('form');
  const [fromAccount, setFromAccount] = useState('1');
  const [recipientName, setRecipientName] = useState('');
  const [recipientBank, setRecipientBank] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [transferRef] = useState(`WF${Date.now().toString().slice(-8)}`);

  const selectedAccount = accounts.find((a) => a.id === fromAccount) ?? accounts[0];
  const parsedAmount = parseFloat(amount) || 0;
  const isInsufficient = parsedAmount > selectedAccount.balance;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || parsedAmount <= 0 || !recipientAccount.trim()) return;
    if (isInsufficient) return;
    setStep('pin');
  };

  const handlePinSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pin === '7339') {
      setPinError('');
      setStep('loading');
      window.setTimeout(() => {
        debitAccount(fromAccount, parsedAmount);
        addTransaction({
          name: recipientName.trim(),
          date: `Today, ${new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}`,
          amount: parsedAmount,
          type: 'debit',
          category: 'Transfer',
          icon: 'send',
          accountId: fromAccount,
        });
        setStep('success');
      }, 1800);
    } else {
      setPinError('Invalid PIN. Please enter 7339.');
      setPin('');
    }
  };

  if (step === 'loading') return <CircleLoader message="Processing transfer..." />;

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto py-4 sm:py-8">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5 animate-fade-up">
            <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1 animate-fade-up">
            Transfer Successful
          </h1>
          <p className="text-muted-foreground text-sm mb-6 animate-fade-up">
            Your funds have been dispatched
          </p>

          <div className="w-full bg-muted/60 border border-border rounded-2xl p-5 space-y-3 text-left">
            <InfoRow label="Reference" value={transferRef} mono />
            <InfoRow label="To" value={recipientName} />
            <InfoRow label="Bank" value={recipientBank || 'External Bank'} />
            <InfoRow label="Account" value={recipientAccount} mono />
            <InfoRow label="Amount" value={`$${parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} highlight />
            <InfoRow label="From" value={`${selectedAccount.name} (•••• ${selectedAccount.lastFour})`} />
            <InfoRow
              label="Date"
              value={new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            />
            <InfoRow label="Status" value="Completed" status />
            {note && <InfoRow label="Note" value={note} />}
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setStep('form');
                setAmount('');
                setNote('');
                setPin('');
              }}
              className="py-3 min-h-[46px] bg-muted text-foreground font-semibold rounded-xl text-sm hover:bg-muted/80 cursor-pointer"
            >
              Make Another Transfer
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="py-3 min-h-[46px] bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 cursor-pointer"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'pin') {
    return (
      <div className="max-w-md mx-auto py-4 sm:py-8">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center relative shadow-sm">
          <button
            type="button"
            onClick={() => setStep('form')}
            aria-label="Go back to transfer form"
            className="absolute top-5 left-5 w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center text-foreground cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mt-2">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Enter Transfer PIN</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Confirm transfer of{' '}
            <span className="font-bold text-foreground tabular-nums">
              ${parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>{' '}
            to {recipientName}
          </p>

          <form onSubmit={handlePinSubmit} className="w-full flex flex-col items-center">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              autoFocus
              className="w-44 text-center text-3xl font-mono tracking-[0.5em] py-3 border-2 border-border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none tabular-nums"
            />
            {pinError && (
              <p role="alert" className="text-destructive text-sm font-medium mt-3">
                {pinError}
              </p>
            )}
            <button
              type="submit"
              disabled={pin.length !== 4}
              className="w-full mt-6 py-3 min-h-[48px] bg-primary text-primary-foreground font-semibold rounded-xl disabled:opacity-50 hover:opacity-90 cursor-pointer"
            >
              Confirm Transfer
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          aria-label="Go back to dashboard"
          className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Transfer Money</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Send funds domestically or externally with PIN verification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form onSubmit={handleContinue} className="lg:col-span-7 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <label htmlFor="from-account" className="block text-xs font-semibold text-muted-foreground mb-2">
              From Account
            </label>
            <select
              id="from-account"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-background border border-border text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
            >
              {accounts
                .filter((a) => a.type !== 'credit')
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} (•••• {a.lastFour}) — {formatMoney(a.balance, true)}
                  </option>
                ))}
            </select>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-foreground">Recipient Details</h2>
              <span className="text-xs text-muted-foreground">Or select a recent contact</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_RECIPIENTS.map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => {
                    setRecipientName(r.name);
                    setRecipientBank(r.bank);
                    setRecipientAccount(r.account);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-muted hover:bg-muted/80 text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-primary" />
                  <span>{r.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-1">
              <input
                type="text"
                placeholder="Recipient Full Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Bank Name"
                  value={recipientBank}
                  onChange={(e) => setRecipientBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm font-mono tabular-nums"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <label htmlFor="transfer-amount" className="block text-xs font-semibold text-muted-foreground mb-2">
                Amount (USD)
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-background focus-within:border-primary">
                <span className="text-2xl font-bold text-foreground">$</span>
                <input
                  id="transfer-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 text-2xl font-bold bg-transparent text-foreground focus:outline-none tabular-nums"
                  required
                />
              </div>
              {isInsufficient && (
                <p className="text-destructive text-xs font-medium mt-1.5">
                  Insufficient balance in {selectedAccount.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="transfer-note" className="block text-xs font-semibold text-muted-foreground mb-2">
                Note (optional)
              </label>
              <input
                id="transfer-note"
                type="text"
                placeholder="Add a memo or reference note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!recipientName.trim() || parsedAmount <= 0 || !recipientAccount.trim() || isInsufficient}
            className="w-full py-3.5 min-h-[48px] bg-primary text-primary-foreground font-semibold rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
          >
            Continue to Verification
          </button>
        </form>

        {/* Live Transfer Summary Sidebar */}
        <aside className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground">Transfer Summary</h2>
          <div className="space-y-3 text-sm">
            <InfoRow label="Source Account" value={`${selectedAccount.name} (•••• ${selectedAccount.lastFour})`} />
            <InfoRow label="Available Balance" value={formatMoney(selectedAccount.balance)} mono />
            <InfoRow label="Recipient" value={recipientName || '—'} />
            <InfoRow label="Destination Bank" value={recipientBank || 'External Bank'} />
            <InfoRow
              label="Transfer Amount"
              value={parsedAmount > 0 ? `$${parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
              highlight
            />
            <InfoRow label="Transfer Fee" value="$0.00" />
          </div>
          <div className="pt-4 border-t border-border flex items-start gap-3 text-xs text-muted-foreground">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <p className="leading-relaxed">
              Transfers are protected by 4-digit PIN authorization and real-time account monitoring.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  highlight,
  status,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  status?: boolean;
  mono?: boolean;
}) => (
  <div className="flex justify-between items-center gap-4">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span
      className={`text-sm font-semibold text-right truncate ${
        highlight
          ? 'text-primary text-base sm:text-lg tabular-nums'
          : status
            ? 'text-emerald-600 dark:text-emerald-400'
            : mono
              ? 'text-foreground font-mono tabular-nums'
              : 'text-foreground'
      }`}
    >
      {value}
    </span>
  </div>
);

export default TransferPage;
