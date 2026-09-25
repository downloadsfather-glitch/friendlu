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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ArrowUp, Check, ChevronDown, Copy, Edit3, FileText, Gauge, Image, Menu, MessageSquare, Mic, Monitor,
  Moon, MousePointer2, Paperclip, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Pencil,
  Plus, RotateCw, Rocket, Search, Settings, Smartphone, Sun, Tablet, Trash2, UserRound, Wrench, X,
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

function Sidebar({ collapsed, onClose, onToggle, open }: { collapsed: boolean; onClose: () => void; onToggle: () => void; open: boolean }) {
  const { dark, toggle } = useTheme();
  return (
    <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[transform,width] duration-200 lg:static lg:translate-x-0", collapsed ? "lg:w-[72px]" : "lg:w-[280px]", open ? "translate-x-0" : "-translate-x-full")}>
      <div className={cn("flex h-16 items-center justify-between px-4", collapsed && "lg:justify-center lg:px-2")}>
        <div className={cn(collapsed && "lg:[&_span]:hidden")}><BrandMark /></div>
        <Button aria-label="Close menu" className="lg:hidden" onClick={onClose} size="icon" variant="ghost"><PanelLeftClose /></Button>
        <Button aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden lg:inline-flex" onClick={onToggle} size="icon" variant="ghost">{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button>
      </div>
      <div className="space-y-1 px-3 pt-2">
        <Button aria-label="New chat" className={cn("h-11 w-full justify-start", collapsed && "lg:justify-center lg:px-0")} onClick={() => { window.location.href = "/"; }} variant="outline"><Plus /> <span className={cn(collapsed && "lg:hidden")}>New chat</span></Button>
        <Button aria-label="Search chats" className={cn("h-11 w-full justify-start font-normal", collapsed && "lg:justify-center lg:px-0")} variant="ghost"><Search /> <span className={cn(collapsed && "lg:hidden")}>Search chats</span></Button>
      </div>
      <nav className={cn("mt-5 min-h-0 flex-1 overflow-y-auto px-3", collapsed && "lg:hidden")} aria-label="Chat history">
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
        <Button aria-label={dark ? "Light mode" : "Dark mode"} className={cn("h-11 w-full justify-start", collapsed && "lg:justify-center lg:px-0")} onClick={toggle} variant="ghost">{dark ? <Sun /> : <Moon />} <span className={cn(collapsed && "lg:hidden")}>{dark ? "Light mode" : "Dark mode"}</span></Button>
        <Button aria-label="Tools" className={cn("h-11 w-full justify-start", collapsed && "lg:justify-center lg:px-0")} variant="ghost"><Wrench /> <span className={cn(collapsed && "lg:hidden")}>Tools</span></Button>
        <Button aria-label="Settings" className={cn("h-11 w-full justify-start", collapsed && "lg:justify-center lg:px-0")} variant="ghost"><Settings /> <span className={cn(collapsed && "lg:hidden")}>Settings</span></Button>
        <Button aria-label="Account" className={cn("h-12 w-full justify-start", collapsed && "lg:justify-center lg:px-0")} variant="ghost">
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatCompact, setChatCompact] = useState(true);
  const [mobileView, setMobileView] = useState<"chat" | "preview">("chat");
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [template, setTemplate] = useState<Template>("Landing");
  const [reloadKey, setReloadKey] = useState(0);
  const [publishOpen, setPublishOpen] = useState(false);
  const [projectName, setProjectName] = useState("Nairobi Electronics Shop");
  const [projectNameDraft, setProjectNameDraft] = useState("Nairobi Electronics Shop");
  const [renaming, setRenaming] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() =>
    initialPrompt
      ? [msg("user", initialPrompt), isBuildIntent(initialPrompt) ? msg("assistant", "That sounds like a great project. **Do you want to build your app?**", true) : msg("assistant", "Happy to help! Could you share a bit more about your goal and who it's for?")]
      : [msg("assistant", "Hi, I'm Friendlu. What are we working on today?")]
  );

  const reply = (text: string, mode: Mode) => {
    if (building) {
      const next = templates[(templates.indexOf(template) + 1) % templates.length] ?? "Landing";
      setTemplate(next);
      return msg("assistant", `Done — I updated the preview with a **${next}** layout. Anything else to tweak?`);
    }
    if (mode === "build" || isBuildIntent(text)) return msg("assistant", "I can make that. **Do you want to build your app?**", true);
    return msg("assistant", "Good question. Here's a quick plan:\n\n1. Clarify the goal\n2. Outline key steps\n3. Decide what to build first\n\nWhat detail should we start with?");
  };

  const send = (text: string, mode: Mode = "plan") => setMessages((c) => [...c, msg("user", text), reply(text, mode)]);

  const onOffer = (build: boolean) => {
    setMessages((c) => [...c.map((m) => ({ ...m, offer: false })), build ? msg("assistant", "Building your first version now… Your preview is ready on the right. Try a suggestion below.") : msg("assistant", "Sure, let's keep planning. What features matter most?")]);
    if (build) {
      setBuilding(true);
      setSidebarCollapsed(true);
    }
  };

  const saveProjectName = () => {
    const nextName = projectNameDraft.trim();
    if (nextName) setProjectName(nextName);
    else setProjectNameDraft(projectName);
    setRenaming(false);
  };

  const addActionMessage = (text: string) => setMessages((current) => [...current, msg("assistant", text)]);

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
                  <DropdownMenuItem onSelect={() => addActionMessage("Tools & Integrations is ready for this project. Choose a tool to add when the catalog opens.")}><Wrench /> Tools & Integrations</DropdownMenuItem>
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
              <Button aria-label="Build overview dashboard" size="icon" variant="ghost"><Gauge /></Button>
              <Button className="hidden bg-blue-600 text-white hover:bg-blue-700 md:inline-flex" onClick={() => setPublishOpen(true)}><Rocket /> Publish</Button>
            </div>
          )}
        </header>
        {!building ? (
          chatColumn
        ) : (
          <div className="flex min-h-0 flex-1">
            <div className={cn("relative min-h-0 flex-col transition-[width] duration-200 md:flex md:shrink-0 md:border-r md:border-border", chatCompact ? "md:w-[320px]" : "md:w-[500px]", mobileView === "chat" ? "flex w-full" : "hidden")}>
              <Button aria-label={chatCompact ? "Expand chat panel" : "Shrink chat panel"} className="absolute right-2 top-2 z-20 hidden md:inline-flex" onClick={() => setChatCompact((current) => !current)} size="icon-sm" variant="secondary">{chatCompact ? <PanelRightOpen /> : <PanelRightClose />}</Button>
              {chatColumn}
            </div>
            <div className={cn("min-h-0 min-w-0 flex-1 flex-col md:flex md:bg-muted md:p-3", mobileView === "preview" ? "flex" : "hidden")}>
              <div className="hidden items-center gap-2 pb-2 md:flex">
                {templates.map((t) => <Button className="h-8" key={t} onClick={() => setTemplate(t)} size="sm" variant={t === template ? "secondary" : "ghost"}>{t}</Button>)}
                <div className="ml-auto flex items-center rounded-md border border-border bg-background p-0.5" aria-label="Preview device">
                  {([
                    ["desktop", Monitor, "Desktop preview"],
                    ["tablet", Tablet, "Tablet preview"],
                    ["mobile", Smartphone, "Mobile preview"],
                  ] as const).map(([device, Icon, label]) => <Button aria-label={label} aria-pressed={previewDevice === device} className="size-8" key={device} onClick={() => setPreviewDevice(device)} size="icon-sm" variant={previewDevice === device ? "secondary" : "ghost"}><Icon /></Button>)}
                </div>
                <Button aria-label="Reload preview" onClick={() => setReloadKey((k) => k + 1)} size="icon-sm" variant="ghost"><RotateCw /></Button>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden md:flex md:items-center md:justify-center md:overflow-auto md:rounded-xl md:border md:border-border md:bg-secondary md:p-4 md:shadow-sm">
                <div className={cn("relative h-full min-h-0 overflow-hidden bg-background transition-[width,border-radius] duration-200", previewDevice === "desktop" && "w-full", previewDevice === "tablet" && "w-[768px] max-w-full rounded-[24px] border-[10px] border-foreground/80 shadow-xl", previewDevice === "mobile" && "w-[390px] max-w-full rounded-[34px] border-[8px] border-foreground/80 pb-2 shadow-xl")}>
                  {previewDevice === "mobile" && <div className="relative flex h-8 items-center justify-between bg-background px-5 text-[10px] font-semibold"><span>9:41</span><span className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-foreground" /><span>5G&nbsp; 100%</span></div>}
                  <div className={cn("h-full min-h-0", previewDevice === "mobile" && "h-[calc(100%-2rem)]")}><MockSite reloadKey={reloadKey} template={template} /></div>
                </div>
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
