import { useMemo, useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';

const PAGE_SIZE = 40;

const TransactionHistoryPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { transactions, accounts } = useBanking();
  const [query, setQuery] = useState('');
  const [accountId, setAccountId] = useState('all');
  const [type, setType] = useState<'all' | 'debit' | 'credit'>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [showFilters, setShowFilters] = useState(true);

  const accountNameMap = useMemo(() => {
    const m = new Map<string, string>();
    accounts.forEach((a) => m.set(a.id, a.name));
    return m;
  }, [accounts]);

  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        if (accountId !== 'all' && t.accountId !== accountId) return false;
        if (type !== 'all' && t.type !== type) return false;
        if (query && !`${t.name} ${t.category}`.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [transactions, accountId, type, query],
  );

  const totals = useMemo(
    () => ({
      out: filtered.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0),
      in: filtered.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0),
    }),
    [filtered],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.slice(0, visible).forEach((t) => {
      const key = new Date(t.timestamp).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return [...map.entries()];
  }, [filtered, visible]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            aria-label="Go back"
            className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Transaction History</h1>
            <p className="text-xs sm:text-sm text-muted-foreground tabular-nums">
              {filtered.length.toLocaleString()} matching records
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[42px] rounded-xl bg-card border border-border text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Search & Filter Panel */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search by merchant or category..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
              {[{ id: 'all', name: 'All accounts' }, ...accounts].map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setAccountId(a.id);
                    setVisible(PAGE_SIZE);
                  }}
                  className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    accountId === a.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>

            <div className="flex gap-2 shrink-0">
              {(['all', 'debit', 'credit'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    setVisible(PAGE_SIZE);
                  }}
                  className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    type === t
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'all' ? 'All types' : t === 'debit' ? 'Money out' : 'Money in'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <p className="text-xs text-muted-foreground">Money out</p>
          <p className="text-lg sm:text-xl font-bold text-destructive mt-1 tabular-nums">
            -${totals.out.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <p className="text-xs text-muted-foreground">Money in</p>
          <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            +${totals.in.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <p className="text-xs text-muted-foreground">Net cash flow</p>
          <p className="text-lg sm:text-xl font-bold text-foreground mt-1 tabular-nums">
            {(totals.in - totals.out >= 0 ? '+' : '-') +
              '$' +
              Math.abs(totals.in - totals.out).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </p>
        </div>
      </div>

      {/* Grouped Transactions */}
      <div className="space-y-5">
        {groups.map(([day, items]) => (
          <div key={day}>
            <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">{day}</p>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
              {items.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-12 items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="col-span-8 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {tx.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{tx.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden truncate">
                        {tx.category} ·{' '}
                        {new Date(tx.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                        {tx.status === 'pending' ? ' · Pending' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block sm:col-span-3 text-xs text-muted-foreground truncate">
                    {tx.category}
                    {tx.status === 'pending' && ' · Pending'}
                  </div>

                  <div className="hidden md:block md:col-span-2 text-xs text-muted-foreground truncate">
                    {accountNameMap.get(tx.accountId) ?? 'Account'}
                  </div>

                  <div className="col-span-4 sm:col-span-4 md:col-span-2 text-right">
                    <p
                      className={`text-sm font-bold whitespace-nowrap tabular-nums ${
                        tx.type === 'debit'
                          ? 'text-foreground'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {tx.type === 'debit' ? '-' : '+'}${tx.amount.toFixed(2)}
                    </p>
                    <p className="hidden sm:block text-[11px] text-muted-foreground tabular-nums">
                      {new Date(tx.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-sm font-medium text-foreground">No matching transactions</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search query or account filters.
            </p>
          </div>
        )}

        {visible < filtered.length && (
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="w-full bg-card border border-border rounded-2xl py-3.5 min-h-[48px] text-sm font-semibold text-primary hover:bg-muted transition-colors cursor-pointer"
          >
            Load more ({(filtered.length - visible).toLocaleString()} remaining)
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
