"use client";

import { BuildingAnimation, CONNECTORS, DemoSite, SUMMARY, ThinkingBlock } from "@/components/demo-sites";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CreditPill, ProjectHub, SuggestPageMenu, WorkspaceMenu } from "@/components/app-extras";
import {
  ArrowUp, Check, FolderOpen, LayoutTemplate, ChevronDown, ChevronLeft, ChevronRight, Copy, Edit3, FileText, Gauge, Image, Menu, MessageSquare, Mic, Monitor,
  Moon, MousePointer2, Paperclip, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Pencil,
  Plus, RotateCw, Rocket, Search, Settings, Smartphone, Sun, Tablet, Trash2, UserRound, Wrench, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Eye, LogOut, ScanSearch } from "lucide-react";
import { toast } from "sonner";

type Mode = "plan" | "build";
type Status = "planning" | "building" | "built";
type Category = "tour" | "portfolio" | "corporate" | "clinic" | "store" | "custom";
type Msg = { id: number; role: "user" | "assistant"; text: string; offer?: boolean; questions?: Category | undefined; done?: boolean; thinking?: Category };

const detect = (t: string): Category => {
  const s = t.toLowerCase();
  if (/safari|tour|travel|hotel|lodge|itinerar/.test(s)) return "tour";
  if (/portfolio|student|cv|resume|freelanc/.test(s)) return "portfolio";
  if (/logistic|freight|company|corporate|consult|firm/.test(s)) return "corporate";
  if (/clinic|dental|wellness|doctor|salon|spa|appointment|booking/.test(s)) return "clinic";
  if (/shop|store|boutique|fashion|catalog|e-?commerce|sell/.test(s)) return "store";
  return "custom";
};
const LABEL: Record<Category, string> = { tour: "Tour & Safari agency", portfolio: "Personal portfolio", corporate: "Company website", clinic: "Clinic & bookings", store: "Online store", custom: "Business website" };
const QUESTIONS: Record<Category, { q: string; options: string[] }[]> = {
  tour: [{ q: "Which trips do your guests love most? I'll feature them first.", options: ["Maasai Mara", "Diani beach", "Amboseli"] }, { q: "To get your safaris booked fast, where are your main pickup hubs?", options: ["Nairobi CBD", "JKIA airport", "Mombasa"] }, { q: "How would you like guests to pay you?", options: ["20% M-Pesa deposit", "Card in USD", "Pay on arrival"] }, { q: "Who are you mostly selling to?", options: ["Local travellers", "International tourists", "Both"] }],
  portfolio: [{ q: "What work are you proudest of? I'll put it up top.", options: ["Coding projects", "Design work", "Writing"] }, { q: "What's the big goal for this site?", options: ["Land a job", "Win clients", "Get an internship"] }, { q: "How should people reach you?", options: ["Email form", "WhatsApp", "LinkedIn"] }],
  corporate: [{ q: "When a visitor lands, what should they do first?", options: ["Request a quote", "Call us", "Book a meeting"] }, { q: "Which towns do you serve most?", options: ["Mombasa", "Kisumu", "All of Kenya"] }, { q: "What builds trust with your clients?", options: ["Client logos", "Fleet photos", "Certifications"] }],
  clinic: [{ q: "How do patients prefer to book with you today?", options: ["Online calendar", "WhatsApp", "Phone call"] }, { q: "Which services should I list first?", options: ["Dental", "Physio", "General checkups"] }, { q: "Do you accept insurance?", options: ["NHIF / SHA", "Private insurance", "Cash & M-Pesa only"] }],
  store: [{ q: "What do you sell? I'll set up the right catalog.", options: ["Clothes", "Electronics", "Beauty"] }, { q: "How would you like customers to pay you?", options: ["M-Pesa Till", "Paybill", "Card"] }, { q: "How do orders reach customers?", options: ["Same-day Nairobi", "Countrywide courier", "Pickup"] }],
  custom: [{ q: "What's the main goal for your website?", options: ["Get customers", "Take bookings", "Sell online"] }, { q: "Who are your customers?", options: ["Locals", "Global", "Both"] }, { q: "How should people pay or contact you?", options: ["M-Pesa", "WhatsApp", "Email"] }],
};
const PLAN: Record<Category, string[]> = {
  tour: ["Home with hero photo and top packages", "Package pages with itinerary and price", "Booking form with deposit"],
  portfolio: ["About me hero", "Project case studies", "Contact & CV download"],
  corporate: ["Services overview", "Quote request form", "About & contact"],
  clinic: ["Services & prices", "Appointment booking", "WhatsApp desk & location"],
  store: ["Product catalog", "Cart & checkout", "Order confirmation"],
  custom: ["Home page", "Services", "Contact form"],
};
const TWEAKS: Record<Category, string[]> = {
  tour: ["Add TripAdvisor badge", "Add WhatsApp inquiry button", "Add currency switcher KES/USD"],
  portfolio: ["Add GitHub links", "Add CV download button", "Add testimonials"],
  corporate: ["Add quote calculator", "Add client logos", "Add WhatsApp chat"],
  clinic: ["Add opening hours", "Add Google Maps location", "Add patient reviews"],
  store: ["Add size guide", "Add M-Pesa checkout", "Add product reviews"],
  custom: ["Add WhatsApp button", "Add testimonials", "Improve the design"],
};

const history = [
  { id: "design-a-dashboard", title: "Design a clean dashboard" },
  { id: "explain-api", title: "Explain this API response" },
  { id: "launch-checklist", title: "Launch checklist" },
  { id: "portfolio-copy", title: "Rewrite portfolio copy" },
];

