import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BrandMark, Composer, PillStrip, useTheme } from "@/components/chat-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Folder, LogOut, Menu, Moon, Plus, Sun, X } from "lucide-react";
import { starters } from "@/components/landing";
import { cn } from "@/lib/utils";
import { CreditPill, WorkspaceMenu } from "@/components/app-extras";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Friendlu AI" },
      { name: "description", content: "Start a new project or open an existing one in Friendlu AI." },
      { property: "og:title", content: "Dashboard — Friendlu AI" },
      { property: "og:description", content: "Start a new project or open an existing one in Friendlu AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const recents = [
  { id: "nairobi-electronics", name: "Nairobi Electronics Shop" },
  { id: "kilimani-salon", name: "Kilimani Salon Booking" },
  { id: "chama-ledger", name: "Chama Savings Ledger" },
  { id: "apex-saas", name: "Apex Cloud SaaS" },
  { id: "ruaka-grocery", name: "Ruaka Fresh Grocery" },
];
const templates = ["M-Pesa Store", "Chama Ledger", "Boda Delivery Tracker", "SaaS Boilerplate"];
const tools = ["M-Pesa Daraja", "WhatsApp Commerce", "KRA eTIMS", "Africa's Talking SMS", "Stripe"];
const go = (path: string) => { window.location.href = path; };
const start = (text: string) => go(`/chat/${Date.now().toString(36)}?prompt=${encodeURIComponent(text)}`);

function Dashboard() {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [tab, setTab] = useState<"mine" | "recent" | "templates">("mine");
  const [q, setQ] = useState("");
  const cards = tab === "templates" ? templates.map((t) => ({ id: t, name: t })) : tab === "recent" ? recents.slice(0, 3) : recents;
  const shown = cards.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  const sidebar = (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex items-center justify-between">
        <WorkspaceMenu />
        <Button aria-label="Close menu" className="lg:hidden" onClick={() => setOpen(false)} size="icon" variant="ghost"><X /></Button>
      </div>
      <Button className="h-11 justify-start" onClick={() => go("/dashboard")}><Plus /> New</Button>
      <Button className="h-11 justify-start" onClick={() => go("/projects")} variant="ghost"><Folder /> Projects</Button>
      <p className="mt-3 px-2 text-xs font-medium text-muted-foreground">Recents</p>
      <div className="flex-1 overflow-y-auto">
        {recents.slice(0, 3).map((r) => <Button className="h-10 w-full justify-start font-normal" key={r.id} onClick={() => go(`/chat/${r.id}`)} variant="ghost">{r.name}</Button>)}
      </div>
      <CreditPill />
      <button className="rounded-xl border border-border bg-card p-3 text-left hover:border-primary" onClick={() => go("/pricing")} type="button">
        <p className="text-sm font-semibold">Upgrade to Pro <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">Pro</span></p>
        <p className="mt-1 text-xs text-muted-foreground">Unlock custom .co.ke domains & live M-Pesa STK push</p>
      </button>
      <div className="flex items-center gap-2 px-1">
        <button aria-label="Account" className="contents" onClick={() => go("/account")} type="button"><span className="relative grid size-9 place-items-center rounded-full bg-secondary text-sm font-semibold">D<span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-sidebar bg-primary" /></span>
        <span className="flex-1 text-left text-sm font-medium">Dfather</span></button>
        <Button aria-label="Toggle theme" onClick={toggle} size="icon" variant="ghost">{dark ? <Sun /> : <Moon />}</Button>
        <Button aria-label="Sign out" onClick={() => go("/?signin=1")} size="icon" variant="ghost"><LogOut /></Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh bg-background">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-overlay" onClick={() => setOpen(false)} type="button" />
          <aside className="relative h-full w-80 max-w-[85vw] bg-sidebar">{sidebar}</aside>
        </div>
      )}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 35%, color-mix(in oklch, var(--primary) 22%, transparent), transparent 70%)" }} />
        <header className="relative flex h-14 items-center gap-2 border-b border-border px-3 lg:hidden">
          <Button aria-label="Open menu" onClick={() => setOpen(true)} size="icon" variant="ghost"><Menu /></Button>
          <BrandMark />
        </header>
        <section className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-10 text-center">
          <button className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary" onClick={() => setToolsOpen(true)} type="button">✨ New: M-Pesa Express & WhatsApp Commerce live →</button>
          <h1 className="mt-6 text-4xl font-bold sm:text-5xl">Got an idea, Dfather?</h1>
          <div className="mt-8 w-full text-left"><Composer large onSend={start} placeholder="Ask Friendlu to create an app to..." /></div>
          <div className="mt-4 w-full"><PillStrip items={starters} onPick={start} /></div>
        </section>
        <section className="relative mx-auto mb-4 w-full max-w-5xl px-4">
          <div className="rounded-2xl border border-border bg-card p-3 shadow-lg">
            <div className="flex flex-wrap items-center gap-2">
              <input className="h-10 min-w-40 flex-1 rounded-lg border border-input bg-background px-3 text-sm" id="project-search" onChange={(e) => setQ(e.target.value)} placeholder="Search projects" value={q} />
              {([["mine", "My projects"], ["recent", "Recently viewed"], ["templates", "Templates"]] as const).map(([k, l]) => (
                <Button className={cn("h-10", tab !== k && "text-muted-foreground")} key={k} onClick={() => setTab(k)} variant={tab === k ? "secondary" : "ghost"}>{l}</Button>
              ))}
              <Button className="ml-auto h-10" onClick={() => go("/templates")} variant="link">Browse all →</Button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {shown.map((c) => (
                <button className="rounded-xl border border-border bg-background p-3 text-left text-sm font-medium hover:border-primary" key={c.id} onClick={() => tab === "templates" ? start(`Build a ${c.name}`) : go(`/chat/${c.id}`)} type="button">
                  <div className="mb-2 h-16 rounded-lg bg-secondary" />{c.name}
                </button>
              ))}
              {shown.length === 0 && <p className="p-3 text-sm text-muted-foreground">No matches.</p>}
            </div>
          </div>
        </section>
      </main>
      <Dialog onOpenChange={setToolsOpen} open={toolsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Connectors & Tools</DialogTitle><DialogDescription>Add ready-made features to your apps.</DialogDescription></DialogHeader>
          <div className="grid gap-2">{tools.map((t) => <div className="flex items-center justify-between rounded-lg border border-border p-3" key={t}><span className="text-sm font-medium">{t}</span><Button size="sm" variant="outline">Add</Button></div>)}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
