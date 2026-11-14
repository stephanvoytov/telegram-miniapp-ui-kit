# Telegram Mini App UI Kit

Reusable React + TypeScript components and layout patterns for Telegram Mini Apps. The visual direction follows a compact Telegram-native fintech interface inspired by CryptoBot: Telegram blue, restrained surfaces, system typography and clear interaction states.

## Requirements

- Node.js 20+
- npm
- React 18

## Run the catalogue

\`\`\`bash
npm install
npm run dev
\`\`\`

Vite prints the local URL after startup.

## Verify

\`\`\`bash
npm run typecheck
npm run build
\`\`\`

There is no dedicated unit-test runner in this starter yet. The repository CI workflow runs the TypeScript check and production build on pushes and pull requests.

## Components

Import from the public barrel:

\`\`\`tsx
import {
  AppHeader,
  Avatar,
  Badge,
  BottomNavigation,
  BottomSheet,
  Button,
  Card,
  Checkbox,
  Divider,
  EmptyState,
  Form,
  Input,
  ListItem,
  Modal,
  PageLayout,
  Radio,
  RadioGroup,
  Section,
  Skeleton,
  Switch,
  Tabs,
  TelegramBackButton,
  TelegramMainButton,
  ToastProvider,
  useToast
} from "./components";
\`\`\`

Available primitives:

- Actions and inputs: \`Button\`, \`Input\`
- Surfaces and content: \`Card\`, \`Badge\`, \`Avatar\`, \`Divider\`, \`ListItem\`
- Selection: \`Tabs\`, \`Switch\`, \`Checkbox\`, \`Radio\`, \`RadioGroup\`
- States: \`Skeleton\`, \`EmptyState\`
- Overlays: \`Modal\`, \`BottomSheet\`, \`ToastProvider\`, \`useToast\`
- Navigation: \`AppHeader\`, \`BottomNavigation\`
- Layout patterns: \`PageLayout\`, \`Section\`, \`Form\`
- Telegram adapters: \`TelegramMainButton\`, \`TelegramBackButton\`, \`haptics\`

## Example

\`\`\`tsx
import { Button, Card, Input, ToastProvider, useToast } from "./components";

function ProfileForm() {
  const toast = useToast();

  return (
    <Card>
      <Input label="Name" placeholder="Your name" />
      <Button onClick={() => toast.show("Saved", "success")}>Save</Button>
    </Card>
  );
}

export function App() {
  return (
    <ToastProvider>
      <ProfileForm />
    </ToastProvider>
  );
}
\`\`\`

## Themes and design tokens

All design values are CSS custom properties in \`src/styles/tokens.css\`:

- Light and dark palettes
- Telegram theme parameter mapping
- Typography scale and system font stack
- 4px spacing scale
- Radius, shadow and semantic status tokens
- Viewport and safe-area variables

Set the root theme attribute to \`light\`, \`dark\` or \`telegram\`:

\`\`\`ts
document.documentElement.dataset.theme = "dark";
\`\`\`

The Telegram mode reads \`--tg-theme-*\` variables. \`initTelegram()\` also maps \`WebApp.themeParams\`, listens for theme and viewport changes, and synchronizes safe-area insets.

## Telegram integration

The Telegram bridge script is included in \`index.html\` before the app bundle. Call \`initTelegram()\` once from the app shell; it returns a cleanup function.

\`\`\`tsx
import { useEffect } from "react";
import { initTelegram } from "./lib/telegram";

useEffect(() => initTelegram(), []);
\`\`\`

Adapters safely no-op when the app is opened outside Telegram:

\`\`\`tsx
<TelegramMainButton text="Continue" onClick={submit} />
<TelegramBackButton onClick={goBack} />
\`\`\`

Haptic methods: \`haptics.light()\`, \`haptics.medium()\`, \`haptics.success()\`, \`haptics.error()\`, \`haptics.warning()\`, \`haptics.selection()\`.

## Project structure

\`\`\`text
src/
  components/
    index.ts
    patterns.tsx
    ui.tsx
  lib/
    telegram.ts
  styles/
    global.css
    tokens.css
  App.tsx
  main.tsx
\`\`\`

## Production notes

The catalogue is a visual and interaction playground, not a complete application framework. Add product-specific validation, localization, analytics and routing as needed. For production dialogs, review focus management and add a focus trap if the surrounding application requires strict modal accessibility.
