"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
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
  ArrowUp,
  Check,
  ChevronDown,
  Code2,
  FileText,
  Image,
  Menu,
  MessageSquare,
  Mic,
  Moon,
  Paperclip,
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ChatShellProps = {
  initialPrompt?: string;
  threadId: string;
};

type Mode = "plan" | "build";

const history = [
  { id: "design-a-dashboard", title: "Design a clean dashboard" },
  { id: "explain-api", title: "Explain this API response" },
  { id: "launch-checklist", title: "Launch checklist" },
  { id: "portfolio-copy", title: "Rewrite portfolio copy" },
];

const starterAssistant =
  "I can help you think, write, research, and build. This is a visual preview, so responses are not connected yet.";

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground shadow-sm">
        A
      </div>
      {!compact && <span className="text-base font-semibold">Amani AI</span>}
    </div>
  );
}

function ThemeButton() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <Button
      aria-label={dark ? "Use light mode" : "Use dark mode"}
      onClick={toggle}
      size="icon"
      variant="ghost"
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <div className="flex rounded-md bg-muted p-1" aria-label="Response mode">
      {(["plan", "build"] as const).map((item) => (
        <Button
          aria-pressed={mode === item}
          className={cn("h-7 px-3 capitalize", mode === item && "bg-background shadow-sm")}
          key={item}
          onClick={() => onChange(item)}
          size="sm"
          type="button"
          variant="ghost"
        >
          {mode === item && <Check className="size-3.5" />}
          {item}
        </Button>
      ))}
    </div>
  );
}

function Composer({
  large,
  initialValue = "",
  onSend,
}: {
  large?: boolean;
  initialValue?: string;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [mode, setMode] = useState<Mode>("plan");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <PromptInput
      className={cn(
        "border-border bg-card shadow-[0_16px_50px_var(--composer-shadow)]",
        large && "rounded-xl"
      )}
      onSubmit={({ text }) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setValue("");
        window.setTimeout(() => textareaRef.current?.focus(), 0);
      }}
    >
      <PromptInputTextarea
        aria-label="Message Amani AI"
        className={cn("px-5 text-base", large ? "min-h-28 pt-5" : "min-h-16")}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask anything, or describe what you want to build..."
        ref={textareaRef}
        value={value}
      />
      <PromptInputFooter className="px-3 pb-3">
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger aria-label="Add something" tooltip="Add something">
              <Plus />
            </PromptInputActionMenuTrigger>
            <PromptInputActionMenuContent>
              <PromptInputActionMenuItem><Paperclip />Attach file</PromptInputActionMenuItem>
              <PromptInputActionMenuItem><Image />Add image</PromptInputActionMenuItem>
              <PromptInputActionMenuItem><FileText />Add document</PromptInputActionMenuItem>
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <ModeSwitch mode={mode} onChange={setMode} />
        </PromptInputTools>
        {value.trim() ? (
          <PromptInputSubmit className="rounded-full bg-primary text-primary-foreground" tooltip="Send message">
            <ArrowUp />
          </PromptInputSubmit>
        ) : (
          <PromptInputButton aria-label="Record voice" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" tooltip="Record voice">
            <Mic />
          </PromptInputButton>
        )}
      </PromptInputFooter>
    </PromptInput>
  );
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const startNew = () => {
    window.location.href = "/";
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <BrandMark />
        <Button aria-label="Close menu" onClick={onClose} size="icon" variant="ghost">
          <PanelLeftClose />
        </Button>
      </div>
      <div className="px-3 pt-2">
        <Button className="h-11 w-full justify-start" onClick={startNew} variant="outline">
          <Plus /> New chat
        </Button>
      </div>
      <nav className="mt-7 min-h-0 flex-1 overflow-y-auto px-3" aria-label="Chat history">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Recent</p>
        <div className="space-y-1">
          {history.map((item) => (
            <Button
              className="h-10 w-full justify-start overflow-hidden px-2 font-normal"
              key={item.id}
              onClick={() => { window.location.href = `/chat/${item.id}`; }}
              variant="ghost"
            >
              <MessageSquare className="shrink-0" />
              <span className="truncate">{item.title}</span>
            </Button>
          ))}
        </div>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Button className="h-11 w-full justify-start" variant="ghost"><Settings /> Settings</Button>
        <Button className="h-12 w-full justify-start" variant="ghost">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">AK</span>
          <span className="min-w-0 text-left"><span className="block truncate text-sm">Alex Kimani</span><span className="block text-xs font-normal text-muted-foreground">Free plan</span></span>
        </Button>
      </div>
    </aside>
  );
}

