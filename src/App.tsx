import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Home,
  Moon,
  Send,
  Settings,
  ShieldCheck,
  Sun,
  Wallet,
  Zap
} from "lucide-react";
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
  Input,
  ListItem,
  Modal,
  RadioGroup,
  Skeleton,
  Switch,
  Tabs,
  TelegramMainButton,
  ToastProvider,
  useToast
} from "./components/ui";
import { Form, PageLayout, Section } from "./components/patterns";
import { haptics, initTelegram } from "./lib/telegram";

type ThemeMode = "light" | "dark" | "telegram";

const tokenColors = [
  { name: "Primary", value: "#2AABEE", css: "var(--ui-primary)" },
  { name: "Background", value: "#FFFFFF", css: "var(--ui-bg)" },
  { name: "Surface 2", value: "#F5F7FA", css: "var(--ui-surface-2)" },
  { name: "Text", value: "#17191C", css: "var(--ui-text)" },
  { name: "Border", value: "#E9EDF1", css: "var(--ui-border)" },
  { name: "Success", value: "#31B66A", css: "var(--ui-success)" }
];

function Showcase() {
  const toast = useToast();
  const [theme, setTheme] = useState<ThemeMode>(() =>
    typeof window !== "undefined" && window.Telegram?.WebApp ? "telegram" : "light"
  );
  const [tab, setTab] = useState("overview");
  const [enabled, setEnabled] = useState(true);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("instant");
  const [amount, setAmount] = useState("125.00");
  const [name, setName] = useState("Alex Morgan");
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nativeMainButton, setNativeMainButton] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const handleBack = useCallback(() => {
    toast.show("Back action received", "info");
  }, [toast]);

  const handleNativeAction = useCallback(() => {
    haptics.success();
    toast.show("Telegram MainButton pressed", "success");
  }, [toast]);

  const navItems = useMemo(() => [
    { id: "home", label: "Home", icon: <Home size={19} /> },
    { id: "activity", label: "Activity", icon: <Activity size={19} /> },
    { id: "wallet", label: "Wallet", icon: <Wallet size={19} /> },
    { id: "settings", label: "Settings", icon: <Settings size={19} /> }
  ], []);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.show("Form submitted", "success");
  };

  const showLoading = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast.show("Action completed", "success");
    }, 900);
  };

  return (
    <>
      <PageLayout
        header={
          <AppHeader
            title="Mini App UI Kit"
            subtitle="Component catalogue"
            onBack={handleBack}
            right={
              <div className="demo-header-actions">
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Показать уведомление"
                  onClick={() => toast.show("No new notifications", "info")}
                >
                  <Bell size={18} />
                </button>
              </div>
            }
          />
        }
        footer={
          <BottomNavigation
            items={navItems}
            active={activeNav}
            onChange={setActiveNav}
          />
        }
      >
        <div className="demo-intro">
          <div className="demo-meta">
            <Badge tone="blue">React + TypeScript</Badge>
            <Badge tone="green">320 px+</Badge>
            <Badge>Telegram WebApp</Badge>
          </div>
          <h1>Telegram UI, without visual noise.</h1>
          <p>
            Компактная библиотека интерфейсов для Mini Apps: Telegram blue,
            системная типографика, предсказуемые состояния и адаптация к теме клиента.
          </p>
          <div className="demo-row">
            <Button onClick={() => toast.show("The UI Kit is ready to use", "success")}>
              Show toast
            </Button>
            <Button variant="outline" onClick={() => setSheetOpen(true)}>
              Open sheet
            </Button>
          </div>
        </div>

        <Section
          eyebrow="01 / foundations"
          title="Theme & design tokens"
          description="Переключай темы и проверяй базовые переменные."
          action={<Badge tone="blue">CSS variables</Badge>}
        >
          <Card>
            <div className="demo-stack">
              <Tabs<ThemeMode>
                label="Theme preview"
                value={theme}
                onChange={setTheme}
                items={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                  { value: "telegram", label: "Telegram" }
                ]}
              />
              <div className="demo-token-list">
                {tokenColors.map((token) => (
                  <div className="demo-token" key={token.name}>
                    <span className="demo-token__swatch" style={{ background: token.css }} />
                    <span>{token.name}</span>
                    <code>{token.value}</code>
                  </div>
                ))}
              </div>
              <Divider />
              <div className="demo-grid">
                <div>
                  <strong>4 px</strong>
                  <div className="demo-muted">Spacing base</div>
                </div>
                <div>
                  <strong>15 px</strong>
                  <div className="demo-muted">Body text</div>
                </div>
                <div>
                  <strong>16 px</strong>
                  <div className="demo-muted">Card radius</div>
                </div>
                <div>
                  <strong>44 px</strong>
                  <div className="demo-muted">Touch target</div>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <Section
          eyebrow="02 / actions"
          title="Buttons & badges"
          description="Варианты, размеры, loading и disabled-состояния."
        >
          <Card>
            <div className="demo-stack">
              <div className="demo-row">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
              </div>
              <div className="demo-row">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="demo-row">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="demo-row">
                <Button loading={loading} onClick={showLoading}>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
              <Divider />
              <div className="demo-row">
                <Badge>Default</Badge>
                <Badge tone="blue">Processing</Badge>
                <Badge tone="green" dot>Completed</Badge>
                <Badge tone="orange">Pending</Badge>
                <Badge tone="red">Failed</Badge>
              </div>
            </div>
          </Card>
        </Section>

        <Section
          eyebrow="03 / input"
          title="Form controls"
          description="Controlled values, hints, validation and native form submission."
        >
          <Card>
            <Form onSubmit={submitForm}>
              <Input
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
              />
              <Input
                label="Amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                hint="Available balance: 1,240.00 USDT"
                inputMode="decimal"
              />
              <Input
                label="Invalid field"
                defaultValue="Not a valid value"
                error="Please check this value"
              />
              <Input label="Disabled field" defaultValue="Read only" disabled />
              <Button type="submit">Submit form</Button>
            </Form>
            <Divider />
            <div className="demo-stack">
              <Switch
                checked={enabled}
                onChange={setEnabled}
                label="Enable notifications"
                description="Receive transaction updates"
              />
              <Switch
                checked={false}
                onChange={() => undefined}
                label="Unavailable option"
                disabled
              />
              <Checkbox
                checked={checked}
                onChange={setChecked}
                label="I agree to the terms and conditions"
              />
              <RadioGroup
                name="delivery"
                value={radio}
                onChange={setRadio}
                options={[
                  { value: "instant", label: "Instant", description: "Usually within a few seconds" },
                  { value: "standard", label: "Standard", description: "May take up to 10 minutes" },
                  { value: "disabled", label: "Unavailable", disabled: true }
                ]}
              />
            </div>
          </Card>
        </Section>

        <Section
          eyebrow="04 / content"
          title="Cards, avatars & list items"
          description="Базовые поверхности и строки данных для экранов Mini App."
        >
          <Card>
            <div className="demo-stack">
              <div>
                <div className="demo-muted">Total balance</div>
                <div className="demo-balance">$12,840.50</div>
                <Badge tone="green" dot>+8.2% this month</Badge>
              </div>
              <Divider />
              <div className="demo-row">
                <Avatar name="Alex Morgan" size="sm" />
                <Avatar name="Crypto Bot" />
                <Avatar name="Jane Cooper" size="lg" />
                <span className="demo-muted">Avatar sizes</span>
              </div>
            </div>
          </Card>
          <Card padding="none" className="demo-list-card">
            <ListItem
              title="Received USDT"
              description="Today, 14:32 · TRC20"
              leading={<span className="demo-list-icon demo-list-icon--green"><ArrowUpRightIcon /></span>}
              trailing={<strong className="demo-positive">+$240.00</strong>}
            />
            <ListItem
              title="Sent TON"
              description="Today, 11:08 · TON"
              leading={<span className="demo-list-icon demo-list-icon--blue"><Send size={17} /></span>}
              trailing={<strong>−12.50 TON</strong>}
              onClick={() => toast.show("List item selected", "info")}
            />
            <ListItem
              title="Payment completed"
              description="Yesterday, 19:45"
              leading={<span className="demo-list-icon demo-list-icon--green"><CheckCircle2 size={17} /></span>}
              trailing={<ChevronRight size={18} />}
            />
          </Card>
        </Section>

        <Section
          eyebrow="05 / navigation"
          title="Tabs & app navigation"
          description="Tabs управляют локальным содержимым, нижняя панель закреплена в PageLayout."
        >
          <Card>
            <div className="demo-stack">
              <Tabs
                value={tab}
                onChange={setTab}
                items={[
                  { value: "overview", label: "Overview" },
                  { value: "activity", label: "Activity" },
                  { value: "settings", label: "Settings" }
                ]}
              />
              <div className="demo-tab-preview">
                <strong>{tab[0].toUpperCase() + tab.slice(1)}</strong>
                <span className="demo-muted">Selected tab content goes here.</span>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="demo-muted">BottomNavigation — внизу экрана</div>
            <div className="demo-muted">Active item: {activeNav}</div>
          </Card>
        </Section>

        <Section
          eyebrow="06 / states"
          title="Skeleton & empty state"
          description="Состояния загрузки и отсутствия данных."
        >
          <Card>
            <div className="demo-stack">
              <Skeleton width="38%" height={12} />
              <Skeleton width="72%" height={20} />
              <Skeleton width="100%" height={12} />
              <Skeleton width="86%" height={12} />
            </div>
          </Card>
          <Card>
            <EmptyState
              title="Nothing here yet"
              description="Your transactions will appear here once you make your first transfer."
              action={<Button size="sm" onClick={() => toast.show("Opening wallet", "info")}>Make a transfer</Button>}
            />
          </Card>
        </Section>

        <Section
          eyebrow="07 / overlays"
          title="Modal, BottomSheet & Toast"
          description="Проверяй закрытие по Escape, backdrop и кнопкам."
        >
          <Card>
            <div className="demo-stack">
              <div className="demo-row">
                <Button variant="outline" onClick={() => setModalOpen(true)}>Open modal</Button>
                <Button variant="outline" onClick={() => setSheetOpen(true)}>Open sheet</Button>
              </div>
              <div className="demo-row">
                <Button variant="secondary" onClick={() => toast.show("Saved successfully", "success")}>Success toast</Button>
                <Button variant="secondary" onClick={() => toast.show("Something went wrong", "error")}>Error toast</Button>
              </div>
            </div>
          </Card>
        </Section>

        <Section
          eyebrow="08 / telegram"
          title="Telegram WebApp adapters"
          description="Native MainButton, BackButton, themeParams, viewport и haptic feedback."
          action={<Badge tone="green">No-op outside Telegram</Badge>}
        >
          <Card>
            <div className="demo-stack">
              <ListItem
                title="MainButton"
                description="Показывает системную кнопку Telegram внизу Mini App"
                leading={<CreditCard size={19} />}
                trailing={<Switch
                  checked={nativeMainButton}
                  onChange={setNativeMainButton}
                  label="Enable native MainButton"
                />}
              />
              <Divider />
              <ListItem
                title="BackButton"
                description="Нажми системную или локальную кнопку «Назад» в шапке"
                leading={<ChevronRight size={19} />}
                trailing={<Badge tone="blue">Connected</Badge>}
              />
              <Divider />
              <ListItem
                title="Haptic feedback"
                description="Проверка тактильной отдачи на поддерживаемых устройствах"
                leading={<Zap size={19} />}
                trailing={<Button size="sm" variant="outline" onClick={() => {
                  haptics.medium();
                  toast.show("Haptic feedback requested", "info");
                }}>Test</Button>}
              />
              <p className="demo-muted demo-telegram-note">
                <ShieldCheck size={15} /> В обычном браузере Telegram-адаптеры безопасно ничего не делают.
              </p>
            </div>
          </Card>
        </Section>

        <footer className="demo-footer">
          <span>Mini App UI Kit · v0.2.0</span>
          <span>React · TypeScript · CSS variables</span>
        </footer>
      </PageLayout>

      <TelegramMainButton
        text="Confirm action"
        onClick={handleNativeAction}
        visible={nativeMainButton}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm transfer"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setModalOpen(false);
              toast.show("Transfer confirmed", "success");
            }}>Confirm</Button>
          </>
        }
      >
        <div className="demo-modal-amount">$125.00 <small>USDT</small></div>
        <p className="demo-modal-copy">
          You are about to send funds. Please make sure the recipient address is correct.
        </p>
        <ListItem title="Network fee" description="TRON network" trailing={<strong>1.00 USDT</strong>} />
      </Modal>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Quick actions">
        <div className="demo-bottom-sheet-actions">
          <button type="button" onClick={() => {
            setSheetOpen(false);
            toast.show("Send selected", "info");
          }}>
            <span><Send size={20} /></span>
            <strong>Send</strong>
          </button>
          <button type="button" onClick={() => {
            setSheetOpen(false);
            toast.show("Receive selected", "info");
          }}>
            <span><Wallet size={20} /></span>
            <strong>Receive</strong>
          </button>
          <button type="button" onClick={() => {
            setSheetOpen(false);
            toast.show("Buy selected", "info");
          }}>
            <span><CreditCard size={20} /></span>
            <strong>Buy</strong>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

function ArrowUpRightIcon() {
  return <Activity size={17} />;
}

export default function App() {
  useEffect(() => initTelegram(), []);
  return (
    <ToastProvider>
      <Showcase />
    </ToastProvider>
  );
}
