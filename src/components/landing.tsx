import { useState } from "react";
import { BrandMark, Composer, PillStrip, useTheme } from "@/components/chat-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Globe, Mail, MessageCircle, Moon, Phone, Sparkles, Sun, Wallet, Wand2, Download } from "lucide-react";

const starters = [
  "🇰🇪 E-commerce with M-Pesa & WhatsApp Checkout",
  "💰 Chama & SACCO Savings Dividend Tracker",
  "🌍 Global SaaS Landing Page with Stripe & KES pricing",
  "🚚 CBD Courier & Upcountry Delivery Dispatch",
  "🧾 KRA eTIMS & PDF Receipt Generator",
];

const showcase = [
  { name: "Nairobi Electronics Boutique", tag: "E-commerce", lines: ["Samsung A15 — KES 2,400 deposit", "Pay with M-Pesa STK push", "WhatsApp receipt sent ✓"] },
  { name: "Apex Cloud SaaS", tag: "Global SaaS", lines: ["Pro plan — $29 / KES 3,750", "USD ⇄ KES toggle", "Stripe billing active"] },
  { name: "Umoja Chama Ledger", tag: "Finance", lines: ["Pool: KES 480,000", "Dividend: KES 12,300 / member", "SMS alerts to 24 members"] },
];

const features = [
  { icon: Wallet, title: "Localized payments out of the box", text: "Daraja M-Pesa, Paybill, Till, Stripe and cards — ready on day one." },
  { icon: MessageCircle, title: "WhatsApp-first customer flows", text: "Instant order notifications and friendly customer chat bots." },
  { icon: Wand2, title: "Zero learning curve", text: "Describe it in plain English or Swahili and get a working app." },
  { icon: Download, title: "Export anywhere", text: "One-click .co.ke domain link or clean source code download." },
];

export function LandingPage() {
  const { dark, toggle } = useTheme();
  const [pending, setPending] = useState<string | null>(null);
  const ask = (text: string) => setPending(text);
  const finish = () => {
    const p = pending ?? "";
    window.location.href = p ? `/chat/${Date.now().toString(36)}?prompt=${encodeURIComponent(p)}` : "/dashboard";
  };

  return (
    <main className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2"><BrandMark /><span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">Beta</span></div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex" aria-label="Main">
            {["Showcase", "Integrations", "Templates", "Pricing"].map((l) => <a className="hover:text-foreground" href={`#${l.toLowerCase()}`} key={l}>{l}</a>)}
          </nav>
          <div className="flex items-center gap-1">
            <Button aria-label="Toggle theme" onClick={toggle} size="icon" variant="ghost">{dark ? <Sun /> : <Moon />}</Button>
            <Button className="hidden sm:inline-flex" onClick={() => setPending("")} variant="ghost">Sign in</Button>
            <Button onClick={() => setPending("")}>Start building</Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center sm:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm"><Sparkles className="size-4 text-primary" /> The AI builder built for Africa & the world</span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl">Build production web apps in minutes — for Nairobi, New York, and beyond.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">Turn ideas into live apps with instant M-Pesa STK push, WhatsApp order dispatch, KES & USD pricing, or Stripe checkout. No technical jargon needed.</p>
        <div className="mx-auto mt-9 max-w-3xl text-left"><Composer large onSend={ask} /></div>
        <div className="mx-auto mt-4 max-w-3xl"><PillStrip items={starters} onPick={ask} /></div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16" id="showcase">
        <h2 className="text-center text-3xl font-semibold">Built with Friendlu</h2>
        <p className="mt-2 text-center text-muted-foreground">Real-looking apps made from a single sentence.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {showcase.map((s) => (
            <button className="group rounded-xl border border-border bg-card p-3 text-left transition hover:-translate-y-1 hover:shadow-lg" key={s.name} onClick={() => ask(`Build something like ${s.name}`)} type="button">
              <div className="rounded-lg bg-secondary p-4">
                <div className="mb-3 flex gap-1"><span className="size-2 rounded-full bg-primary" /><span className="size-2 rounded-full bg-muted-foreground/40" /><span className="size-2 rounded-full bg-muted-foreground/40" /></div>
                <div className="space-y-2">{s.lines.map((l) => <div className="rounded-md bg-card px-3 py-2 text-sm" key={l}>{l}</div>)}</div>
              </div>
              <div className="px-1 pt-3"><p className="text-xs font-medium text-primary">{s.tag}</p><p className="font-semibold">{s.name}</p></div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16" id="integrations">
        <h2 className="text-center text-3xl font-semibold">Global standards. African edge.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div className="rounded-xl border border-border bg-card p-5" key={title}>
              <div className="grid size-10 place-items-center rounded-lg bg-accent text-primary"><Icon className="size-5" /></div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center" id="templates">
        <h2 className="text-3xl font-semibold sm:text-4xl">Ready to launch your business to the world?</h2>
        <p className="mt-3 text-muted-foreground">Type your idea — we'll handle the rest.</p>
        <div className="mx-auto mt-8 max-w-3xl text-left"><Composer onSend={ask} /></div>
        <div className="mx-auto mt-4 max-w-3xl"><PillStrip items={starters} onPick={ask} /></div>
      </section>

      <footer className="border-t border-border" id="pricing">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>© 2026 Friendlu AI · Made in Kenya 🇰🇪 for builders everywhere</span>
          <div className="flex gap-4"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">X</a><a href="#">LinkedIn</a></div>
        </div>
      </footer>

      <Dialog onOpenChange={(o) => !o && setPending(null)} open={pending !== null}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Welcome to Friendlu AI</DialogTitle>
            <DialogDescription>Sign in to generate and customize your project.</DialogDescription>
          </DialogHeader>
          {pending && <p className="rounded-md bg-muted p-3 text-sm">“{pending}”</p>}
          <div className="grid gap-2">
            <Button className="h-12" onClick={finish} variant="outline"><Globe /> Continue with Google</Button>
            <Button className="h-12" onClick={finish} variant="outline"><Phone /> Continue with Phone / M-Pesa number</Button>
            <Button className="h-12" onClick={finish}><Mail /> Continue with Email</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
