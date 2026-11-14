import type { FormHTMLAttributes, ReactNode } from "react";

export function PageLayout({
  header,
  footer,
  children,
  className = "",
  contentClassName = ""
}: {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div className={["ui-page-layout", className].filter(Boolean).join(" ")}>
      {header}
      <main className={["ui-page-layout__content", contentClassName].filter(Boolean).join(" ")}>
        {children}
      </main>
      {footer}
    </div>
  );
}

export function Section({
  title,
  description,
  eyebrow,
  action,
  children,
  className = ""
}: {
  title?: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={["ui-section", className].filter(Boolean).join(" ")}>
      {(title || description || eyebrow || action) && (
        <header className="ui-section__header">
          <div className="ui-section__copy">
            {eyebrow && <span className="ui-section__eyebrow">{eyebrow}</span>}
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {action && <div className="ui-section__action">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Form({
  children,
  className = "",
  onSubmit,
  ...props
}: FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      {...props}
      className={["ui-form", className].filter(Boolean).join(" ")}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}
