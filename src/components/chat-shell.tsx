"use client";

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
import { cn } from "@/lib/utils";
import {
  ArrowUp, Check, ChevronDown, Edit3, FileText, Gauge, Image, Menu, MessageSquare, Mic, Monitor,
  Moon, MousePointer2, Paperclip, PanelLeftClose, Plus, RotateCw, Rocket, Search, Settings, Sun,
  UserRound, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Mode = "plan" | "build";
type Msg = { id: number; role: "user" | "assistant"; text: string; offer?: boolean };

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

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground shadow-sm">F</div>
      <span className="text-base font-semibold">Friendlu AI</span>
    </div>
  );
}

function useTheme() {
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

function Composer({ large, onSend }: { large?: boolean; onSend: (text: string, mode: Mode) => void }) {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<Mode>("plan");
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <PromptInput
      className={cn("border-border bg-card shadow-[0_16px_50px_var(--composer-shadow)]", large && "rounded-xl")}
      onSubmit={({ text }) => {
        const t = text.trim();
        if (!t) return;
        onSend(t, mode);
        setValue("");
      }}
    >
      <PromptInputTextarea aria-label="Message Friendlu AI" className={cn("px-5 text-base", large ? "min-h-28 pt-5" : "min-h-16")} onChange={(e) => setValue(e.target.value)} placeholder="Ask anything, or describe what you want to build..." ref={ref} value={value} />
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
        </PromptInputTools>
        {value.trim() ? (
          <PromptInputSubmit className="rounded-full bg-primary text-primary-foreground"><ArrowUp /></PromptInputSubmit>
        ) : (
          <PromptInputButton aria-label="Record voice" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"><Mic /></PromptInputButton>
        )}
      </PromptInputFooter>
    </PromptInput>
  );
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dark, toggle } = useTheme();
  return (
    <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
      <div className="flex h-16 items-center justify-between px-4">
        <BrandMark />
        <Button aria-label="Close menu" className="lg:hidden" onClick={onClose} size="icon" variant="ghost"><PanelLeftClose /></Button>
      </div>
      <div className="space-y-1 px-3 pt-2">
        <Button className="h-11 w-full justify-start" onClick={() => { window.location.href = "/"; }} variant="outline"><Plus /> New chat</Button>
        <Button className="h-11 w-full justify-start font-normal" variant="ghost"><Search /> Search chats</Button>
      </div>
      <nav className="mt-5 min-h-0 flex-1 overflow-y-auto px-3" aria-label="Chat history">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Recent</p>
        <div className="space-y-1">
          {history.map((item) => (
            <Button className="h-10 w-full justify-start overflow-hidden px-2 font-normal" key={item.id} onClick={() => { window.location.href = `/chat/${item.id}`; }} variant="ghost">
              <MessageSquare className="shrink-0" /><span className="truncate">{item.title}</span>
            </Button>
          ))}
        </div>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Button className="h-11 w-full justify-start" onClick={toggle} variant="ghost">{dark ? <Sun /> : <Moon />} {dark ? "Light mode" : "Dark mode"}</Button>
        <Button className="h-11 w-full justify-start" variant="ghost"><Settings /> Settings</Button>
        <Button className="h-12 w-full justify-start" variant="ghost">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">AK</span>
          <span className="min-w-0 text-left"><span className="block truncate text-sm">Alex Kimani</span><span className="block text-xs font-normal text-muted-foreground">Free plan</span></span>
        </Button>
      </div>
    </aside>
  );
}

const templates = ["Landing", "Store", "Dashboard"] as const;
type Template = (typeof templates)[number];

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

