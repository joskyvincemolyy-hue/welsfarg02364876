import { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  X,
} from 'lucide-react';
import { PageShell, Section, SavedToast } from '@/components/settings/SettingsUI';
import { useSavedToast } from '@/hooks/use-saved-toast';
import { useBanking } from '@/contexts/BankingContext';

const FAQS = [
  {
    q: 'How do I reset my password?',
    a: 'Go to Profile > Security Center > Change Password, enter your current password and choose a new one of at least 8 characters.',
  },
  {
    q: 'How long do transfers take?',
    a: 'Internal transfers are instant. Domestic wires post the same business day when submitted before 2:00 PM local time. International wires take 1–3 business days.',
  },
  {
    q: 'How do I freeze a lost card?',
    a: 'Open Profile > Manage Cards, select the affected card and switch on "Freeze card". You can unfreeze it at any time.',
  },
  {
    q: 'Where can I find my statements?',
    a: 'Statements lets you pick any account and download monthly activity statements as a CSV file.',
  },
  {
    q: 'What are the wire transfer fees?',
    a: 'Domestic outgoing wires cost $25, international outgoing wires $45, and incoming wires $15.',
  },
];

const HelpSupportPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { profile } = useBanking();
  const [open, setOpen] = useState<number | null>(0);
  const [form, setForm] = useState({ subject: '', message: '' });
  const { show, ping } = useSavedToast();
  const [sent, setSent] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'agent' | 'user'; text: string }[]>([
    {
      from: 'agent',
      text: `Hello ${profile.userName.split(' ')[0]}! How can a Wells Fargo specialist assist you today?`,
    },
  ]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;
    setForm({ subject: '', message: '' });
    setSent(true);
    ping();
    window.setTimeout(() => setSent(false), 4000);
  };

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { from: 'user', text },
      {
        from: 'agent',
        text: 'Thank you for reaching out. A dedicated Premier Banking specialist has logged your inquiry and can assist further by phone at 1-800-869-3557 if urgent.',
      },
    ]);
    setChatInput('');
  };

  return (
    <PageShell
      title="Help & Support"
      subtitle="24/7 customer care, branch locator, and FAQs"
      onBack={() => onNavigate('dashboard')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-6">
          <Section title="Contact Options">
            <a
              href="tel:18008693557"
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Call support</p>
                <p className="text-xs text-muted-foreground">1-800-869-3557 · Available 24/7</p>
              </div>
            </a>

            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Chat with us</p>
                <p className="text-xs text-muted-foreground">Average wait under 2 minutes</p>
              </div>
            </button>

            <a
              href="https://maps.google.com/?q=Wells+Fargo+branch"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Find a branch or ATM</p>
                <p className="text-xs text-muted-foreground">Search nearby locations</p>
              </div>
            </a>

            <a
              href="tel:18008693557"
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Report fraud</p>
                <p className="text-xs text-muted-foreground">Immediate unauthorized activity line</p>
              </div>
            </a>
          </Section>

          <Section title="Send Us a Message">
            <form onSubmit={submit} className="p-5 space-y-3">
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Subject"
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-background border border-border text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
                rows={4}
                className="w-full bg-background border border-border rounded-xl p-3.5 text-sm text-foreground focus:outline-none focus:border-primary"
              />
              {sent && (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Message sent. A specialist will reply within 24 hours.
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground rounded-xl py-3 min-h-[46px] text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Send message
              </button>
            </form>
          </Section>
        </div>

        <div className="lg:col-span-7">
          <Section title="Frequently Asked Questions">
            {FAQS.map((f, i) => (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <p className="flex-1 text-sm font-semibold text-foreground">{f.q}</p>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${
                      open === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {open === i && (
                  <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </Section>
        </div>
      </div>

      {chatOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-card border border-border rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md overflow-hidden shadow-xl flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Wells Fargo Support Chat</p>
                <p className="text-xs text-muted-foreground">Premier Banking Desk</p>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                aria-label="Close support chat"
                className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.from === 'user'
                      ? 'ml-auto bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={sendChat} className="p-3 border-t border-border flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                aria-label="Send chat message"
                className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <SavedToast show={show} message="Message sent" />
    </PageShell>
  );
};

export default HelpSupportPage;
