import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';

const CATEGORY_COLORS = [
  'bg-primary',
  'bg-secondary',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-amber-600',
  'bg-zinc-500',
];

const AnalyticsPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { transactions, accounts, formatMoney } = useBanking();
  const [range, setRange] = useState<'30d' | '90d' | 'all'>('90d');

  const scopedTx = useMemo(() => {
    if (range === 'all') return transactions;
    const days = range === '30d' ? 30 : 90;
    const cutoff = Date.now() - days * 86400000;
    return transactions.filter((t) => t.timestamp >= cutoff);
  }, [transactions, range]);

  const totalBalance = accounts.reduce((s, a) => s + (a.type === 'credit' ? -a.balance : a.balance), 0);
  const totalSpent = scopedTx
    .filter((t) => t.type === 'debit')
    .reduce((s, t) => s + t.amount, 0);
  const totalReceived = scopedTx
    .filter((t) => t.type === 'credit')
    .reduce((s, t) => s + t.amount, 0);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    scopedTx
      .filter((t) => t.type === 'debit')
      .forEach((t) => {
        map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
      });
    const list = [...map.entries()]
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
    const maxAmt = list[0]?.amount || 1;
    return list.map((item, idx) => ({
      ...item,
      pct: Math.max(6, Math.round((item.amount / maxAmt) * 100)),
      share: totalSpent > 0 ? Math.round((item.amount / totalSpent) * 100) : 0,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));
  }, [scopedTx, totalSpent]);

  const monthlyFlow = useMemo(() => {
    const map = new Map<string, { label: string; sortKey: number; inflow: number; outflow: number }>();
    transactions.forEach((t) => {
      const d = new Date(t.timestamp);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map.has(key)) {
        map.set(key, {
          label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          sortKey: d.getFullYear() * 12 + d.getMonth(),
          inflow: 0,
          outflow: 0,
        });
      }
      const entry = map.get(key)!;
      if (t.type === 'credit') entry.inflow += t.amount;
      else entry.outflow += t.amount;
    });
    const sorted = [...map.values()].sort((a, b) => b.sortKey - a.sortKey).slice(0, 6).reverse();
    const peak = Math.max(1, ...sorted.flatMap((m) => [m.inflow, m.outflow]));
    return sorted.map((m) => ({
      ...m,
      inPct: Math.max(6, Math.round((m.inflow / peak) * 100)),
      outPct: Math.max(6, Math.round((m.outflow / peak) * 100)),
    }));
  }, [transactions]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Financial Analytics</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Cash flow and spending breakdown across {scopedTx.length.toLocaleString()} transactions
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-xl self-start sm:self-auto">
          {([
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: 'all', label: 'All Time' },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRange(opt.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                range === opt.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs font-medium text-muted-foreground">Net Portfolio Balance</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 tabular-nums truncate">
            {formatMoney(totalBalance)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs font-medium text-muted-foreground">Total Spent</p>
          <p className="text-xl sm:text-2xl font-bold text-destructive mt-1 tabular-nums">
            {formatMoney(totalSpent, true)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs font-medium text-muted-foreground">Total Received</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {formatMoney(totalReceived, true)}
          </p>
        </div>
      </div>

      {/* 2-Column Analytical Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-foreground">Spending by Category</h2>
            <span className="text-xs text-muted-foreground">Top categories</span>
          </div>
          <div className="space-y-4">
            {categories.map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{c.name}</span>
                  <span className="text-muted-foreground font-mono text-xs sm:text-sm tabular-nums">
                    ${c.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({c.share}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${c.color}`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">No spending records in this period.</p>
            )}
          </div>
        </section>

        {/* Monthly Cash Flow Comparison */}
        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground">Monthly Cash Flow</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                Inflow
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-primary" />
                Outflow
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-52 pt-4">
            {monthlyFlow.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-2 h-full justify-end">
                <div className="flex items-end gap-1 sm:gap-1.5 h-40 w-full justify-center">
                  <div
                    title={`Inflow: $${m.inflow.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                    className="w-3 sm:w-4 bg-emerald-500 rounded-t-md transition-all duration-300"
                    style={{ height: `${m.inPct}%` }}
                  />
                  <div
                    title={`Outflow: $${m.outflow.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                    className="w-3 sm:w-4 bg-primary rounded-t-md transition-all duration-300"
                    style={{ height: `${m.outPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border text-xs">
            <div>
              <p className="text-muted-foreground">Avg Monthly Inflow</p>
              <p className="text-sm font-bold text-foreground tabular-nums mt-0.5">
                $
                {(
                  monthlyFlow.reduce((s, m) => s + m.inflow, 0) / Math.max(1, monthlyFlow.length)
                ).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Monthly Outflow</p>
              <p className="text-sm font-bold text-foreground tabular-nums mt-0.5">
                $
                {(
                  monthlyFlow.reduce((s, m) => s + m.outflow, 0) / Math.max(1, monthlyFlow.length)
                ).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;
