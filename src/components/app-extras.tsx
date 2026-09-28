import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, ChevronDown, Copy, Plus, Sparkles, UserPlus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const go = (path: string) => { window.location.href = path; };
export const startPrompt = (text: string) => go(`/chat/${Date.now().toString(36)}?prompt=${encodeURIComponent(text)}`);
export const inputCls = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring";

/* ---------- Simple page frame for app/marketing pages ---------- */
const navLinks = [["/dashboard", "Dashboard"], ["/projects", "Projects"], ["/templates", "Templates"], ["/tools", "Tools"], ["/pricing", "Pricing"], ["/settings", "Settings"], ["/account", "Account"]] as const;
export function PageFrame({ title, subtitle, action, children }: { title: string; subtitle: string; action?: ReactNode; children: ReactNode }) {
  const here = typeof window !== "undefined" ? window.location.pathname : "";
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
          <Button aria-label="Back to dashboard" onClick={() => go("/dashboard")} size="icon" variant="ghost"><ArrowLeft /></Button>
          <a className="flex items-center gap-2 font-semibold" href="/"><span className="grid size-7 place-items-center rounded-lg bg-primary text-sm text-primary-foreground">F</span>Friendlu AI</a>
          <nav className="no-scrollbar ml-auto flex gap-1 overflow-x-auto">
            {navLinks.map(([h, l]) => <a className={cn("rounded-md px-3 py-2 text-sm whitespace-nowrap hover:bg-accent", here === h && "bg-secondary font-medium")} href={h} key={h}>{l}</a>)}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div><h1 className="text-3xl font-bold">{title}</h1><p className="mt-1 text-muted-foreground">{subtitle}</p></div>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}

/* ---------- M-Pesa / Card pay block (shared by checkout + top up) ---------- */
export function PayBlock({ label, onPaid }: { label: string; onPaid: () => void }) {
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
  const [phone, setPhone] = useState("+254 7");
  const [waiting, setWaiting] = useState(false);
  const pay = () => {
    setWaiting(true);
    setTimeout(() => { setWaiting(false); onPaid(); }, 3000);
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {([["mpesa", "M-Pesa Express"], ["card", "Card / Pesapal"]] as const).map(([k, l]) => (
          <Button className="h-11" key={k} onClick={() => setMethod(k)} variant={method === k ? "default" : "outline"}>{l}</Button>
        ))}
      </div>
      {method === "mpesa" ? (
        <input aria-label="Safaricom number" className={inputCls} onChange={(e) => setPhone(e.target.value)} value={phone} />
      ) : (
        <div className="grid gap-2"><input className={inputCls} placeholder="Card number" /><div className="grid grid-cols-2 gap-2"><input className={inputCls} placeholder="MM/YY" /><input className={inputCls} placeholder="CVC" /></div></div>
      )}
      <Button className="h-12 w-full" disabled={waiting} onClick={pay}>
        {waiting ? (method === "mpesa" ? "Check your phone and enter your M-Pesa PIN…" : "Processing…") : method === "mpesa" ? `Send M-Pesa prompt · ${label}` : `Pay ${label}`}
      </Button>
      <p className="text-center text-xs text-muted-foreground">Demo only — no money is charged.</p>
    </div>
  );
}

