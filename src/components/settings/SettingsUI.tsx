import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

export const PageShell = ({
  title,
  onBack,
  children,
  subtitle,
  maxWidth = 'max-w-5xl',
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: ReactNode;
  maxWidth?: string;
}) => (
  <div className={`w-full ${maxWidth} mx-auto space-y-6`}>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors shrink-0"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</p>}
      </div>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

export const Section = ({ title, children }: { title?: string; children: ReactNode }) => (
  <div>
    {title && (
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground mb-2.5 px-1">
        {title}
      </h2>
    )}
    <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
      {children}
    </div>
  </div>
);

export const ToggleRow = ({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-4 p-4 min-h-[60px]">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full transition-colors shrink-0 flex items-center px-1 cursor-pointer ${
        checked ? 'bg-primary' : 'bg-muted border border-border'
      }`}
    >
      <span
        className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const SelectRow = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center justify-between gap-4 p-4 min-h-[60px]">
    <p className="flex-1 text-sm font-semibold text-foreground">{label}</p>
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-muted border border-border text-foreground text-sm rounded-lg px-3 py-2 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

export const InputRow = ({
  label,
  value,
  onChange,
  type = 'text',
  prefix,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  prefix?: string;
}) => (
  <div className="p-4">
    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
    <div className="flex items-center gap-1.5">
      {prefix && <span className="text-sm font-medium text-muted-foreground">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm font-semibold text-foreground border-b border-border focus:border-primary focus:outline-none py-1.5 tabular-nums"
      />
    </div>
  </div>
);

export const SavedToast = ({ show, message = 'Changes saved' }: { show: boolean; message?: string }) => (
  <div
    role="status"
    aria-live="polite"
    className={`fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg transition-all duration-200 z-50 whitespace-nowrap ${
      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
    }`}
  >
    {message}
  </div>
);
