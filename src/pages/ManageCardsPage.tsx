import { useState } from 'react';
import { CreditCard, Snowflake } from 'lucide-react';
import { useBanking } from '@/contexts/BankingContext';
import { PageShell, Section, ToggleRow, InputRow, SavedToast } from '@/components/settings/SettingsUI';
import { useSavedToast } from '@/hooks/use-saved-toast';
import visaLogo from '@/assets/visa-logo.svg';

const ManageCardsPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { cards, updateCard, userName } = useBanking();
  const [selectedId, setSelectedId] = useState(cards[0]?.id ?? '');
  const { show, ping } = useSavedToast();

  const change = (id: string, patch: Parameters<typeof updateCard>[1]) => {
    updateCard(id, patch);
    ping();
  };

  const selectedCard = cards.find((c) => c.id === selectedId) ?? cards[0];

  return (
    <PageShell
      title="Manage Cards"
      subtitle="View cards, freeze access, and configure spend limits"
      onBack={() => onNavigate('profile')}
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Card Selector List */}
        <div className="lg:col-span-5 space-y-4">
          {cards.map((card) => {
            const active = selectedCard?.id === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedId(card.id)}
                className={`w-full text-left rounded-2xl transition-all cursor-pointer ${
                  active ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className={`card-gradient rounded-2xl p-5 sm:p-6 relative overflow-hidden ${
                    card.frozen ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-white/85 text-sm font-medium">{card.name}</p>
                    {card.brand === 'Visa' ? (
                      <img src={visaLogo} alt="Visa" className="h-5 brightness-0 invert" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <p className="text-white text-base sm:text-lg tracking-[0.22em] font-mono mb-4 tabular-nums">
                    •••• •••• •••• {card.lastFour}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-[10px] tracking-wider">CARD HOLDER</p>
                      <p className="text-white text-xs sm:text-sm font-medium mt-0.5">
                        {userName.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-[10px] tracking-wider">EXPIRES</p>
                      <p className="text-white text-xs sm:text-sm font-medium font-mono mt-0.5 tabular-nums">
                        {card.expires}
                      </p>
                    </div>
                  </div>
                  {card.frozen && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-white/95 rounded-lg px-2.5 py-1">
                      <Snowflake className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-primary">Card Frozen</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Card Controls */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCard && (
            <Section title={`Controls for ${selectedCard.name} (•••• ${selectedCard.lastFour})`}>
              <ToggleRow
                label="Freeze card"
                desc="Temporarily block all new purchases and ATM withdrawals"
                checked={selectedCard.frozen}
                onChange={(v) => change(selectedCard.id, { frozen: v })}
              />
              <ToggleRow
                label="Contactless payments"
                desc="Allow tap-to-pay at supported terminals"
                checked={selectedCard.contactless}
                onChange={(v) => change(selectedCard.id, { contactless: v })}
              />
              <ToggleRow
                label="Online payments"
                desc="Allow e-commerce and in-app transactions"
                checked={selectedCard.onlinePayments}
                onChange={(v) => change(selectedCard.id, { onlinePayments: v })}
              />
              <ToggleRow
                label="International use"
                desc="Authorize transactions outside the United States"
                checked={selectedCard.internationalUse}
                onChange={(v) => change(selectedCard.id, { internationalUse: v })}
              />
              <InputRow
                label="Daily spend limit"
                prefix="$"
                type="number"
                value={selectedCard.spendLimit}
                onChange={(v) => change(selectedCard.id, { spendLimit: Number(v) || 0 })}
              />
            </Section>
          )}
        </div>
      </div>

      <SavedToast show={show} />
    </PageShell>
  );
};

export default ManageCardsPage;
