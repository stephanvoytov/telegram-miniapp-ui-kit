export type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  isExpanded?: boolean;
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  viewportHeight?: number;
  viewportStableHeight?: number;
  isClosingConfirmationEnabled?: boolean;
  MainButton?: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export const webApp = (): TelegramWebApp | undefined => window.Telegram?.WebApp;

export function initTelegram() {
  const app = webApp();
  app?.ready?.();
  app?.expand?.();
  return app;
}

export const haptics = {
  light: () => webApp()?.HapticFeedback?.impactOccurred("light"),
  medium: () => webApp()?.HapticFeedback?.impactOccurred("medium"),
  success: () => webApp()?.HapticFeedback?.notificationOccurred("success"),
  error: () => webApp()?.HapticFeedback?.notificationOccurred("error"),
  selection: () => webApp()?.HapticFeedback?.selectionChanged()
};

export function useTelegramTheme() {
  const app = webApp();
  return {
    colorScheme: app?.colorScheme ?? "light",
    themeParams: app?.themeParams ?? {}
  };
}