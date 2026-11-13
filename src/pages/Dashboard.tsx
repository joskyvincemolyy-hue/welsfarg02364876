import { useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  CreditCard,
  FileText,
  History,
  Send,
} from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import chipImg from '@/assets/chip.png';
import visaLogo from '@/assets/visa-logo.svg';

const Dashboard = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { accounts, cards, transactions, userName, accountNumber, formatMoney } = useBanking();
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const primaryAccount = accounts[0];
  const primaryCard = cards[0];

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const expenseCategories = [
    { name: 'Transfers', color: '#c4161c', pct: 45, dash: '39.6 88', offset: '0' },
    { name: 'Cash withdrawal', color: '#ffcd41', pct: 30, dash: '26.4 88', offset: '-39.6' },
    { name: 'Other', color: '#4b5563', pct: 25, dash: '22 88', offset: '-66' },
  ];

  const quickActions = [
    { label: 'Transfer Money', icon: Send, page: 'transfer' },
    { label: 'Manage Cards', icon: CreditCard, page: 'manage-cards' },
    { label: 'Statements', icon: FileText, page: 'statements' },
    { label: 'Analytics', icon: BarChart3, page: 'analytics' },
  ];

  const monthlyOutflow = transactions
    .filter((t) => t.type === 'debit')
    .slice(0, 30)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Greeting & Quick Actions Strip */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">{dateStr}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-0.5">
            Hello, {userName.split(' ')[0]}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.page}
                type="button"
                onClick={() => onNavigate(act.page)}
                className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[42px] rounded-xl bg-card border border-border text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors whitespace-nowrap cursor-pointer"
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Showcase: Visa Card First, Followed by Single Account Balance */}
      <section aria-label="Primary Card and Account Balance" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 1. Visa Card at the Top */}
        <div
          onClick={() => onNavigate(`card-details:${primaryAccount.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate(`card-details:${primaryAccount.id}`);
          }}
          className="lg:col-span-5 card-gradient rounded-2xl p-6 relative overflow-hidden cursor-pointer hover:brightness-105 transition-all shadow-sm flex flex-col justify-between min-h-[210px]"
        >
          <div className="flex items-center justify-between">
            <p className="text-white/85 text-sm font-medium">
              {primaryCard?.name ?? 'Visa Signature'}
            </p>
            <img src={visaLogo} alt="Visa" className="h-6 brightness-0 invert" />
          </div>

          <div className="my-4">
            <img src={chipImg} alt="EMV Chip" className="w-10 h-8 object-contain mb-3" />
            <p className="text-white text-base sm:text-lg tracking-[0.22em] font-mono tabular-nums">
              •••• •••• •••• {primaryCard?.lastFour ?? primaryAccount.lastFour}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-white/60 text-[10px] tracking-wider">CARD HOLDER</p>
              <p className="text-white text-sm font-medium mt-0.5">{userName.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-[10px] tracking-wider">EXPIRES</p>
              <p className="text-white text-sm font-medium font-mono mt-0.5 tabular-nums">
                {primaryCard?.expires ?? '09/28'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Single Account Balance Card */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-mono font-bold tabular-nums">
                  •••• {primaryAccount.lastFour}
                </span>
                <p className="text-sm sm:text-base font-semibold text-foreground">
                  {primaryAccount.name}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono tabular-nums">
                Account: {accountNumber}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(`card-details:${primaryAccount.id}`)}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline whitespace-nowrap cursor-pointer"
            >
              <span>Account Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Available Balance</p>
            <p className="text-3xl sm:text-4xl font-bold text-foreground mt-1 tabular-nums tracking-tight">
              {formatMoney(primaryAccount.balance)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => onNavigate('transfer')}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
            >
              Transfer Money
            </button>
            <button
              type="button"
              onClick={() => onNavigate('transaction-history')}
              className="px-4 py-2.5 min-h-[44px] rounded-xl bg-muted text-foreground text-xs sm:text-sm font-semibold hover:bg-muted/80 transition-colors whitespace-nowrap cursor-pointer"
            >
              View Activity
            </button>
          </div>
        </div>
      </section>

      {/* Main Responsive Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left / Primary Column: Latest Activity */}
        <section className="xl:col-span-8 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-primary" />
              <h2 className="text-base sm:text-lg font-bold text-foreground">Transaction History</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('transaction-history')}
              className="text-xs sm:text-sm font-semibold text-primary hover:underline whitespace-nowrap min-h-[36px] px-2 cursor-pointer"
            >
              See all ({transactions.length.toLocaleString()})
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-medium text-muted-foreground bg-muted/40">
                  <th className="py-3 px-5">Merchant / Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.slice(0, 8).map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                          {tx.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-foreground truncate max-w-[220px]">
                          {tx.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {tx.category}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                      {tx.date}
                    </td>
                    <td
                      className={`py-3.5 px-5 text-sm font-bold text-right whitespace-nowrap tabular-nums ${
                        tx.type === 'debit'
                          ? 'text-foreground'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {tx.type === 'debit' ? '-' : '+'}
                      {formatMoney(tx.amount, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Compact List View */}
          <div className="md:hidden divide-y divide-border">
            {transactions.slice(0, 8).map((tx) => (
              <div key={tx.id} className="p-4 flex items-center gap-3">
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
          </div>
        </section>

        {/* Right Column: Current Expenses Donut */}
        <aside className="xl:col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-2 mb-5">
              <div>
                <h2 className="text-base font-bold text-foreground">Current Expenses</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('analytics')}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-5">
              <div className="flex flex-col gap-2.5 flex-1">
                {expenseCategories.map((c) => {
                  const active = selectedSlice === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedSlice(active ? null : c.name)}
                      className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                        active ? 'bg-muted' : 'hover:bg-muted/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-xs font-medium text-foreground truncate">{c.name}</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">
                        {c.pct}%
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="4"
                  />
                  {expenseCategories.map((c) => (
                    <circle
                      key={c.name}
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={c.color}
                      strokeWidth={selectedSlice === c.name ? '4.8' : '4'}
                      strokeDasharray={c.dash}
                      strokeDashoffset={c.offset}
                      strokeLinecap="round"
                      className="transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedSlice(selectedSlice === c.name ? null : c.name)}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                  <p className="text-[11px] font-bold text-foreground tabular-nums">
                    {formatMoney(monthlyOutflow)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