/* ---------- Credits pill + top-up ---------- */
const packs = [
  { c: 50, kes: 650, usd: 5, tag: "" },
  { c: 100, kes: 1200, usd: 9, tag: "Popular" },
  { c: 250, kes: 2700, usd: 20, tag: "Save 10%" },
  { c: 500, kes: 4900, usd: 38, tag: "Save 20%" },
];
export function TopUpDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (n: number) => void }) {
  const [pick, setPick] = useState(1);
  const p = packs[pick]!;
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader><DialogTitle>Top up credits to keep building</DialogTitle><DialogDescription>Credits never expire. Pay in seconds with M-Pesa.</DialogDescription></DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {packs.map((x, i) => (
            <button className={cn("rounded-xl border p-3 text-left", i === pick ? "border-primary bg-accent" : "border-border")} key={x.c} onClick={() => setPick(i)} type="button">
              <p className="font-semibold">{x.c} credits</p>
              <p className="text-sm text-muted-foreground">KES {x.kes.toLocaleString()} · ${x.usd}</p>
              {x.tag && <span className="mt-1 inline-block rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{x.tag}</span>}
            </button>
          ))}
        </div>
        <PayBlock label={`KES ${p.kes.toLocaleString()}`} onPaid={() => { onAdd(p.c); onOpenChange(false); toast.success(`Payment verified — ${p.c} credits added`); }} />
      </DialogContent>
    </Dialog>
  );
}
export function CreditPill({ collapsed }: { collapsed?: boolean }) {
  const [credits, setCredits] = useState(18);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={cn("flex h-11 w-full items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm hover:border-primary", collapsed && "lg:justify-center lg:px-0")} onClick={() => setOpen(true)} type="button">
        <Zap className="size-4 text-primary" /><span className={cn("flex-1 text-left", collapsed && "lg:hidden")}>{credits} credits left</span>
        <span className={cn("rounded-md bg-primary px-2 py-0.5 text-xs text-primary-foreground", collapsed && "lg:hidden")}>Top up +</span>
      </button>
      <TopUpDialog onAdd={(n) => setCredits((c) => c + n)} onOpenChange={setOpen} open={open} />
    </>
  );
}

/* ---------- Workspace switcher + invites ---------- */
export function InviteDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [role, setRole] = useState("Member");
  const [who, setWho] = useState("");
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader><DialogTitle>Invite team members</DialogTitle><DialogDescription>They'll get an email or WhatsApp link to join your workspace.</DialogDescription></DialogHeader>
        <input className={inputCls} onChange={(e) => setWho(e.target.value)} placeholder="Email or phone (+254…)" value={who} />
        <div className="grid grid-cols-3 gap-2">
          {[["Admin", "Can bill & delete"], ["Member", "Can edit & build"], ["Viewer", "Preview only"]].map(([r, d]) => (
            <button className={cn("rounded-lg border p-2 text-left text-sm", role === r ? "border-primary bg-accent" : "border-border")} key={r} onClick={() => setRole(r!)} type="button"><b>{r}</b><span className="block text-xs text-muted-foreground">{d}</span></button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button className="h-11 flex-1" disabled={!who.trim()} onClick={() => { toast.success(`Invite sent to ${who} as ${role}`); setWho(""); }}><UserPlus /> Send invite</Button>
          <Button className="h-11" onClick={() => { void navigator.clipboard?.writeText("https://friendlu.app/join/dfather-8k2"); toast.success("Invite link copied"); }} variant="outline"><Copy /> Copy link</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export function WorkspaceMenu({ collapsed }: { collapsed?: boolean }) {
  const [ws, setWs] = useState("Dfather's Workspace");
  const [invite, setInvite] = useState(false);
  const list = ["Dfather's Workspace", "Nairobi Electronics Ltd"];
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-11 min-w-0 items-center gap-2 rounded-lg px-2 hover:bg-sidebar-accent" type="button">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{ws[0]}</span>
            <span className={cn("truncate text-sm font-medium", collapsed && "lg:hidden")}>{ws}</span><ChevronDown className={cn("size-4 shrink-0", collapsed && "lg:hidden")} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          {list.map((w, i) => <DropdownMenuItem key={w} onSelect={() => { setWs(w); toast(`Switched to ${w}`); }}>{w}<span className="ml-auto text-xs text-muted-foreground">{i ? "Team" : "Personal"}</span>{ws === w && <Check />}</DropdownMenuItem>)}
          <DropdownMenuItem onSelect={() => toast.success("New workspace created")}><Plus /> Create new workspace</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setInvite(true)}><UserPlus /> Invite team members</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => go("/settings")}>Workspace settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <InviteDialog onOpenChange={setInvite} open={invite} />
    </>
  );
}

