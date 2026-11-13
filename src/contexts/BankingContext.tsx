import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export interface Transaction {
  id: string;
  name: string;
  date: string;
  timestamp: number;
  amount: number;
  type: 'debit' | 'credit';
  icon?: string;
  category: string;
  accountId: string;
  status: 'completed' | 'pending';
}

export interface Account {
  id: string;
  name: string;
  type: string;
  lastFour: string;
  balance: number;
}

export interface CardInfo {
  id: string;
  accountId: string;
  name: string;
  lastFour: string;
  brand: string;
  expires: string;
  frozen: boolean;
  contactless: boolean;
  onlinePayments: boolean;
  internationalUse: boolean;
  spendLimit: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

export interface Settings {
  biometrics: boolean;
  twoFactor: boolean;
  loginAlerts: boolean;
  pushNotifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  marketingEmails: boolean;
  lowBalanceAlerts: boolean;
  lowBalanceThreshold: number;
  internationalWires: boolean;
  wireCurrency: string;
  wireDailyLimit: number;
  swiftCode: string;
  darkMode: boolean;
  language: string;
  hideBalances: boolean;
  quickBalance: boolean;
  shareDataPartners: boolean;
  personalizedOffers: boolean;
  locationTracking: boolean;
  analyticsOptIn: boolean;
}

export interface Profile {
  userName: string;
  sex: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  occupation: string;
  avatarUrl?: string;
}

const DEFAULT_SETTINGS: Settings = {
  biometrics: true,
  twoFactor: true,
  loginAlerts: true,
  pushNotifications: true,
  emailAlerts: true,
  smsAlerts: false,
  marketingEmails: false,
  lowBalanceAlerts: true,
  lowBalanceThreshold: 500,
  internationalWires: true,
  wireCurrency: 'USD',
  wireDailyLimit: 50000,
  swiftCode: 'WFBIUS6S',
  darkMode: false,
  language: 'English',
  hideBalances: false,
  quickBalance: true,
  shareDataPartners: false,
  personalizedOffers: true,
  locationTracking: false,
  analyticsOptIn: true,
};

const DEFAULT_PROFILE: Profile = {
  userName: 'Kenneth Pusch',
  sex: 'Male',
  email: 'safepal320@gmail.com',
  phone: '+16475042457',
  address: '2964 Desplaines Ave N, Riverside, IL 60546',
  dateOfBirth: '08/04/1960',
  occupation: 'Private Investor',
};

const DEFAULT_CARDS: CardInfo[] = [
  {
    id: 'c1',
    accountId: '1',
    name: 'Visa Signature',
    lastFour: '6305',
    brand: 'Visa',
    expires: '09/28',
    frozen: false,
    contactless: true,
    onlinePayments: true,
    internationalUse: false,
    spendLimit: 10000,
  },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Security Alert', desc: 'New sign-in detected from your recognized device', time: 'Just now', unread: true },
  { id: 'n2', title: 'Payment Received', desc: 'Casey Newman sent you $50.00 via Everyday Checking', time: '2h ago', unread: true },
  { id: 'n3', title: 'Statement Ready', desc: 'Your monthly statement for Everyday Checking is available', time: '1d ago', unread: false },
  { id: 'n4', title: 'Card Activity', desc: 'Visa Signature payment reminder due in 5 days', time: '3d ago', unread: false },
];

const MERCHANTS: { name: string; category: string; type: 'debit' | 'credit'; min: number; max: number }[] = [
  { name: 'UberX', category: 'Transport', type: 'debit', min: 8, max: 62 },
  { name: 'Lyft', category: 'Transport', type: 'debit', min: 7, max: 55 },
  { name: 'Shell Gas Station', category: 'Transport', type: 'debit', min: 25, max: 95 },
  { name: "McDonald's", category: 'Food', type: 'debit', min: 4, max: 28 },
  { name: 'Starbucks', category: 'Food', type: 'debit', min: 3, max: 19 },
  { name: 'Whole Foods Market', category: 'Groceries', type: 'debit', min: 22, max: 240 },
  { name: 'Trader Joes', category: 'Groceries', type: 'debit', min: 18, max: 160 },
  { name: 'Netflix', category: 'Entertainment', type: 'debit', min: 15.99, max: 15.99 },
  { name: 'Spotify', category: 'Entertainment', type: 'debit', min: 11.99, max: 11.99 },
  { name: 'Amazon', category: 'Shopping', type: 'debit', min: 9, max: 480 },
  { name: 'Apple Store', category: 'Shopping', type: 'debit', min: 29, max: 1299 },
  { name: 'Target', category: 'Shopping', type: 'debit', min: 12, max: 320 },
  { name: 'Delta Airlines', category: 'Travel', type: 'debit', min: 180, max: 1450 },
  { name: 'Marriott Hotels', category: 'Travel', type: 'debit', min: 145, max: 890 },
  { name: 'PG&E Utility', category: 'Bills', type: 'debit', min: 60, max: 310 },
  { name: 'AT&T Wireless', category: 'Bills', type: 'debit', min: 45, max: 190 },
  { name: 'Blue Cross Insurance', category: 'Bills', type: 'debit', min: 210, max: 520 },
  { name: 'ATM Withdrawal', category: 'Cash withdrawal', type: 'debit', min: 40, max: 800 },
  { name: 'Emily Gordon', category: 'Transfer', type: 'debit', min: 20, max: 900 },
  { name: 'Marcus Reed', category: 'Transfer', type: 'debit', min: 25, max: 1200 },
  { name: 'Casey Newman', category: 'Transfer', type: 'credit', min: 30, max: 1500 },
  { name: 'Salary Deposit', category: 'Income', type: 'credit', min: 4200, max: 6800 },
  { name: 'Dividend Payout', category: 'Income', type: 'credit', min: 120, max: 4300 },
  { name: 'Refund - Amazon', category: 'Income', type: 'credit', min: 12, max: 310 },
  { name: 'Interest Payment', category: 'Income', type: 'credit', min: 2, max: 95 },
];

const ACCOUNT_IDS = ['1'];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatDate(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (sameDay) return `Today, ${time}`;
  const yest = new Date(now.getTime() - 86400000);
  if (d.toDateString() === yest.toDateString()) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}, ${time}`;
}

function generateTransactions(count: number): Transaction[] {
  const rand = mulberry32(20260813);
  const now = Date.now();
  const list: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const m = MERCHANTS[Math.floor(rand() * MERCHANTS.length)];
    const amount = Math.round((m.min + rand() * (m.max - m.min)) * 100) / 100;
    const ts = now - Math.floor(i * (1000 * 60 * 60 * 26) + rand() * 1000 * 60 * 60 * 20);
    list.push({
      id: `tx-${i + 1}`,
      name: m.name,
      category: m.category,
      type: m.type,
      amount,
      timestamp: ts,
      date: formatDate(ts),
      accountId: ACCOUNT_IDS[Math.floor(rand() * ACCOUNT_IDS.length)],
      status: i < 3 && rand() > 0.6 ? 'pending' : 'completed',
    });
  }
  return list;
}

interface BankingContextType {
  accounts: Account[];
  transactions: Transaction[];
  cards: CardInfo[];
  settings: Settings;
  profile: Profile;
  notifications: NotificationItem[];
  userName: string;
  accountNumber: string;
  routingNumber: string;
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp' | 'status'> & { timestamp?: number }) => void;
  debitAccount: (accountId: string, amount: number) => void;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  updateCard: (cardId: string, patch: Partial<CardInfo>) => void;
  markAllNotificationsRead: () => void;
  formatMoney: (amount: number, forceShow?: boolean) => string;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const useBanking = () => {
  const ctx = useContext(BankingContext);
  if (!ctx) throw new Error('useBanking must be used within BankingProvider');
  return ctx;
};

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? (parsed as T) : fallback;
    }
    if (typeof fallback === 'object' && fallback !== null) {
      return { ...fallback, ...parsed };
    }
    return parsed as T;
  } catch {
    return fallback;
  }
};

export const BankingProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Everyday Checking', type: 'checking', lastFour: '6305', balance: 72380.23 },
  ]);

  const generated = useMemo(() => generateTransactions(1000), []);
  const [transactions, setTransactions] = useState<Transaction[]>(generated);
  const [cards, setCards] = useState<CardInfo[]>(() => load<CardInfo[]>('wf_cards_v4', DEFAULT_CARDS));
  const [settings, setSettings] = useState<Settings>(() => load<Settings>('wf_settings_v2', DEFAULT_SETTINGS));
  const [profile, setProfile] = useState<Profile>(() => load<Profile>('wf_profile_v3', DEFAULT_PROFILE));
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    try {
      localStorage.setItem('wf_settings_v2', JSON.stringify(settings));
    } catch {
      // ignore storage quota errors
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('wf_profile_v3', JSON.stringify(profile));
    } catch {
      // ignore storage quota errors
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('wf_cards_v4', JSON.stringify(cards));
    } catch {
      // ignore storage quota errors
    }
  }, [cards]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  const addTransaction: BankingContextType['addTransaction'] = (tx) => {
    const ts = tx.timestamp ?? Date.now();
    setTransactions((prev) => [{ ...tx, id: `tx-${Date.now()}`, timestamp: ts, status: 'completed' }, ...prev]);
  };

  const debitAccount = (accountId: string, amount: number) => {
    setAccounts((prev) => prev.map((a) => (a.id === accountId ? { ...a, balance: a.balance - amount } : a)));
  };

  const updateSetting: BankingContextType['updateSetting'] = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateProfile = (patch: Partial<Profile>) => setProfile((prev) => ({ ...prev, ...patch }));

  const updateCard = (cardId: string, patch: Partial<CardInfo>) =>
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, ...patch } : c)));

  const markAllNotificationsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const formatMoney = (amount: number, forceShow = false) => {
    if (settings.hideBalances && !forceShow) return '••••••';
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <BankingContext.Provider
      value={{
        accounts,
        transactions,
        cards,
        settings,
        profile,
        notifications,
        userName: profile.userName,
        accountNumber: '4829176305',
        routingNumber: '121000248',
        addTransaction,
        debitAccount,
        updateSetting,
        updateProfile,
        updateCard,
        markAllNotificationsRead,
        formatMoney,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};
