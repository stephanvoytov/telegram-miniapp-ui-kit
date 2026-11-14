type TelegramInsets = { top: number; right: number; bottom: number; left: number };
type TelegramEventName = "themeChanged" | "viewportChanged" | "safeAreaChanged" | "contentSafeAreaChanged";

export type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  isExpanded?: boolean;
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  viewportHeight?: number;
  viewportStableHeight?: number;
  safeAreaInset?: Partial<TelegramInsets>;
  contentSafeAreaInset?: Partial<TelegramInsets>;
  MainButton?: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    showProgress?: (leaveActive?: boolean) => void;
    hideProgress?: () => void;
    setParams?: (params: Record<string, string | boolean | number>) => void;
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
  onEvent?: (eventName: TelegramEventName, callback: () => void) => void;
  offEvent?: (eventName: TelegramEventName, callback: () => void) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export const webApp = (): TelegramWebApp | undefined => {
  if (typeof window === "undefined") return undefined;
  return window.Telegram?.WebApp;
};

function syncTheme(app: TelegramWebApp) {
  const root = document.documentElement;
  Object.entries(app.themeParams || {}).forEach(([key, value]) => {
    if (value) root.style.setProperty("--tg-theme-" + key.replace(/_/g, "-"), value);
  });
  root.dataset.theme = "telegram";
  root.style.colorScheme = app.colorScheme || "light";
}

function syncViewport(app?: TelegramWebApp) {
  const height = app?.viewportHeight || app?.viewportStableHeight || window.visualViewport?.height || window.innerHeight;
  if (height > 0) document.documentElement.style.setProperty("--ui-viewport-height", Math.round(height) + "px");
}

function syncSafeAreas(app?: TelegramWebApp) {
  const root = document.documentElement;
  const safe = app?.safeAreaInset;
  const content = app?.contentSafeAreaInset;
  const sides: (keyof TelegramInsets)[] = ["top", "right", "bottom", "left"];

  sides.forEach((side) => {
    if (typeof safe?.[side] === "number") {
      root.style.setProperty("--ui-tg-safe-" + side, safe[side] + "px");
    }
    if (typeof content?.[side] === "number") {
      root.style.setProperty("--ui-tg-content-safe-" + side, content[side] + "px");
    }
  });
}

export function initTelegram() {
  const app = webApp();
  const updateViewport = () => syncViewport(app);
  const updateTheme = () => {
    if (app) syncTheme(app);
  };
  const updateSafeAreas = () => syncSafeAreas(app);

  app?.ready?.();
  app?.expand?.();
  updateViewport();
  updateTheme();
  updateSafeAreas();

  app?.onEvent?.("themeChanged", updateTheme);
  app?.onEvent?.("viewportChanged", updateViewport);
  app?.onEvent?.("safeAreaChanged", updateSafeAreas);
  app?.onEvent?.("contentSafeAreaChanged", updateSafeAreas);

  window.addEventListener("resize", updateViewport);
  window.visualViewport?.addEventListener("resize", updateViewport);

  return () => {
    app?.offEvent?.("themeChanged", updateTheme);
    app?.offEvent?.("viewportChanged", updateViewport);
    app?.offEvent?.("safeAreaChanged", updateSafeAreas);
    app?.offEvent?.("contentSafeAreaChanged", updateSafeAreas);
    window.removeEventListener("resize", updateViewport);
    window.visualViewport?.removeEventListener("resize", updateViewport);
  };
}

export const haptics = {
  light: () => webApp()?.HapticFeedback?.impactOccurred("light"),
  medium: () => webApp()?.HapticFeedback?.impactOccurred("medium"),
  success: () => webApp()?.HapticFeedback?.notificationOccurred("success"),
  error: () => webApp()?.HapticFeedback?.notificationOccurred("error"),
  warning: () => webApp()?.HapticFeedback?.notificationOccurred("warning"),
  selection: () => webApp()?.HapticFeedback?.selectionChanged()
};

export function useTelegramTheme() {
  const app = webApp();
  return {
    colorScheme: app?.colorScheme ?? "light",
    themeParams: app?.themeParams ?? {}
  };
}
