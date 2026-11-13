# Telegram Mini App UI Kit

A lightweight, reusable React + TypeScript UI kit for Telegram Mini Apps. The visual language is inspired by clean fintech products: restrained surfaces, clear hierarchy, Telegram blue accents and compact interaction patterns.

## Quick start

```bash
npm install
npm run dev
```

Production build and type check:

```bash
npm run typecheck
npm run build
```

## What's included

- Design tokens with light, dark and Telegram theme modes
- Button, Input, Card, Badge, Avatar, Divider, Tabs
- Switch, Checkbox, RadioGroup, ListItem
- Skeleton, EmptyState, Modal, BottomSheet, Toast
- AppHeader and BottomNavigation
- Telegram WebApp adapters for initialization, MainButton, BackButton and haptics
- Responsive showcase page

## Use components

Import from `src/components/ui`:

```tsx
import { Button, Card, Input, ToastProvider, useToast } from "./components/ui";

function Example() {
  const { show } = useToast();
  return (
    <Card>
      <Input label="Email" placeholder="you@example.com" />
      <Button onClick={() => show("Saved", "success")}>Save</Button>
    </Card>
  );
}

// Wrap the app once:
<ToastProvider><Example /></ToastProvider>
```

## Theme modes

Set the root attribute before rendering:

```js
document.documentElement.dataset.theme = "dark"; // or "light" / "telegram"
```

Telegram mode reads the standard `--tg-theme-*` CSS variables. If you use Telegram's theme parameters in JS, map them to the matching CSS variables in your app shell.

## Telegram integration

Call `initTelegram()` once on app startup. The adapters safely no-op outside Telegram:

- `haptics.light()`, `haptics.selection()`, `haptics.success()`
- `TelegramMainButton` syncs Telegram's native MainButton
- `AppHeader` can register a Telegram BackButton callback

Load Telegram's Web App script in your HTML before your application bundle:

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

## Project structure

```
src/
  components/ui.tsx
  lib/telegram.ts
  styles/
    tokens.css
    global.css
  App.tsx
  main.tsx
```

## Notes

This repository is a starter UI kit, not a complete production framework. Review focus management, form validation, localization, and app-specific Telegram behavior before shipping a production Mini App.