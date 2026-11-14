import {
  ButtonHTMLAttributes,
  FormHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import type { CSSProperties } from "react";
import { Check, ChevronRight, Info, X } from "lucide-react";
import { haptics, webApp } from "../lib/telegram";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  haptic?: "light" | "medium" | "none";
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  haptic = "light",
  children,
  onClick,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={["ui-button", "ui-button--" + variant, "ui-button--" + size, className].filter(Boolean).join(" ")}
      onClick={(event) => {
        if (haptic === "light") haptics.light();
        if (haptic === "medium") haptics.medium();
        onClick?.(event);
      }}
    >
      {loading && <span className="ui-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function Input({
  label,
  hint,
  error,
  className = "",
  id,
  disabled,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = error || hint ? inputId + "-message" : undefined;

  return (
    <div className="ui-field">
      {label && <label className="ui-field__label" htmlFor={inputId}>{label}</label>}
      <input
        {...props}
        id={inputId}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={messageId}
        className={["ui-input", error ? "ui-input--error" : "", className].filter(Boolean).join(" ")}
      />
      {error && <span className="ui-field__error" id={messageId}>{error}</span>}
      {!error && hint && <span className="ui-field__hint" id={messageId}>{hint}</span>}
    </div>
  );
}

export function Card({
  children,
  className = "",
  padding = "md",
  ...props
}: {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
} & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={["ui-card", "ui-card--" + padding, className].filter(Boolean).join(" ")}>{children}</div>;
}

type BadgeTone = "neutral" | "blue" | "green" | "orange" | "red";
export function Badge({ children, tone = "neutral", dot = false }: {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
}) {
  return <span className={"ui-badge ui-badge--" + tone}>{dot && <i aria-hidden="true" />}{children}</span>;
}

export function Avatar({ name, src, size = "md" }: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return (
    <span className={"ui-avatar ui-avatar--" + size}>
      {src ? <img src={src} alt={name} /> : <span aria-label={name}>{initials || "?"}</span>}
    </span>
  );
}

export function Divider({ className = "", vertical = false }: { className?: string; vertical?: boolean }) {
  return <hr className={["ui-divider", vertical ? "ui-divider--vertical" : "", className].filter(Boolean).join(" ")} />;
}

export type TabItem<T extends string> = { value: T; label: string; disabled?: boolean };
export function Tabs<T extends string>({ items, value, onChange, label = "Разделы" }: {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}) {
  return (
    <div className="ui-tabs" role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          aria-disabled={item.disabled || undefined}
          disabled={item.disabled}
          className={value === item.value ? "is-active" : ""}
          onClick={() => {
            haptics.selection();
            onChange(item.value);
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function Switch({ checked, onChange, label, description, disabled = false }: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className={"ui-switch-row" + (disabled ? " is-disabled" : "")}>
      <span className="ui-control-copy">
        <strong id={id + "-label"}>{label}</strong>
        {description && <small id={id + "-description"}>{description}</small>}
      </span>
      <button
        type="button"
        role="switch"
        aria-labelledby={id + "-label"}
        aria-describedby={description ? id + "-description" : undefined}
        aria-checked={checked}
        disabled={disabled}
        className={"ui-switch" + (checked ? " is-on" : "")}
        onClick={() => {
          haptics.selection();
          onChange(!checked);
        }}
      >
        <i />
      </button>
    </div>
  );
}

export function Checkbox({ checked, onChange, label, disabled = false, name }: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
  name?: string;
}) {
  const id = useId();
  return (
    <label className={"ui-check-row" + (disabled ? " is-disabled" : "")} htmlFor={id}>
      <input
        id={id}
        className="ui-checkbox__input"
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          haptics.selection();
          onChange(event.target.checked);
        }}
      />
      <span className={"ui-checkbox" + (checked ? " is-checked" : "")} aria-hidden="true">
        {checked && <Check size={13} />}
      </span>
      <span className="ui-check-row__label">{label}</span>
    </label>
  );
}

export function Radio({ name, value, checked, onChange, label, description, disabled = false }: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <label className={"ui-radio-row" + (disabled ? " is-disabled" : "")} htmlFor={id}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => {
          haptics.selection();
          onChange(value);
        }}
      />
      <i aria-hidden="true" />
      <span className="ui-control-copy">
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
    </label>
  );
}

export function RadioGroup<T extends string>({ value, onChange, options, name, disabled = false }: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; description?: string; disabled?: boolean }[];
  name: string;
  disabled?: boolean;
}) {
  return (
    <div className="ui-radio-group" role="radiogroup">
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={(nextValue) => onChange(nextValue as T)}
          label={option.label}
          description={option.description}
          disabled={disabled || option.disabled}
        />
      ))}
    </div>
  );
}