const pills = ["Add a landing page", "Create login", "Add dashboard", "Improve the design"];
const isBuildIntent = (t: string) => /\b(build|app|website|site|landing|dashboard|store|create)\b/i.test(t);
let nextId = 1;
const msg = (role: Msg["role"], text: string, offer = false): Msg => ({ id: nextId++, role, text, offer });

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground shadow-sm">F</div>
      <span className="text-base font-semibold">Friendlu AI</span>
    </div>
  );
}

export function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };
  return { dark, toggle };
}

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="flex rounded-md bg-muted p-1" aria-label="Response mode">
      {(["plan", "build"] as const).map((item) => (
        <Button aria-pressed={mode === item} className={cn("h-7 px-3 capitalize", mode === item && "bg-background shadow-sm")} key={item} onClick={() => onChange(item)} size="sm" type="button" variant="ghost">
          {mode === item && <Check className="size-3.5" />}
          {item}
        </Button>
      ))}
    </div>
  );
}

export type Lang = "en" | "sw";
const SW_STARTERS = ["Tovuti ya Safari na Utalii", "Boutique ya Nguo na Malipo ya M-Pesa", "Kliniki ya Madaktari na Miadi ya Wagonjwa"];
export function Composer({ large, onSend, placeholder, locked, onTopUp, chips = [], onLang }: { large?: boolean; onSend: (text: string, mode: Mode) => void; placeholder?: string; locked?: boolean; onTopUp?: () => void; chips?: string[]; onLang?: (l: Lang) => void }) {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<Mode>("plan");
  const [sending, setSending] = useState(false);
  const [lang, setLangRaw] = useState<Lang>("en");
  const setLang = (l: Lang) => { setLangRaw(l); onLang?.(l); try { sessionStorage.setItem("friendlu-lang", l); } catch { /* ignore */ } };
  useEffect(() => { try { if (sessionStorage.getItem("friendlu-lang") === "sw") { setLangRaw("sw"); onLang?.("sw"); } } catch { /* ignore */ } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ref = useRef<HTMLTextAreaElement>(null);
  const ph = lang === "sw" ? "Eleza tovuti au programu ya biashara unayotaka kuunda leo..." : placeholder ?? "Ask anything, or describe what you want to build...";
  return (
    <div>
    <div className={cn("rounded-[26px] p-[2px] transition-all", sending && "animate-rainbow shadow-lg")}>
    <PromptInput
      className="rounded-[24px] border-border bg-card shadow-[0_16px_50px_var(--composer-shadow)] [&_[data-slot=input-group]]:rounded-[24px]"
      onSubmit={({ text }) => {
        const t = text.trim();
        if (!t || locked) return;
        setSending(true);
        setTimeout(() => setSending(false), 1200);
        onSend(t, mode);
        setValue("");
      }}
    >
      {(chips.length > 0 || locked) && (
        <div className="flex w-full flex-wrap gap-1.5 px-4 pt-3">
          {locked && <span className="rounded-full bg-chart-4/20 px-3 py-1 text-xs font-semibold text-foreground">⚠️ Credits depleted · 0 credits left</span>}
          {chips.map((c) => <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium" key={c}>{c}</span>)}
        </div>
      )}
      <PromptInputTextarea aria-label="Message Friendlu AI" className={cn("px-5 text-base", large ? "min-h-28 pt-5" : "min-h-16")} disabled={locked} onChange={(e) => setValue(e.target.value)} placeholder={locked ? "Top up credits to keep building…" : ph} ref={ref} value={value} />
      <PromptInputFooter className="px-3 pb-3">
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger aria-label="Add something" tooltip="Add something"><Plus /></PromptInputActionMenuTrigger>
            <PromptInputActionMenuContent>
              <PromptInputActionMenuItem><Paperclip />Attach file</PromptInputActionMenuItem>
              <PromptInputActionMenuItem><Image />Add image</PromptInputActionMenuItem>
              <PromptInputActionMenuItem><FileText />Add document</PromptInputActionMenuItem>
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <ModeSwitch mode={mode} onChange={setMode} />
          <div className="flex rounded-full bg-muted p-0.5 text-xs font-semibold" aria-label="Language">
            {(["en", "sw"] as const).map((l) => <button aria-pressed={lang === l} className={cn("h-7 rounded-full px-2.5 uppercase", lang === l && "bg-background shadow-sm")} key={l} onClick={() => setLang(l)} type="button">{l}</button>)}
          </div>
        </PromptInputTools>
        {locked ? (
          <Button className="h-10 rounded-full" onClick={onTopUp} type="button">Top up credits to continue</Button>
        ) : value.trim() ? (
          <PromptInputSubmit className="btn-glow rounded-full"><ArrowUp /></PromptInputSubmit>
        ) : (
          <PromptInputButton aria-label="Record voice" className="btn-glow rounded-full"><Mic /></PromptInputButton>
        )}
      </PromptInputFooter>
    </PromptInput>
    </div>
    {lang === "sw" && large && <div className="mt-3 flex flex-wrap justify-center gap-2">{SW_STARTERS.map((t) => <Button className="h-10 rounded-full" key={t} onClick={() => setValue(t)} size="sm" type="button" variant="outline">{t}</Button>)}</div>}
    </div>
  );
}

export function PillStrip({ items, onPick }: { items: string[]; onPick: (p: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const by = (d: number) => ref.current?.scrollBy({ left: d, behavior: "smooth" });
  return (
    <div className="flex items-center gap-1">
      <Button aria-label="Scroll suggestions left" className="shrink-0 rounded-full" onClick={() => by(-180)} size="icon-sm" type="button" variant="ghost"><ChevronLeft /></Button>
      <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto" ref={ref}>
        {items.map((p) => <Button className="h-9 shrink-0 rounded-full transition hover:scale-[1.03] hover:border-primary active:scale-95" key={p} onClick={() => onPick(p)} size="sm" type="button" variant="outline">{p}</Button>)}
      </div>
      <Button aria-label="Scroll suggestions right" className="shrink-0 rounded-full" onClick={() => by(180)} size="icon-sm" type="button" variant="ghost"><ChevronRight /></Button>
    </div>
  );
}


function Sidebar({ collapsed, onClose, onToggle, open }: { collapsed: boolean; onClose: () => void; onToggle: () => void; open: boolean }) {
  const { dark, toggle } = useTheme();
  return (
    <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[transform,width] duration-200 lg:static lg:translate-x-0", collapsed ? "lg:w-[72px]" : "lg:w-[280px]", open ? "translate-x-0" : "-translate-x-full")}>
      <div className={cn("flex h-16 items-center justify-between px-4", collapsed && "lg:justify-center lg:px-2")}>
        <div className={cn(collapsed && "lg:[&_span]:hidden")}><BrandMark /></div>
        <Button aria-label="Close menu" className="lg:hidden" onClick={onClose} size="icon" variant="ghost"><PanelLeftClose /></Button>
        <Button aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden lg:inline-flex" onClick={onToggle} size="icon" variant="ghost">{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button>
      </div>
      <div className="px-3"><WorkspaceMenu collapsed={collapsed} /></div>
      <div className="space-y-1 px-3 pt-2">
        <Button aria-label="New chat" className={cn("h-11 w-full justify-start", collapsed && "lg:justify-center lg:px-0")} onClick={() => { window.location.href = "/dashboard"; }} variant="outline"><Plus /> <span className={cn(collapsed && "lg:hidden")}>New chat</span></Button>
        {([["/projects", "Projects", FolderOpen]] as const).map(([href, label, Icon]) => (
          <Button aria-label={label} className={cn("h-11 w-full justify-start font-normal", collapsed && "lg:justify-center lg:px-0")} key={href} onClick={() => { window.location.href = href; }} variant="ghost"><Icon /> <span className={cn(collapsed && "lg:hidden")}>{label}</span></Button>
        ))}
      </div>
      <nav className={cn("mt-5 min-h-0 flex-1 overflow-y-auto px-3", collapsed && "lg:hidden")} aria-label="Chat history">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Recent</p>
        <div className="space-y-1">
          {history.slice(0, 3).map((item) => (
            <Button className="h-10 w-full justify-start overflow-hidden px-2 font-normal" key={item.id} onClick={() => { window.location.href = `/chat/${item.id}`; }} variant="ghost">
              <MessageSquare className="shrink-0" /><span className="truncate">{item.title}</span>
            </Button>
          ))}
        </div>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2"><CreditPill collapsed={collapsed} /></div>
        <Button aria-label={dark ? "Light mode" : "Dark mode"} className={cn("h-11 w-full justify-start", collapsed && "lg:justify-center lg:px-0")} onClick={toggle} variant="ghost">{dark ? <Sun /> : <Moon />} <span className={cn(collapsed && "lg:hidden")}>{dark ? "Light mode" : "Dark mode"}</span></Button>
        <Button aria-label="Sign out" className={cn("h-11 w-full justify-start", collapsed && "lg:justify-center lg:px-0")} onClick={() => { window.location.href = "/?signin=1"; }} variant="ghost"><LogOut /> <span className={cn(collapsed && "lg:hidden")}>Sign out</span></Button>
        <Button aria-label="Account" className={cn("h-12 w-full justify-start", collapsed && "lg:justify-center lg:px-0")} onClick={() => { window.location.href = "/account"; }} variant="ghost">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">AK</span>
          <span className={cn("min-w-0 text-left", collapsed && "lg:hidden")}><span className="block truncate text-sm">Alex Kimani</span><span className="block text-xs font-normal text-muted-foreground">Free plan</span></span>
        </Button>
      </div>
    </aside>
  );
}

const templates = ["Landing", "Store", "Dashboard"] as const;
type Template = (typeof templates)[number];
type PreviewDevice = "desktop" | "tablet" | "mobile";

function MockSite({ template, reloadKey }: { template: Template; reloadKey: number }) {
  return (
    <div className="h-full overflow-y-auto bg-background animate-in fade-in" key={reloadKey}>
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="font-bold">Bloom<span className="text-primary">.</span></span>
        <div className="hidden gap-5 text-sm text-muted-foreground sm:flex"><span>Features</span><span>Pricing</span><span>About</span></div>
        <span className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground">Get started</span>
      </div>
      {template === "Dashboard" ? (
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {["Revenue $24.8k", "Users 1,284", "Orders 342"].map((s) => (
            <div className="rounded-xl border border-border bg-card p-5" key={s}><p className="text-sm text-muted-foreground">{s.split(" ")[0]}</p><p className="mt-1 text-2xl font-semibold">{s.split(" ")[1]}</p></div>
          ))}
          <div className="flex h-48 items-end gap-2 rounded-xl border border-border bg-card p-5 sm:col-span-3">
            {[40, 65, 45, 80, 60, 90, 75, 95].map((h, i) => <div className="flex-1 rounded-t bg-primary/80" key={i} style={{ height: `${h}%` }} />)}
          </div>
        </div>
      ) : template === "Store" ? (
        <div className="p-6">
          <h2 className="text-2xl font-semibold">New arrivals</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {["Ceramic mug", "Linen tote", "Candle set", "Plant pot", "Notebook", "Throw blanket"].map((p) => (
              <div className="rounded-xl border border-border bg-card p-3" key={p}><div className="aspect-square rounded-lg bg-accent" /><p className="mt-2 text-sm font-medium">{p}</p><p className="text-sm text-muted-foreground">$28</p></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-6 py-14 text-center">
          <span className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">Now in beta</span>
          <h2 className="mx-auto mt-5 max-w-lg text-4xl font-bold">Grow your ideas into products</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">Bloom helps small teams plan, launch, and scale without the chaos.</p>
          <div className="mt-7 flex justify-center gap-3"><span className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground">Start free</span><span className="rounded-lg border border-border px-5 py-2.5">See demo</span></div>
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {["Fast setup", "Team spaces", "Smart insights"].map((f) => <div className="rounded-xl border border-border bg-card p-4 text-left" key={f}><p className="font-medium">{f}</p><p className="mt-1 text-sm text-muted-foreground">Everything you need, nothing you don’t.</p></div>)}
          </div>
        </div>
      )}
    </div>
  );
}

function PublishSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-2xl border border-border bg-card p-6 shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Publish">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Publish your app</h2><Button aria-label="Close" onClick={onClose} size="icon" variant="ghost"><X /></Button></div>
        <p className="mt-1 text-sm text-muted-foreground">Preview only — publishing isn’t connected yet.</p>
        <div className="mt-4 rounded-lg border border-border bg-muted px-4 py-3 text-sm">bloom.friendlu.app</div>
        <Button className="mt-4 h-12 w-full bg-blue-600 text-white hover:bg-blue-700" onClick={onClose}><Rocket /> Publish</Button>
      </div>
    </div>
  );
}

function QuestionCard({ category, onDone, lang }: { category: Category; onDone: (a: string[]) => void; lang: Lang }) {
  const qs = QUESTIONS[category];
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<string[]>(() => qs.map(() => ""));
  const set = (v: string) => setPicks((p) => p.map((x, j) => (j === i ? v : x)));
  const q = qs[i]!;
  const last = i === qs.length - 1;
  const next = () => (last ? onDone(picks.map((p) => p || "Skipped")) : setI(i + 1));
  return (
    <div className="mt-3 rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{lang === "sw" ? `Hatua ${i + 1} kati ya ${qs.length}` : `Step ${i + 1} of ${qs.length}`}</span>
        <div className="flex gap-1">{qs.map((_, j) => <span className={cn("h-1.5 w-6 rounded-full", j <= i ? "bg-primary" : "bg-muted")} key={j} />)}</div>
      </div>
      <div className="animate-in fade-in slide-in-from-right-4 duration-300" key={i}>
        {lang === "sw" && <p className="mb-1 text-xs font-medium text-primary">Tuambie kidogo kuhusu biashara yako...</p>}
        <p className="mb-3 text-base font-semibold">{q.q}</p>
        <div className="flex flex-wrap gap-2">{q.options.map((o) => <Button className="h-11" key={o} onClick={() => set(o)} type="button" variant={picks[i] === o ? "default" : "outline"}>{o}</Button>)}</div>
        <input aria-label={`Custom answer: ${q.q}`} className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm" onChange={(e) => set(e.target.value)} placeholder="Type custom..." value={q.options.includes(picks[i] ?? "") ? "" : picks[i]} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button className="h-11" disabled={i === 0} onClick={() => setI(i - 1)} type="button" variant="ghost"><ChevronLeft /> Back</Button>
        <Button className="h-11" onClick={() => { set(""); next(); }} type="button" variant="ghost">Skip</Button>
        <Button className="ml-auto h-11" disabled={!picks[i]?.trim()} onClick={next} type="button">{last ? <><Check /> Save & Continue</> : <>Next <ChevronRight /></>}</Button>
      </div>
    </div>
  );
}

function ChatMessages({ messages, onOffer, onAnswers, onCheck, onScan, onTweak, lang }: { lang: Lang; messages: Msg[]; onOffer: (build: boolean) => void; onAnswers: (a: string[]) => void; onCheck: () => void; onScan: () => void; onTweak: (p: string) => void }) {
  return (
    <Conversation className="min-h-0">
      <ConversationContent className="mx-auto w-full max-w-3xl gap-7 px-4 py-8 sm:px-6">
        {messages.map((m) => (
          <Message from={m.role} key={m.id}>
            <MessageContent className="text-base leading-7">
              <MessageResponse>{m.text}</MessageResponse>
              {m.thinking && <ThinkingBlock category={m.thinking} />}
              {m.questions && <QuestionCard category={m.questions} lang={lang} onDone={onAnswers} />}
              {m.offer && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button className="h-11" onClick={() => onOffer(true)}><Rocket /> Start building app</Button>
                  <Button className="h-11" onClick={() => onOffer(false)} variant="outline"><Pencil /> Tweak details</Button>
                </div>
              )}
              {m.done && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button className="h-11" onClick={onCheck}><Eye /> Check my preview</Button>
                  <Button className="h-11" onClick={onScan} variant="outline"><ScanSearch /> Scan for issues</Button>
                  <span className="sr-only"><button onClick={() => onTweak("")} type="button" /></span>
                </div>
              )}
            </MessageContent>
          </Message>
        ))}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}

export function HomeScreen() {
  const { dark, toggle } = useTheme();
  const send = (text: string) => {
    window.location.href = `/chat/${Date.now().toString(36)}?prompt=${encodeURIComponent(text)}`;
  };
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-16 items-center justify-between px-4 sm:px-7">
        <BrandMark />
        <div className="flex items-center gap-1">
          <Button aria-label="Toggle theme" onClick={toggle} size="icon" variant="ghost">{dark ? <Sun /> : <Moon />}</Button>
          <Button size="lg" variant="ghost"><UserRound /> Sign in</Button>
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 pb-24">
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-xl bg-primary text-2xl font-bold text-primary-foreground shadow-md">F</div>
          <h1 className="text-3xl font-semibold sm:text-5xl">What can I help you create?</h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">Think it through, make a plan, or start building.</p>
        </div>
        <div className="w-full max-w-3xl"><Composer large onSend={send} /></div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["Plan a product", "Write something", "Analyze a file", "Build an app"].map((l) => <Button key={l} onClick={() => send(l)} variant="outline">{l}</Button>)}
        </div>
      </section>
      <p className="pb-5 text-center text-xs text-muted-foreground">Friendlu AI can make mistakes. Check important information.</p>
    </main>
  );
}

export function ChatShell({ initialPrompt = "", threadId }: { initialPrompt?: string; threadId: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatHidden, setChatHidden] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"chat" | "preview">("chat");
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [template, setTemplate] = useState<Template>("Landing");
  const [reloadKey, setReloadKey] = useState(0);
  const [publishOpen, setPublishOpen] = useState(false);
  const [projectName, setProjectName] = useState("Nairobi Electronics Shop");
  const [projectNameDraft, setProjectNameDraft] = useState("Nairobi Electronics Shop");
  const [renaming, setRenaming] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [credits, setCredits] = useState(3);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [connOpen, setConnOpen] = useState(false);
  const [connectors, setConnectors] = useState<string[]>([]);
  const [inspect, setInspect] = useState(false);
  const [editEl, setEditEl] = useState<{ el: HTMLElement; name: string } | null>(null);
  const [badge, setBadge] = useState<{ x: number; y: number } | null>(null);
  const hoverRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [status, setStatusRaw] = useState<Status>("planning");
  const building = status !== "planning";
  const [category, setCategory] = useState<Category>(() => detect(initialPrompt));
  const [asked, setAsked] = useState(Boolean(initialPrompt));
  const [messages, setMessages] = useState<Msg[]>(() =>
    initialPrompt
      ? [msg("user", initialPrompt), { ...msg("assistant", `Love it — a **${LABEL[detect(initialPrompt)]}** project. A few quick taps so I get it right:`), questions: detect(initialPrompt) }]
      : [msg("assistant", "Hi, I'm Friendlu. What business are we building today?")]
  );
  const key = `friendlu-project-${threadId}`;
  const setStatus = (s: Status, c: Category = category) => {
    setStatusRaw(s);
    try { localStorage.setItem(key, JSON.stringify({ status: s === "building" ? "built" : s, category: c })); } catch { /* ignore */ }
  };
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "null") as { status: Status; category: Category } | null;
      if (saved?.status === "built" && !initialPrompt) {
        setStatusRaw("built"); setCategory(saved.category); setSidebarCollapsed(true);
        if (window.innerWidth < 768) setMobileView("preview");
        setMessages([msg("assistant", "Welcome back! Your app preview is ready. What should we change next?")]);
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const reply = (text: string, mode: Mode): Msg => {
    if (building) {
      const next = templates[(templates.indexOf(template) + 1) % templates.length] ?? "Landing";
      setTemplate(next);
      return msg("assistant", `Done — I applied **${text}** and refreshed the preview. Anything else to tweak?`);
    }
    if (!asked && (mode === "build" || isBuildIntent(text) || detect(text) !== "custom")) {
      const c = detect(text);
      setCategory(c); setAsked(true);
      return { ...msg("assistant", `Great — a **${LABEL[c]}** project. A few quick taps so I get it right:`), questions: c };
    }
    return msg("assistant", "Noted. I've added that to your plan. **Ready to build?**", true);
  };

  const send = (text: string, mode: Mode = "plan") => {
    if (credits <= 0) { setTopUpOpen(true); return; }
    const left = credits - 1;
    setCredits(left);
    setMessages((c) => [...c, msg("user", text), reply(text, mode)]);
    if (left === 0) toast.warning("That was your last free credit — top up to keep building");
  };

  const onAnswers = (answers: string[]) => {
    setMessages((c) => [
      ...c.map((m) => ({ ...m, questions: undefined })),
      msg("user", answers.join(" · ")),
      msg("assistant", `Here's your plan for a **${LABEL[category]}**:\n\n${PLAN[category].map((p, i) => `${i + 1}. ${p}`).join("\n")}\n${answers.map((a) => `- ${a}`).join("\n")}\n\nShall I start building?`, true),
    ]);
  };

  const onOffer = (build: boolean) => {
    setMessages((c) => [...c.map((m) => ({ ...m, offer: false })), build ? msg("assistant", "🔨 Building your first version… laying out pages, adding your content and styling.") : msg("assistant", "Sure — tell me what you'd like to change in the plan.")]);
    if (!build) return;
    setStatus("building"); setSidebarCollapsed(true);
    setTimeout(() => {
      setStatus("built");
      setMessages((c) => [...c, { ...msg("assistant", `✅ Your app is ready!\n\n**What I built:** ${SUMMARY[category]}\n\n- Responsive on phone, tablet and desktop\n- Every button and form works in the preview\n- M-Pesa payment flow ready to connect`), done: true, thinking: category }]);
      if (window.innerWidth < 768) toast("Your preview is ready", { action: { label: "Check my preview", onClick: () => setMobileView("preview") } });
    }, 4800);
  };

  const onCheck = () => { setChatHidden(false); setMobileView("preview"); toast.success("Here's your live preview"); };
  const onScan = () => { toast.loading("Scanning for issues…", { id: "scan" }); setTimeout(() => toast.success("No critical issues · 2 suggestions: add page titles & compress images", { id: "scan" }), 1500); };

  const saveProjectName = () => {
    const nextName = projectNameDraft.trim();
    if (nextName) setProjectName(nextName);
    else setProjectNameDraft(projectName);
    setRenaming(false);
  };

  const addActionMessage = (text: string) => setMessages((current) => [...current, msg("assistant", text)]);

  const SEL = "h1,h2,h3,p,button,img,li,label";
  const clearHover = () => { hoverRef.current?.classList.remove("inspect-hover"); hoverRef.current = null; setBadge(null); };
  const onInspectHover = (e: React.MouseEvent) => {
    if (!inspect || editEl) return;
    const el = (e.target as HTMLElement).closest(SEL) as HTMLElement | null;
    if (!el || el === hoverRef.current || !previewRef.current?.contains(el) || el.closest("[data-edit-card]")) return;
    clearHover(); el.classList.add("inspect-hover"); hoverRef.current = el;
    const r = el.getBoundingClientRect(), p = previewRef.current.getBoundingClientRect();
    setBadge({ x: Math.max(0, r.left - p.left), y: Math.max(0, r.top - p.top - 22) });
  };
  const onInspectClick = (e: React.MouseEvent) => {
    if (!inspect || (e.target as HTMLElement).closest("[data-edit-card]")) return;
    const el = (e.target as HTMLElement).closest(SEL) as HTMLElement | null;
    if (!el) return;
    e.preventDefault(); e.stopPropagation();
    const t = el.tagName;
    const name = t === "H1" ? "Hero Headline" : t === "IMG" ? "Photo" : t === "BUTTON" ? "Button" : /H[23]/.test(t) ? "Section Title" : t === "LI" ? "List item" : "Text block";
    setEditEl({ el, name: `${name}${el.textContent?.trim() ? ` · “${el.textContent.trim().slice(0, 28)}”` : ""}` });
  };
  const applyEdit = (v: string) => {
    const el = editEl?.el; if (!el) return;
    if (el.tagName === "IMG") (el as HTMLImageElement).src = "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=900&q=70";
    else if (/badge|till/i.test(v)) el.insertAdjacentHTML("beforeend", ' <span style="margin-left:6px;border-radius:999px;background:var(--primary);color:var(--primary-foreground);padding:2px 8px;font-size:11px">M-Pesa Till 123456</span>');
    else if (/KES [\d,]+/.test(v) && /KES [\d,]+/.test(el.textContent ?? "")) el.textContent = (el.textContent ?? "").replace(/KES [\d,]+/, v.match(/KES [\d,]+/)![0]);
    else el.textContent = v.replace(/^change (text|headline) to /i, "");
    el.classList.remove("inspect-hover"); el.classList.add("edit-pulse"); setTimeout(() => el.classList.remove("edit-pulse"), 1000);
    setEditEl(null); toast.success("Edit applied to preview");
  };

  const chatColumn = (
    <>
      <ChatMessages key={threadId} lang={lang} messages={messages} onAnswers={onAnswers} onCheck={onCheck} onOffer={onOffer} onScan={onScan} onTweak={(p) => send(p)} />
      <div className="shrink-0 bg-background px-3 pb-3 sm:px-6 sm:pb-5">
        <div className={cn("mx-auto", status === "planning" ? "max-w-2xl" : "max-w-3xl")}>
          {status === "built" && <div className="mb-2"><PillStrip items={TWEAKS[category]} onPick={(p) => send(p)} /></div>}
          <Composer chips={CONNECTORS.filter((c) => connectors.includes(c.id)).map((c) => c.chip)} locked={credits <= 0} onLang={setLang} onSend={send} onTopUp={() => setTopUpOpen(true)} />
        </div>
        {!building && <p className="mt-2 text-center text-xs text-muted-foreground">Friendlu AI can make mistakes. Check important information.</p>}
      </div>
    </>
  );

  return (
    <main className="flex h-dvh overflow-hidden bg-background">
      <Sidebar collapsed={sidebarCollapsed} onClose={() => setMenuOpen(false)} onToggle={() => setSidebarCollapsed((current) => !current)} open={menuOpen} />
      {menuOpen && <button aria-label="Close menu overlay" className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setMenuOpen(false)} type="button" />}
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="grid h-16 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <Button aria-label="Open menu" className="lg:hidden" onClick={() => setMenuOpen(true)} size="icon" variant="ghost"><Menu /></Button>
            {renaming ? (
              <div className="flex min-w-0 items-center gap-1">
                <input aria-label="Project name" autoFocus className="h-9 min-w-0 max-w-64 rounded-md border border-input bg-background px-3 text-sm font-semibold outline-none focus:ring-1 focus:ring-ring" onChange={(event) => setProjectNameDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveProjectName(); if (event.key === "Escape") { setProjectNameDraft(projectName); setRenaming(false); } }} value={projectNameDraft} />
                <Button aria-label="Save project name" onClick={saveProjectName} size="icon-sm" variant="ghost"><Check /></Button>
                <Button aria-label="Cancel rename" onClick={() => { setProjectNameDraft(projectName); setRenaming(false); }} size="icon-sm" variant="ghost"><X /></Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="min-w-0 max-w-full justify-start px-2 text-base font-semibold" variant="ghost"><span className="truncate">{projectName}</span><ChevronDown /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onSelect={() => setRenaming(true)}><Pencil /> Rename project</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setConnOpen(true)}><Wrench /> Tools & Integrations</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => addActionMessage(`Duplicated **${projectName}** as a new mock project.`)}><Copy /> Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => addActionMessage("Delete is disabled in this prototype, so your project is still safe.")}><Trash2 /> Delete project</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {building && (
            <div className="flex items-center gap-1">
              <div className="flex rounded-full bg-muted p-1 md:hidden" aria-label="Switch view">
                {(["chat", "preview"] as const).map((v) => (
                  <Button className={cn("h-9 rounded-full px-4 capitalize", mobileView === v && "bg-background shadow-sm")} key={v} onClick={() => setMobileView(v)} size="sm" type="button" variant="ghost">{v}</Button>
                ))}
              </div>
              <Button aria-label="Project hub" onClick={() => setHubOpen(true)} size="icon" variant="ghost"><Gauge /></Button>
              <ProjectHub open={hubOpen} onOpenChange={setHubOpen} />
              <Button className="hidden bg-blue-600 text-white hover:bg-blue-700 md:inline-flex" onClick={() => setPublishOpen(true)}><Rocket /> Publish</Button>
            </div>
          )}
        </header>
        {status === "planning" ? (
          chatColumn
        ) : (
          <div className="flex min-h-0 flex-1">
            <div className={cn("relative min-h-0 flex-col transition-[width] duration-200 md:flex md:shrink-0 md:border-r md:border-border", chatHidden ? "md:w-12" : "md:w-[44%] md:min-w-[420px] md:max-w-[640px]", mobileView === "chat" ? "flex w-full" : "hidden")}>
              {chatHidden ? (
                <div className="hidden flex-col items-center gap-2 pt-2 md:flex">
                  <Button aria-label="Show chat" onClick={() => setChatHidden(false)} size="icon-sm" variant="secondary"><PanelLeftOpen /></Button>
                  <MessageSquare className="size-4 text-muted-foreground" />
                </div>
              ) : (
                <div className="absolute right-2 top-2 z-20 hidden gap-1 md:flex">
                  <Button aria-label="Full preview" onClick={() => setChatHidden(true)} size="icon-sm" variant="secondary"><PanelLeftClose /></Button>
                </div>
              )}
              <div className={cn("flex min-h-0 flex-1 flex-col", chatHidden && "md:hidden")}>{chatColumn}</div>
            </div>
            <div className={cn("min-h-0 min-w-0 flex-1 flex-col md:flex md:bg-muted md:p-3", mobileView === "preview" ? "flex" : "hidden")}>
              <div className="hidden items-center gap-2 pb-2 md:flex">
                {templates.map((t) => <Button className="h-8" key={t} onClick={() => setTemplate(t)} size="sm" variant={t === template ? "secondary" : "ghost"}>{t}</Button>)}
                <SuggestPageMenu onPick={(p) => send(p, "build")} />
                <div className="ml-auto flex items-center rounded-md border border-border bg-background p-0.5" aria-label="Preview device">
                  {([
                    ["desktop", Monitor, "Desktop preview"],
                    ["tablet", Tablet, "Tablet preview"],
                    ["mobile", Smartphone, "Mobile preview"],
                  ] as const).map(([device, Icon, label]) => <Button aria-label={label} aria-pressed={previewDevice === device} className="size-8" key={device} onClick={() => setPreviewDevice(device)} size="icon-sm" variant={previewDevice === device ? "secondary" : "ghost"}><Icon /></Button>)}
                </div>
                <Button aria-label="Click to edit" aria-pressed={inspect} onClick={() => setInspect((v) => !v)} size="icon-sm" variant={inspect ? "default" : "ghost"}><MousePointer2 /></Button>
                <Button aria-label="Reload preview" onClick={() => setReloadKey((k) => k + 1)} size="icon-sm" variant="ghost"><RotateCw /></Button>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden md:flex md:items-center md:justify-center md:overflow-auto md:rounded-xl md:border md:border-border md:bg-secondary md:p-4 md:shadow-sm">
                <div className={cn("relative h-full min-h-0 overflow-hidden bg-background transition-[width,border-radius] duration-200", previewDevice === "desktop" && "w-full", previewDevice === "tablet" && "w-[768px] max-w-full rounded-[24px] border-[10px] border-foreground/80 shadow-xl", previewDevice === "mobile" && "w-[390px] max-w-full rounded-[34px] border-[8px] border-foreground/80 pb-2 shadow-xl")}>
                  {previewDevice === "mobile" && <div className="relative flex h-8 items-center justify-between bg-background px-5 text-[10px] font-semibold"><span>9:41</span><span className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-foreground" /><span>5G&nbsp; 100%</span></div>}
                  <div className={cn("relative h-full min-h-0", previewDevice === "mobile" && "h-[calc(100%-2rem)]")} onClickCapture={onInspectClick} onMouseLeave={clearHover} onMouseOver={onInspectHover} ref={previewRef}>
                    {inspect && badge && <span className="pointer-events-none absolute z-30 rounded bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground" style={{ left: badge.x, top: badge.y }}>✏️ Edit element</span>}
                    {editEl && <EditCard name={editEl.name} onApply={applyEdit} onClose={() => setEditEl(null)} />}{status === "building" ? <BuildingAnimation /> : <DemoSite category={category} connectors={connectors} key={reloadKey} />}</div>
                </div>
              </div>
              <div className="flex h-16 shrink-0 items-center gap-1 border-t border-border bg-card px-3 md:hidden">
                <Button aria-label="Reload" className="size-11" onClick={() => setReloadKey((k) => k + 1)} size="icon" variant="ghost"><RotateCw /></Button>
                <Button aria-label="Edit" className="size-11" onClick={() => setMobileView("chat")} size="icon" variant="ghost"><Edit3 /></Button>
                <Button aria-label="Click to edit" className="size-11" onClick={() => setInspect((v) => !v)} size="icon" variant={inspect ? "default" : "ghost"}><MousePointer2 /></Button>
                <Button className="ml-auto h-11 bg-blue-600 px-5 text-white hover:bg-blue-700" onClick={() => setPublishOpen(true)}><Rocket /> Publish</Button>
              </div>
            </div>
          </div>
        )}
      </section>
      {publishOpen && <PublishSheet onClose={() => setPublishOpen(false)} />}
      {topUpOpen && <TopUpSheet onClose={() => setTopUpOpen(false)} onPaid={(n, kes) => { setCredits((c) => c + n); setTopUpOpen(false); toast.success(`KES ${kes} received via M-Pesa · ${n} credits added`); setMessages((c) => [...c, msg("assistant", `⚡ **${n} credits added.** Your prompt bar is unlocked — let's keep building!`)]); }} />}
      {connOpen && <ConnectorsSheet active={connectors} onClose={() => setConnOpen(false)} onToggle={(id) => setConnectors((c) => { const on = c.includes(id); toast.success(on ? "Connector removed" : "Connector added to your app"); return on ? c.filter((x) => x !== id) : [...c, id]; })} />}
    </main>
  );
}

function EditCard({ name, onApply, onClose }: { name: string; onApply: (v: string) => void; onClose: () => void }) {
  const [v, setV] = useState("");
  const [busy, setBusy] = useState(false);
  const go = (t: string) => { if (!t.trim()) return; setBusy(true); setTimeout(() => onApply(t), 1000); };
  return (
    <div className="absolute inset-x-3 bottom-3 z-40 rounded-2xl border border-border bg-card p-4 shadow-xl animate-in slide-in-from-bottom-4" data-edit-card>
      <div className="mb-2 flex items-center justify-between"><p className="truncate text-sm font-semibold">✏️ Edit? {name}</p><Button aria-label="Close" onClick={onClose} size="icon-sm" variant="ghost"><X /></Button></div>
      <input autoFocus className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm" onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go(v)} placeholder="What would you like to change in this section?" value={v} />
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">{["Change price to KES 4,500", "Add M-Pesa Till Badge", "Change photo to Maasai Mara sunset", "Karibu! Book your adventure"].map((s) => <Button className="h-9 shrink-0 rounded-full" key={s} onClick={() => go(s)} size="sm" variant="outline">{s}</Button>)}</div>
      <Button className={cn("mt-3 h-11 w-full", busy && "animate-pulse")} disabled={busy || !v.trim()} onClick={() => go(v)}>{busy ? "Applying…" : "Apply Edit"}</Button>
    </div>
  );
}

function TopUpSheet({ onClose, onPaid }: { onClose: () => void; onPaid: (credits: number, kes: number) => void }) {
  const packs = [{ n: "Quick Booster", c: 35, k: 250 }, { n: "Launch Pack", c: 100, k: 600 }, { n: "Pro Rush", c: 300, k: 1500 }];
  const [pick, setPick] = useState(0);
  const [phone, setPhone] = useState("0712 345 678");
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    if (count === null) return;
    if (count === 0) { onPaid(packs[pick]!.c, packs[pick]!.k); return; }
    const t = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay sm:items-center" onClick={onClose}>
      <div aria-label="Top up credits" className="w-full max-w-md rounded-t-2xl border border-border bg-card p-6 shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Top up credits to continue</h2><Button aria-label="Close" onClick={onClose} size="icon" variant="ghost"><X /></Button></div>
        <p className="mt-1 text-sm text-muted-foreground">You've used your 3 free prompts. Pick a pack — paid in seconds with M-Pesa.</p>
        <div className="mt-4 space-y-2">{packs.map((p, i) => <button className={cn("flex h-14 w-full items-center justify-between rounded-xl border px-4 text-left", pick === i ? "border-primary bg-accent" : "border-border")} key={p.n} onClick={() => setPick(i)} type="button"><span><b>{p.n}</b><span className="block text-xs text-muted-foreground">{p.c} credits</span></span><b>KES {p.k.toLocaleString()}</b></button>)}</div>
        <label className="mt-4 block text-sm font-medium" htmlFor="topup-phone">Safaricom M-Pesa number</label>
        <input className="mt-1 h-11 w-full rounded-md border border-input bg-background px-3" id="topup-phone" onChange={(e) => setPhone(e.target.value)} value={phone} />
        <Button className="mt-4 h-12 w-full" disabled={count !== null || phone.replace(/\D/g, "").length < 10} onClick={() => setCount(3)}>{count !== null ? `STK push sent — enter PIN on your phone… ${count}s` : `Pay KES ${packs[pick]!.k.toLocaleString()} with M-Pesa`}</Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">Demo only — no real money is charged.</p>
      </div>
    </div>
  );
}

function ConnectorsSheet({ active, onClose, onToggle }: { active: string[]; onClose: () => void; onToggle: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-overlay" onClick={onClose}>
      <div aria-label="Connectors" className="h-full w-full max-w-md overflow-y-auto bg-card p-5 shadow-xl animate-in slide-in-from-right" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="mb-1 flex items-center justify-between"><h2 className="text-lg font-semibold">Tools & Integrations</h2><Button aria-label="Close" onClick={onClose} size="icon" variant="ghost"><X /></Button></div>
        <p className="mb-4 text-sm text-muted-foreground">Add connectors and Friendlu wires them into your app.</p>
        <div className="space-y-3">{CONNECTORS.map((c) => { const on = active.includes(c.id); return (
          <div className={cn("rounded-xl border p-4", on ? "border-primary bg-accent" : "border-border")} key={c.id}>
            <div className="flex items-center justify-between gap-2"><span className="font-medium">{c.chip.split(" ")[0]} {c.name}</span><Button className="h-10 shrink-0" onClick={() => onToggle(c.id)} size="sm" variant={on ? "outline" : "default"}>{on ? <><Check /> Added</> : "Add to App"}</Button></div>
            {on && <input className="mt-3 h-11 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder={`${c.field} (stored securely later)`} type="password" />}
          </div>
        ); })}</div>
      </div>
    </div>
  );
}
