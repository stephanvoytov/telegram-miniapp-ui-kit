import {
  ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, createContext,
  useContext, useEffect, useState
} from "react";
import { Check, ChevronRight, Info, X } from "lucide-react";
import { haptics, webApp } from "../lib/telegram";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  variant = "primary", size = "md", loading = false, children, onClick,
  className = "", disabled, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant; size?: ButtonSize; loading?: boolean;
}) {
  return <button {...props} disabled={disabled || loading}
    className={`ui-button ui-button--${variant} ui-button--${size} ${className}`}
    onClick={(event) => { haptics.light(); onClick?.(event); }}>
    {loading && <span className="ui-spinner" aria-hidden="true" />}
    {children}
  </button>;
}

export function Input({ label, hint, error, className = "", ...props }:
  InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }) {
  return <label className="ui-field">
    {label && <span className="ui-field__label">{label}</span>}
    <input className={`ui-input ${error ? "ui-input--error" : ""} ${className}`} {...props} />
    {error ? <span className="ui-field__error">{error}</span> : hint && <span className="ui-field__hint">{hint}</span>}
  </label>;
}

export function Card({ children, className = "", padding = "md" }:
  { children: ReactNode; className?: string; padding?: "none" | "sm" | "md" | "lg" }) {
  return <div className={`ui-card ui-card--${padding} ${className}`}>{children}</div>;
}

type BadgeTone = "neutral" | "blue" | "green" | "orange" | "red";
export function Badge({ children, tone = "neutral", dot = false }:
  { children: ReactNode; tone?: BadgeTone; dot?: boolean }) {
  return <span className={`ui-badge ui-badge--${tone}`}>{dot && <i />}{children}</span>;
}