export function HomeScreen() {
  const send = (text: string) => {
    const id = `${Date.now().toString(36)}`;
    window.location.href = `/chat/${id}?prompt=${encodeURIComponent(text)}`;
  };

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-16 items-center justify-between px-4 sm:px-7">
        <BrandMark />
        <div className="flex items-center gap-1">
          <ThemeButton />
          <Button size="lg" variant="ghost"><UserRound /> Sign in</Button>
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 pb-24">
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-xl bg-primary text-2xl font-bold text-primary-foreground shadow-md">A</div>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">What can I help you create?</h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">Think it through, make a plan, or start building.</p>
        </div>
        <div className="w-full max-w-3xl"><Composer large onSend={send} /></div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["Plan a product", "Write something", "Analyze a file", "Build an app"].map((label) => (
            <Button key={label} onClick={() => send(label)} variant="outline">{label}</Button>
          ))}
        </div>
      </section>
      <p className="pb-5 text-center text-xs text-muted-foreground">Amani AI can make mistakes. Check important information.</p>
    </main>
  );
}

export function ChatShell({ initialPrompt = "", threadId }: ChatShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState(() =>
    initialPrompt
      ? [
          { role: "user" as const, parts: [{ type: "text" as const, text: initialPrompt }] },
          { role: "assistant" as const, parts: [{ type: "text" as const, text: starterAssistant }] },
        ]
      : [{ role: "assistant" as const, parts: [{ type: "text" as const, text: starterAssistant }] }]
  );

  const send = (text: string) => {
    setMessages((current) => [
      ...current,
      { role: "user", parts: [{ type: "text", text }] },
      { role: "assistant", parts: [{ type: "text", text: "This is the frontend skeleton. Connect a language model when you are ready to generate live answers." }] },
    ]);
  };

  return (
    <main className="flex h-dvh overflow-hidden bg-background">
      <Sidebar onClose={() => setMenuOpen(false)} open={menuOpen} />
      {menuOpen && <button aria-label="Close menu overlay" className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setMenuOpen(false)} type="button" />}
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-3 sm:px-5">
          <div className="flex items-center gap-2">
            <Button aria-label="Open menu" className="lg:hidden" onClick={() => setMenuOpen(true)} size="icon" variant="ghost"><Menu /></Button>
            <Button className="text-base font-semibold" variant="ghost">Amani 1.0 <ChevronDown /></Button>
          </div>
          <div className="flex items-center gap-1">
            <Button aria-label="Search chats" size="icon" variant="ghost"><Search /></Button>
            <ThemeButton />
          </div>
        </header>
        <Conversation className="min-h-0">
          <ConversationContent className="mx-auto w-full max-w-3xl gap-7 px-4 py-8 sm:px-6">
            {messages.map((message, index) => (
              <Message from={message.role} key={`${threadId}-${index}`}>
                <MessageContent className="text-base leading-7">
                  {message.parts.map((part, partIndex) => part.type === "text" ? <MessageResponse key={partIndex}>{part.text}</MessageResponse> : null)}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div className="shrink-0 bg-background px-3 pb-3 sm:px-6 sm:pb-5">
          <div className="mx-auto max-w-3xl"><Composer onSend={send} /></div>
          <p className="mt-2 text-center text-xs text-muted-foreground">Amani AI can make mistakes. Check important information.</p>
        </div>
      </section>
    </main>
  );
}