export function ListItem({ title, description, leading, trailing, onClick, disabled = false }: {
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const content = (
    <>
      {leading && <span className="ui-list-item__leading">{leading}</span>}
      <span className="ui-list-item__body">
        <strong>{title}</strong>
        {description && <small>{description}</small>}
      </span>
      {trailing && <span className="ui-list-item__trailing">{trailing}</span>}
      {!trailing && onClick && <span className="ui-list-item__trailing"><ChevronRight size={18} /></span>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="ui-list-item ui-list-item--interactive"
        disabled={disabled}
        onClick={() => {
          haptics.light();
          onClick();
        }}
      >
        {content}
      </button>
    );
  }

  return <div className="ui-list-item">{content}</div>;
}

export function Skeleton({ width = "100%", height = 16, radius = 8, className = "" }: {
  width?: string | number;
  height?: string | number;
  radius?: number;
  className?: string;
}) {
  const style: CSSProperties = { width, height, borderRadius: radius };
  return <span className={["ui-skeleton", className].filter(Boolean).join(" ")} style={style} aria-hidden="true" />;
}

export function EmptyState({ title, description, action, icon }: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="ui-empty">
      <span className="ui-empty__icon">{icon || <Info size={22} />}</span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

type ToastTone = "success" | "error" | "info" | "warning";
type ToastItem = { id: number; message: string; tone: ToastTone };
type ToastContextValue = { show: (message: string, tone?: ToastTone) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) window.clearTimeout(timer);
    timers.current.delete(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const show = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((current) => [...current, { id, message, tone }]);
    const timer = window.setTimeout(() => dismiss(id), 3200);
    timers.current.set(id, timer);
  }, [dismiss]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="ui-toasts" aria-live="polite" aria-relevant="additions">
        {items.map((item) => (
          <div className={"ui-toast ui-toast--" + item.tone} key={item.id} role="status">
            <span>{item.message}</span>
            <button type="button" onClick={() => dismiss(item.id)} aria-label="Закрыть уведомление">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast должен использоваться внутри ToastProvider");
  return context;
}

export function Modal({ open, onClose, title, children, footer }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ui-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section ref={dialogRef} className="ui-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <header className="ui-overlay-header">
          <strong id={titleId}>{title}</strong>
          <button type="button" onClick={onClose} aria-label="Закрыть"><X size={18} /></button>
        </header>
        <div className="ui-modal__content">{children}</div>
        {footer && <footer className="ui-modal__footer">{footer}</footer>}
      </section>
    </div>
  );
}

export function BottomSheet({ open, onClose, title, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    sheetRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ui-sheet-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section ref={sheetRef} className="ui-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="ui-sheet__handle" aria-hidden="true" />
        <header className="ui-overlay-header">
          <strong id={titleId}>{title}</strong>
          <button type="button" onClick={onClose} aria-label="Закрыть"><X size={18} /></button>
        </header>
        <div className="ui-sheet__content">{children}</div>
      </section>
    </div>
  );
}

export function TelegramBackButton({ onClick, visible = true }: { onClick: () => void; visible?: boolean }) {
  useEffect(() => {
    const back = webApp()?.BackButton;
    if (!back) return;
    if (!visible) {
      back.hide();
      return;
    }
    back.show();
    back.onClick(onClick);
    return () => {
      back.offClick(onClick);
      back.hide();
    };
  }, [onClick, visible]);

  return null;
}

export function AppHeader({ title, subtitle, onBack, right }: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <>
      {onBack && <TelegramBackButton onClick={onBack} />}
      <header className="app-header">
        <div className="app-header__main">
          {onBack && (
            <button type="button" className="app-header__back" onClick={onBack} aria-label="Назад">
              ‹
            </button>
          )}
          <span className="app-header__titles">
            <strong>{title}</strong>
            {subtitle && <small>{subtitle}</small>}
          </span>
        </div>
        {right}
      </header>
    </>
  );
}

export function BottomNavigation({ items, active, onChange, label = "Основная навигация" }: {
  items: { id: string; label: string; icon: ReactNode }[];
  active: string;
  onChange: (id: string) => void;
  label?: string;
}) {
  return (
    <nav className="bottom-nav" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={active === item.id ? "is-active" : ""}
          aria-current={active === item.id ? "page" : undefined}
          onClick={() => {
            haptics.selection();
            onChange(item.id);
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export function TelegramMainButton({ text, onClick, visible = true, disabled = false, loading = false }: {
  text: string;
  onClick: () => void;
  visible?: boolean;
  disabled?: boolean;
  loading?: boolean;
}) {
  useEffect(() => {
    const button = webApp()?.MainButton;
    if (!button) return;
    if (!visible) {
      button.hide();
      return;
    }

    button.setText(text);
    button.show();
    if (disabled || loading) button.disable();
    else button.enable();
    if (loading) button.showProgress?.(false);
    else button.hideProgress?.();
    button.onClick(onClick);

    return () => {
      button.offClick(onClick);
      button.hideProgress?.();
      button.hide();
    };
  }, [text, onClick, visible, disabled, loading]);

  return null;
}
