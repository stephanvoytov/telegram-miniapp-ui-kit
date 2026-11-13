import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowUpRight, Bell, CheckCircle2, ChevronRight, CreditCard,
  Home, LayoutGrid, Moon, Plus, Send, Settings, ShieldCheck, Sun, Wallet, Zap
} from "lucide-react";
import {
  AppHeader, Avatar, Badge, BottomNavigation, BottomSheet, Button, Card,
  Checkbox, Divider, EmptyState, Input, ListItem, Modal, RadioGroup,
  Skeleton, Switch, Tabs, ToastProvider, useToast
} from "./components/ui";
import { initTelegram } from "./lib/telegram";

function Showcase() {
  const toast = useToast();
  const [tab, setTab] = useState("overview");
  const [enabled, setEnabled] = useState(true);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("instant");
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [nav, setNav] = useState("home");
  const [amount, setAmount] = useState("125.00");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const handleLoading = () => {
    setLoading(true);
    window.setTimeout(() => { setLoading(false); toast.show("Action completed", "success"); }, 1000);
  };

  const navItems = useMemo(() => [
    { id: "home", label: "Home", icon: <Home size={19} /> },
    { id: "activity", label: "Activity", icon: <Activity size={19} /> },
    { id: "wallet", label: "Wallet", icon: <Wallet size={19} /> },
    { id: "settings", label: "Settings", icon: <Settings size={19} /> }
  ], []);

  return <div className="demo-shell">
    <AppHeader title="Mini App UI Kit" subtitle="Component playground"
      right={<div className="header-actions"><button className="icon-button" aria-label="Toggle theme" onClick={() => setTheme(value => value === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button><button className="icon-button" onClick={() => toast.show("You're all caught up", "info")}><Bell size={19} /></button></div>} />
    <main className="demo-content">
      <section className="hero">
        <div className="hero__eyebrow"><span className="hero__dot" /> TELEGRAM MINI APP DESIGN SYSTEM</div>
        <h1>Build a better<br /><em>Mini App.</em></h1>
        <p>A practical React component library for fast, familiar and native-feeling Telegram experiences.</p>
        <div className="hero__actions">
          <Button onClick={() => toast.show("Let's build something", "success")}>Get started <ArrowUpRight size={16} /></Button>
          <Button variant="outline" onClick={() => setSheet(true)}>View details</Button>
        </div>
        <div className="hero__meta"><span><i /> React + TypeScript</span><span>Light & dark ready</span><span>320px responsive</span></div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">01 / FOUNDATIONS</span><h2>Design tokens</h2></div><Badge tone="blue">Core</Badge></div>
        <Card>
          <div className="token-colors">
            {["#2AABEE", "#17191C", "#F5F6F8", "#E7E9ED", "#16A36A", "#E59B36"].map((color, i) =>
              <div key={color}><span style={{ background: color }} /><small>{["Primary", "Ink", "Canvas", "Border", "Success", "Warning"][i]}</small><code>{color}</code></div>)}
          </div>
          <Divider />
          <div className="token-stats"><div><strong>4px</strong><small>Spacing base</small></div><div><strong>16px</strong><small>Card radius</small></div><div><strong>14px</strong><small>Body text</small></div><div><strong>44px</strong><small>Touch target</small></div></div>
        </Card>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">02 / COMPONENTS</span><h2>Buttons & feedback</h2></div></div>
        <Card>
          <div className="component-stack">
            <div className="component-line"><Button>Continue <ChevronRight size={16} /></Button><Button variant="secondary">Secondary</Button></div>
            <div className="component-line"><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Delete</Button></div>
            <div className="component-line"><Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button></div>
            <div className="component-line"><Button loading={loading} onClick={handleLoading}>Loading state</Button><Button disabled>Disabled</Button></div>
          </div>
        </Card>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">03 / COMPONENTS</span><h2>Form elements</h2></div></div>
        <Card>
          <div className="component-stack">
            <Input label="Amount" value={amount} onChange={e => setAmount(e.target.value)} hint="Available balance: 1,240.00 USDT" />
            <Input label="Wallet address" placeholder="Enter wallet address" />
            <Input label="Invalid field" defaultValue="Not a valid value" error="Please check this value" />
            <Divider />
            <Switch checked={enabled} onChange={setEnabled} label="Enable notifications" description="Receive transaction updates" />
            <Checkbox checked={checked} onChange={setChecked} label="I agree to the terms and conditions" />
            <RadioGroup name="delivery" value={radio} onChange={setRadio} options={[
              { value: "instant", label: "Instant", description: "Usually within a few seconds" },
              { value: "standard", label: "Standard", description: "May take up to 10 minutes" }
            ]} />
          </div>
        </Card>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">04 / COMPONENTS</span><h2>Cards & data</h2></div></div>
        <Card className="balance-card">
          <div className="balance-card__top"><span>Total balance</span><Badge tone="green" dot>+8.2%</Badge></div>
          <div className="balance-card__amount">$12,840<span>.50</span></div>
          <div className="balance-card__bottom"><span>≈ 12,840.50 USDT</span><span>Updated just now</span></div>
        </Card>
        <Card padding="none">
          <div className="list-heading">Recent activity <button onClick={() => setTab("activity")}>See all</button></div>
          <ListItem title="Received USDT" description="Today, 14:32 · TRC20" leading={<span className="activity-icon activity-icon--green"><ArrowUpRight size={17} /></span>} trailing={<strong className="amount-positive">+$240.00</strong>} />
          <Divider />
          <ListItem title="Sent TON" description="Today, 11:08 · TON" leading={<span className="activity-icon activity-icon--blue"><Send size={16} /></span>} trailing={<strong>−12.50 TON</strong>} />
          <Divider />
          <ListItem title="Payment completed" description="Yesterday, 19:45" leading={<span className="activity-icon activity-icon--violet"><CheckCircle2 size={16} /></span>} trailing={<strong>−$18.00</strong>} />
        </Card>
        <div className="component-line component-line--badges"><Badge>Default</Badge><Badge tone="blue">Processing</Badge><Badge tone="green" dot>Completed</Badge><Badge tone="orange">Pending</Badge><Badge tone="red">Failed</Badge></div>
        <div className="component-line"><Avatar name="Alex Morgan" /><Avatar name="Crypto Bot" size="lg" /><Avatar name="Jane Cooper" size="sm" /></div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">05 / PATTERNS</span><h2>Navigation</h2></div></div>
        <Card>
          <Tabs value={tab} onChange={setTab} items={[{ value: "overview", label: "Overview" }, { value: "activity", label: "Activity" }, { value: "settings", label: "Settings" }]} />
          <div className="tab-preview"><span className="tab-preview__icon"><LayoutGrid size={19} /></span><strong>{tab[0].toUpperCase() + tab.slice(1)} tab</strong><small>Selected tab content goes here.</small></div>
        </Card>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">06 / STATES</span><h2>Loading & empty</h2></div></div>
        <Card><div className="skeleton-demo"><Skeleton width="42%" height={12} /><Skeleton width="72%" height={22} /><Skeleton width="100%" height={10} /><Skeleton width="86%" height={10} /></div></Card>
        <Card><EmptyState title="Nothing here yet" description="Your transactions will appear here once you make your first transfer." action={<Button size="sm" onClick={() => toast.show("Opening wallet", "info")}>Make a transfer <Plus size={14} /></Button>} /></Card>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">07 / OVERLAYS</span><h2>Dialogs & sheets</h2></div></div>
        <Card><div className="component-line"><Button variant="outline" onClick={() => setModal(true)}>Open modal</Button><Button variant="outline" onClick={() => setSheet(true)}>Open bottom sheet</Button></div></Card>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">08 / TELEGRAM</span><h2>Native integration</h2></div><Badge tone="green">Ready</Badge></div>
        <Card>
          <ListItem title="Main Button" description="Telegram's native bottom action" leading={<span className="activity-icon activity-icon--blue"><CreditCard size={17} /></span>} trailing={<Badge tone="green">Adapter</Badge>} />
          <Divider />
          <ListItem title="Back Button" description="Synced with AppHeader back action" leading={<span className="activity-icon activity-icon--blue">‹</span>} trailing={<Badge tone="green">Adapter</Badge>} />
          <Divider />
          <ListItem title="Haptic feedback" description="Light impact and selection feedback" leading={<span className="activity-icon activity-icon--blue"><Zap size={16} /></span>} trailing={<Badge tone="green">Adapter</Badge>} />
          <p className="telegram-note"><ShieldCheck size={15} /> Components gracefully fall back when opened in a regular browser.</p>
        </Card>
      </section>

      <footer className="demo-footer"><span className="footer-mark">M</span><div><strong>Mini App UI Kit</strong><small>Designed for clarity. Built for Telegram.</small></div><span className="footer-version">v0.1.0</span></footer>
    </main>
    <BottomNavigation items={navItems} active={nav} onChange={setNav} />
    <Modal open={modal} onClose={() => setModal(false)} title="Confirm transfer"
      footer={<><Button variant="outline" onClick={() => setModal(false)}>Cancel</Button><Button onClick={() => { setModal(false); toast.show("Transfer confirmed", "success"); }}>Confirm</Button></>}>
      <div className="confirm-amount">$125.00 <small>USDT</small></div>
      <p className="modal-copy">You're about to send funds. Please make sure the recipient address is correct.</p>
      <ListItem title="Network fee" description="TRON network" trailing={<strong>1.00 USDT</strong>} />
    </Modal>
    <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Quick actions">
      <div className="sheet-actions"><button onClick={() => { setSheet(false); toast.show("Send selected", "info"); }}><span><Send /></span><strong>Send</strong><small>Transfer crypto</small></button>
        <button onClick={() => { setSheet(false); toast.show("Receive selected", "info"); }}><span><Wallet /></span><strong>Receive</strong><small>Get a payment</small></button>
        <button onClick={() => { setSheet(false); toast.show("Buy selected", "info"); }}><span><CreditCard /></span><strong>Buy</strong><small>Add funds</small></button></div>
    </BottomSheet>
  </div>;
}

export default function App() {
  useEffect(() => { initTelegram(); }, []);
  return <ToastProvider><Showcase /></ToastProvider>;
}