/* ---------- Project Hub (speedometer) ---------- */
const Row = ({ a, b }: { a: string; b: string }) => <div className="flex justify-between border-b border-border py-2 text-sm last:border-0"><span>{a}</span><span className="text-muted-foreground">{b}</span></div>;
export function ProjectHub({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [int, setInt] = useState({ "M-Pesa Daraja": true, "WhatsApp orders": true, "Africa's Talking SMS": false });
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Project Hub</DialogTitle><DialogDescription>Everything about your app in one place.</DialogDescription></DialogHeader>
        <Tabs defaultValue="analytics">
          <TabsList className="no-scrollbar h-auto w-full justify-start overflow-x-auto">
            {["analytics", "cloud", "payments", "integrations", "git", "share"].map((t) => <TabsTrigger className="capitalize" key={t} value={t}>{t}</TabsTrigger>)}
          </TabsList>
          <div className="min-h-64 pt-3">
            <TabsContent value="analytics"><div className="grid grid-cols-3 gap-2">{[["Visitors (24h)", "1,284"], ["On phones", "82%"], ["Safaricom 4G", "1.2s"]].map(([a, b]) => <div className="rounded-xl border border-border p-3" key={a}><p className="text-xs text-muted-foreground">{a}</p><p className="text-2xl font-bold">{b}</p></div>)}</div><Row a="Airtel 4G load" b="1.6s" /><Row a="3G load" b="2.9s" /></TabsContent>
            <TabsContent value="cloud"><pre className="rounded-lg bg-muted p-3 text-xs">{"12:01 build ok (3.2s)\n12:02 GET /shop 200\n12:04 POST /api/mpesa/callback 200"}</pre><Row a="Table: products" b="48 rows" /><Row a="Table: orders" b="112 rows" /><Row a="Storage: product-photos" b="36 MB" /></TabsContent>
            <TabsContent value="payments"><Row a="M-Pesa Till 829104" b="Active" /><Row a="Today's revenue" b="KES 14,200" /><Row a="QK7H2 · Jane W." b="KES 3,500" /><Row a="QK7H9 · Otieno" b="KES 1,200" /></TabsContent>
            <TabsContent value="integrations">{Object.entries(int).map(([k, v]) => <div className="flex items-center justify-between py-2 text-sm" key={k}>{k}<Switch checked={v} onCheckedChange={(c) => setInt((s) => ({ ...s, [k]: c }))} /></div>)}</TabsContent>
            <TabsContent value="git"><Row a="Add M-Pesa checkout" b="2 min ago" /><Row a="Store layout" b="1 h ago" /><Row a="First version" b="Today" /><Button className="mt-3 h-11" onClick={() => toast.success("Source code ZIP ready")} variant="outline">Export source code</Button></TabsContent>
            <TabsContent value="share"><div className="flex gap-2"><input className={inputCls} readOnly value="nairobi-electronics.friendlu.app" /><Button className="h-11" onClick={() => toast.success("Link copied")}><Copy /></Button></div><div className="my-3 grid size-28 place-items-center rounded-lg border border-border bg-muted text-xs text-muted-foreground">QR code</div><div className="flex items-center justify-between text-sm">Password protect<Switch /></div></TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Suggest page ---------- */
const suggestions = [
  ["/checkout", "M-Pesa payment & WhatsApp order confirmation"],
  ["/locations", "Nairobi delivery zones & pickup points"],
  ["/reviews", "Customer ratings & photos"],
  ["/contact", "WhatsApp chat button & business hours"],
] as const;
export function SuggestPageMenu({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button className="h-8" size="sm" variant="outline"><Sparkles /> Suggest page <ChevronDown /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Recommended pages to add</DropdownMenuLabel>
        {suggestions.map(([p, d]) => (
          <DropdownMenuItem className="flex-col items-start" key={p} onSelect={() => onPick(`Add a ${p} page with ${d}`)}><span className="font-medium">{p}</span><span className="text-xs text-muted-foreground">{d}</span></DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
