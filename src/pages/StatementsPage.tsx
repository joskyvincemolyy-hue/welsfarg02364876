import { useMemo, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import { PageShell, SavedToast } from '@/components/settings/SettingsUI';
import { useSavedToast } from '@/hooks/use-saved-toast';

const StatementsPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { transactions, accounts, profile, accountNumber } = useBanking();
  const [accountId, setAccountId] = useState('1');
  const { show, ping } = useSavedToast();

  const months = useMemo(() => {
    const map = new Map<
      string,
      { label: string; year: number; month: number; txs: typeof transactions }
    >();
    transactions
      .filter((t) => t.accountId === accountId)
      .forEach((t) => {
        const d = new Date(t.timestamp);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!map.has(key)) {
          map.set(key, {
            label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            year: d.getFullYear(),
            month: d.getMonth(),
            txs: [],
          });
        }
        map.get(key)!.txs.push(t);
      });
    return [...map.values()].sort((a, b) => b.year - a.year || b.month - a.month);
  }, [transactions, accountId]);

  const download = (m: (typeof months)[number]) => {
    const acc = accounts.find((a) => a.id === accountId)!;
    const lines = [
      'WELLS FARGO STATEMENT',
      `Account holder: ${profile.userName}`,
      `Account: ${acc.name} (...${acc.lastFour})  ${accountNumber}`,
      `Period: ${m.label}`,
      '',
      'DATE,DESCRIPTION,CATEGORY,TYPE,AMOUNT',
      ...m.txs.map(
        (t) =>
          `${new Date(t.timestamp).toLocaleDateString('en-US')},${t.name},${t.category},${t.type},${
            t.type === 'debit' ? '-' : '+'
          }${t.amount.toFixed(2)}`,
      ),
      '',
      `Transactions: ${m.txs.length}`,
      `Debits: $${m.txs
        .filter((t) => t.type === 'debit')
        .reduce((s, t) => s + t.amount, 0)
        .toFixed(2)}`,
      `Credits: $${m.txs
        .filter((t) => t.type === 'credit')
        .reduce((s, t) => s + t.amount, 0)
        .toFixed(2)}`,
    ].join('\n');

    const url = URL.createObjectURL(new Blob([lines], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `statement-${acc.lastFour}-${m.label.replace(' ', '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    ping();
  };

  return (
    <PageShell
      title="Statements"
      subtitle="Download monthly account statements (CSV)"
      onBack={() => onNavigate('profile')}
    >
      <div className="flex gap-2 overflow-x-auto pb-1">
        {accounts.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAccountId(a.id)}
            className={`px-4 py-2 min-h-[42px] rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              accountId === a.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {a.name} (•••• {a.lastFour})
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground mb-3 px-1">
          {months.length} statements available
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {months.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => download(m)}
              className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 text-left hover:border-primary/40 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{m.label}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {m.txs.length} transactions
                </p>
              </div>
              <Download className="w-4 h-4 text-primary shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <SavedToast show={show} message="Statement downloaded" />
    </PageShell>
  );
};

export default StatementsPage;