function ChatMessages({ messages, onOffer }: { messages: Msg[]; onOffer: (build: boolean) => void }) {
  return (
    <Conversation className="min-h-0">
      <ConversationContent className="mx-auto w-full max-w-3xl gap-7 px-4 py-8 sm:px-6">
        {messages.map((m) => (
          <Message from={m.role} key={m.id}>
            <MessageContent className="text-base leading-7">
              <MessageResponse>{m.text}</MessageResponse>
              {m.offer && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button className="h-11" onClick={() => onOffer(true)}><Rocket /> Start building</Button>
                  <Button className="h-11" onClick={() => onOffer(false)} variant="outline">Keep planning</Button>
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
  const [building, setBuilding] = useState(false);
  const [mobileView, setMobileView] = useState<"chat" | "preview">("chat");
  const [template, setTemplate] = useState<Template>("Landing");
  const [reloadKey, setReloadKey] = useState(0);
  const [publishOpen, setPublishOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() =>
    initialPrompt
      ? [msg("user", initialPrompt), isBuildIntent(initialPrompt) ? msg("assistant", "That sounds like a great project. **Do you want to build your app?**", true) : msg("assistant", "Happy to help! Could you share a bit more about your goal and who it's for?")]
      : [msg("assistant", "Hi, I'm Friendlu. What are we working on today?")]
  );

  const reply = (text: string, mode: Mode) => {
    if (building) {
      const next = templates[(templates.indexOf(template) + 1) % templates.length];
      setTemplate(next);
      return msg("assistant", `Done — I updated the preview with a **${next}** layout. Anything else to tweak?`);
    }
    if (mode === "build" || isBuildIntent(text)) return msg("assistant", "I can make that. **Do you want to build your app?**", true);
    return msg("assistant", "Good question. Here's a quick plan:\n\n1. Clarify the goal\n2. Outline key steps\n3. Decide what to build first\n\nWhat detail should we start with?");
  };

  const send = (text: string, mode: Mode = "plan") => setMessages((c) => [...c, msg("user", text), reply(text, mode)]);

  const onOffer = (build: boolean) => {
    setMessages((c) => [...c.map((m) => ({ ...m, offer: false })), build ? msg("assistant", "Building your first version now… Your preview is ready on the right. Try a suggestion below.") : msg("assistant", "Sure, let's keep planning. What features matter most?")]);
    if (build) setBuilding(true);
  };

  const chatColumn = (
    <>
      <ChatMessages key={threadId} messages={messages} onOffer={onOffer} />
      <div className="shrink-0 bg-background px-3 pb-3 sm:px-6 sm:pb-5">
        <div className="mx-auto max-w-3xl">
          {building && (
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {pills.map((p) => <Button className="h-9 shrink-0 rounded-full" key={p} onClick={() => send(p)} size="sm" variant="outline">{p}</Button>)}
            </div>
          )}
          <Composer onSend={send} />
        </div>
        {!building && <p className="mt-2 text-center text-xs text-muted-foreground">Friendlu AI can make mistakes. Check important information.</p>}
      </div>
    </>
  );

  return (
    <main className="flex h-dvh overflow-hidden bg-background">
      <Sidebar onClose={() => setMenuOpen(false)} open={menuOpen} />
      {menuOpen && <button aria-label="Close menu overlay" className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setMenuOpen(false)} type="button" />}
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <Button aria-label="Open menu" className="lg:hidden" onClick={() => setMenuOpen(true)} size="icon" variant="ghost"><Menu /></Button>
            <Button className="truncate text-base font-semibold" variant="ghost">{building ? "Bloom app" : "Friendlu 1.0"} <ChevronDown /></Button>
          </div>
          {building && (
            <div className="flex items-center gap-1">
              <div className="flex rounded-full bg-muted p-1 md:hidden" aria-label="Switch view">
                {(["chat", "preview"] as const).map((v) => (
                  <button className={cn("h-9 rounded-full px-4 text-sm font-medium capitalize", mobileView === v && "bg-background shadow-sm")} key={v} onClick={() => setMobileView(v)} type="button">{v}</button>
                ))}
              </div>
              <Button aria-label="Build overview dashboard" size="icon" variant="ghost"><Gauge /></Button>
              <Button className="hidden bg-blue-600 text-white hover:bg-blue-700 md:inline-flex" onClick={() => setPublishOpen(true)}><Rocket /> Publish</Button>
            </div>
          )}
        </header>
        {!building ? (
          chatColumn
        ) : (
          <div className="flex min-h-0 flex-1">
            <div className={cn("min-h-0 flex-col md:flex md:w-[400px] md:shrink-0 md:border-r md:border-border", mobileView === "chat" ? "flex w-full" : "hidden")}>{chatColumn}</div>
            <div className={cn("min-h-0 min-w-0 flex-1 flex-col md:flex md:bg-muted md:p-3", mobileView === "preview" ? "flex" : "hidden")}>
              <div className="hidden items-center gap-2 pb-2 md:flex">
                <Monitor className="size-4 text-muted-foreground" />
                {templates.map((t) => <Button className="h-8" key={t} onClick={() => setTemplate(t)} size="sm" variant={t === template ? "secondary" : "ghost"}>{t}</Button>)}
                <Button aria-label="Reload preview" className="ml-auto" onClick={() => setReloadKey((k) => k + 1)} size="icon-sm" variant="ghost"><RotateCw /></Button>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden md:rounded-xl md:border md:border-border md:shadow-sm">
                <MockSite reloadKey={reloadKey} template={template} />
              </div>
              <div className="flex h-16 shrink-0 items-center gap-1 border-t border-border bg-card px-3 md:hidden">
                <Button aria-label="Reload" className="size-11" onClick={() => setReloadKey((k) => k + 1)} size="icon" variant="ghost"><RotateCw /></Button>
                <Button aria-label="Edit" className="size-11" onClick={() => setMobileView("chat")} size="icon" variant="ghost"><Edit3 /></Button>
                <Button aria-label="Pointer" className="size-11" size="icon" variant="ghost"><MousePointer2 /></Button>
                <Button className="ml-auto h-11 bg-blue-600 px-5 text-white hover:bg-blue-700" onClick={() => setPublishOpen(true)}><Rocket /> Publish</Button>
              </div>
            </div>
          </div>
        )}
      </section>
      {publishOpen && <PublishSheet onClose={() => setPublishOpen(false)} />}
    </main>
  );
}