export function Avatar({ name, src, size = "md" }:
  { name: string; src?: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase();
  return <span className={`ui-avatar ui-avatar--${size}`}>
    {src ? <img src={src} alt={name} /> : initials}
  </span>;
}

export function Divider({ className = "" }: { className?: string }) {
  return <div className={`ui-divider ${className}`} role="separator" />;
}

export function Tabs<T extends string>({ items, value, onChange }:
  { items: { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return <div className="ui-tabs" role="tablist">
    {items.map(item => <button key={item.value} type="button" role="tab"
      aria-selected={value === item.value} className={value === item.value ? "is-active" : ""}
      onClick={() => { haptics.selection(); onChange(item.value); }}>{item.label}</button>)}
  </div>;
}

export function Switch({ checked, onChange, label, description, disabled = false }:
  { checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string; disabled?: boolean }) {
  return <label className={`ui-switch-row ${disabled ? "is-disabled" : ""}`}>
    <span><strong>{label}</strong>{description && <small>{description}</small>}</span>
    <button type="button" role="switch" aria-checked={checked} disabled={disabled}
      className={`ui-switch ${checked ? "is-on" : ""}`}
      onClick={() => { haptics.selection(); onChange(!checked); }}><i /></button>
  </label>;
}

export function Checkbox({ checked, onChange, label, disabled = false }:
  { checked: boolean; onChange: (checked: boolean) => void; label: string; disabled?: boolean }) {
  return <label className={`ui-check-row ${disabled ? "is-disabled" : ""}`}>
    <button type="button" role="checkbox" aria-checked={checked} disabled={disabled}
      className={`ui-checkbox ${checked ? "is-checked" : ""}`}
      onClick={() => { haptics.selection(); onChange(!checked); }}>{checked && <Check size={13} />}</button>
    <span>{label}</span>
  </label>;
}

export function RadioGroup<T extends string>({ value, onChange, options, name }:
  { value: T; onChange: (value: T) => void; options: { value: T; label: string; description?: string }[]; name: string }) {
  return <div className="ui-radio-group">
    {options.map(option => <label key={option.value} className="ui-radio-row">
      <input type="radio" name={name} value={option.value} checked={value === option.value}
        onChange={() => { haptics.selection(); onChange(option.value); }} />
      <i /><span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
    </label>)}
  </div>;
}

export function ListItem({ title, description, leading, trailing, onClick }:
  { title: string; description?: string; leading?: ReactNode; trailing?: ReactNode; onClick?: () => void }) {
  const content = <><span className="ui-list-item__leading">{leading}</span>
    <span className="ui-list-item__body"><strong>{title}</strong>{description && <small>{description}</small>}</span>
    <span className="ui-list-item__trailing">{trailing ?? (onClick && <ChevronRight size={17} />)}</span></>;
  return onClick ? <button className="ui-list-item" onClick={() => { haptics.light(); onClick(); }}>{content}</button>
    : <div className="ui-list-item">{content}</div>;
}

export function Skeleton({ width = "100%", height = 16, radius = 8 }:
  { width?: string | number; height?: number; radius?: number }) {
  return <span className="ui-skeleton" style={{ width, height, borderRadius: radius }} />;
}

export function EmptyState({ title, description, action }:
  { title: string; description?: string; action?: ReactNode }) {
  return <div className="ui-empty"><span className="ui-empty__icon"><Info size={22} /></span>
    <strong>{title}</strong>{description && <p>{description}</p>}{action}</div>;
}

type ToastItem = { id: number; message: string; tone: "success" | "error" | "info" };
const ToastContext = createContext<{ show: (message: string, tone?: ToastItem["tone"]) => void } | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const show = (message: string, tone: ToastItem["tone"] = "info") => {
    const id = Date.now() + Math.random();
    setItems(current => [...current, { id, message, tone }]);
    window.setTimeout(() => setItems(current => current.filter(item => item.id !== id)), 2800);
  };
  return <ToastContext.Provider value={{ show }}>{children}
    <div className="ui-toasts" aria-live="polite">{items.map(item =>
      <div className={`ui-toast ui-toast--${item.tone}`} key={item.id}>
        <span>{item.message}</span><button onClick={() => setItems(v => v.filter(x => x.id !== item.id))} aria-label="Dismiss"><X size={15} /></button>
      </div>)}</div>
  </ToastContext.Provider>;
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

export function Modal({ open, onClose, title, children, footer }:
  { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return <div className="ui-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="ui-modal" role="dialog" aria-modal="true" aria-label={title}>
      <header><strong>{title}</strong><button onClick={onClose} aria-label="Close"><X size={18} /></button></header>
      <div className="ui-modal__content">{children}</div>{footer && <footer>{footer}</footer>}
    </section>
  </div>;
}

export function BottomSheet({ open, onClose, title, children }:
  { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return <div className="ui-sheet-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="ui-sheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="ui-sheet__handle" /><header><strong>{title}</strong><button onClick={onClose} aria-label="Close"><X size={18} /></button></header>
      <div className="ui-sheet__content">{children}</div>
    </section>
  </div>;
}

export function AppHeader({ title, subtitle, onBack, right }:
  { title: string; subtitle?: string; onBack?: () => void; right?: ReactNode }) {
  useEffect(() => {
    const back = webApp()?.BackButton;
    if (!back || !onBack) return;
    back.show(); back.onClick(onBack);
    return () => { back.offClick(onBack); back.hide(); };
  }, [onBack]);
  return <header className="app-header">
    <div>{onBack && <button className="app-header__back" onClick={onBack} aria-label="Back">‹</button>}
      <span><strong>{title}</strong>{subtitle && <small>{subtitle}</small>}</span></div>{right}
  </header>;
}

export function BottomNavigation({ items, active, onChange }:
  { items: { id: string; label: string; icon: ReactNode }[]; active: string; onChange: (id: string) => void }) {
  return <nav className="bottom-nav">{items.map(item => <button key={item.id}
    className={active === item.id ? "is-active" : ""} onClick={() => { haptics.selection(); onChange(item.id); }}>
    {item.icon}<span>{item.label}</span></button>)}</nav>;
}

export function TelegramMainButton({ text, onClick, visible = true, disabled = false }:
  { text: string; onClick: () => void; visible?: boolean; disabled?: boolean }) {
  useEffect(() => {
    const button = webApp()?.MainButton;
    if (!button || !visible) return;
    button.setText(text); button.show(); disabled ? button.disable() : button.enable(); button.onClick(onClick);
    return () => { button.offClick(onClick); button.hide(); };
  }, [text, onClick, visible, disabled]);
  return null;
}