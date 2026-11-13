import { useState } from 'react';
import { ArrowLeft, CreditCard, FileText, Settings2, ShieldCheck } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import chipImg from '@/assets/chip.png';
import visaLogo from '@/assets/visa-logo.svg';

const CardDetailsPage = ({
  onNavigate,
  accountId,
}: {
  onNavigate: (page: string) => void;
  accountId?: string;
}) => {
  const { accounts, transactions, cards, userName, formatMoney } = useBanking();
  const credit = accounts.find((a) => a.id === accountId) ?? accounts[0];
  const linkedCard = cards.find((c) => c.accountId === credit.id) ?? cards[0];
  const [tab, setTab] = useState<'transactions' | 'payments' | 'charges'>('transactions');
  const [showCardInfo, setShowCardInfo] = useState(false);

  const filteredTx = transactions
    .filter((tx) => tx.accountId === credit.id)
    .filter((tx) =>
      tab === 'payments' ? tx.type === 'credit' : tab === 'charges' ? tx.type === 'debit' : true,
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
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
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{credit.name}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono tabular-nums">
              Account ending in •••• {credit.lastFour}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('manage-cards')}
          className="inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-xl bg-card border border-border text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors whitespace-nowrap cursor-pointer"
        >
          <Settings2 className="w-4 h-4 text-primary" />
          <span>Card Controls</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Virtual Card + Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-gradient rounded-2xl p-6 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <p className="text-white/90 text-sm font-medium">{credit.name}</p>
              <img src={visaLogo} alt="Visa" className="h-5 brightness-0 invert" />
            </div>
            <img src={chipImg} alt="EMV Chip" className="w-10 h-8 object-contain mb-4" />
            <div className="py-2">
              <p className="text-white/65 text-xs">
                {credit.type === 'credit' ? 'Outstanding balance' : 'Available balance'}
              </p>
              <p className="text-white text-2xl sm:text-3xl font-bold mt-1 tabular-nums">
                {formatMoney(credit.balance)}
              </p>
              <p className="text-white/65 text-xs mt-2 font-mono tabular-nums">
                •••• •••• •••• {credit.lastFour}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onNavigate('transfer')}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-1.5 hover:border-primary/40 transition-colors cursor-pointer"
            >
              <CreditCard className="w-5 h-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">Payment</p>
              <p className="text-xs text-muted-foreground">Make a transfer</p>
            </button>
            <button
              type="button"
              onClick={() => setShowCardInfo(!showCardInfo)}
              className={`bg-card border rounded-2xl p-4 flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                showCardInfo ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
              }`}
            >
              <FileText className="w-5 h-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">Card Info</p>
              <p className="text-xs text-muted-foreground">
                {showCardInfo ? 'Hide details' : 'View details'}
              </p>
            </button>
          </div>

          {showCardInfo && linkedCard && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3 text-sm animate-fade-up">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Card & Security Details</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Cardholder</span>
                <span className="font-semibold text-foreground text-xs">{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Expiration</span>
                <span className="font-mono font-semibold text-foreground text-xs tabular-nums">
                  {linkedCard.expires}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Daily Spend Limit</span>
                <span className="font-mono font-semibold text-foreground text-xs tabular-nums">
                  ${linkedCard.spendLimit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Card Status</span>
                <span
                  className={`font-semibold text-xs ${
                    linkedCard.frozen ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {linkedCard.frozen ? 'Frozen' : 'Active'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Account Activity */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex border-b border-border px-2 pt-2">
            {(['transactions', 'payments', 'charges'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                  tab === t
                    ? 'text-foreground border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="divide-y divide-border">
            {filteredTx.slice(0, 15).map((tx) => (
              <div key={tx.id} className="p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                  {tx.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{tx.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {tx.category} · {tx.date}
                  </p>
                </div>
                <p
                  className={`text-sm font-bold whitespace-nowrap tabular-nums ${
                    tx.type === 'debit'
                      ? 'text-foreground'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {tx.type === 'debit' ? '-' : '+'}
                  {formatMoney(tx.amount, true)}
                </p>
              </div>
            ))}
            {filteredTx.length === 0 && (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No {tab} found for this account.
              </p>
            )}
          </div>

          <div className="p-4 border-t border-border bg-muted/20">
            <button
              type="button"
              onClick={() => onNavigate('transaction-history')}
              className="w-full py-2.5 min-h-[42px] rounded-xl text-sm font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              View all transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;
