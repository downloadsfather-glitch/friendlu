import { useEffect, useState } from "react";
import { BrandMark, Composer, PillStrip, useTheme } from "@/components/chat-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Globe, Mail, MessageCircle, Moon, Phone, Sparkles, Sun, Wallet, Wand2, Download } from "lucide-react";

export const starters = [
  "Safari & Tour Agency (Mara packages, 3-day itinerary & 20% deposit)",
  "Student Tech Portfolio (Project case studies, GitHub links & CV download)",
  "Logistics & Freight Company (Instant quote calculator & fleet showcase)",
  "Dental & Wellness Clinic (Online appointment booking & WhatsApp desk)",
  "Boutique Fashion Brand (Catalog, size guide & M-Pesa checkout)",
];

const showcase = [
  { name: "Savannah Mara Expeditions", tag: "Tour & Safari", url: "savannahmara.co.ke", headline: "3-Day Mara Classic · KES 48,000", badge: "Book via M-Pesa", prompt: "Safari tour agency website", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=70" },
  { name: "Kiko Urban Apparel", tag: "Online store", url: "kikoapparel.co.ke", headline: "Kitenge Shirt · KES 3,200", badge: "M-Pesa STK verified", prompt: "Boutique fashion store with M-Pesa checkout", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=70" },
  { name: "SwiftFreight Kenya", tag: "Logistics", url: "swiftfreight.co.ke", headline: "Nairobi ➔ Mombasa", badge: "Instant quote: KES 8,500", prompt: "Logistics freight company with quote calculator", img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=70" },
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
  useEffect(() => { if (new URLSearchParams(window.location.search).get("signin")) setPending(""); }, []);
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
            <Button className="btn-glow border-0" onClick={() => setPending("")}>Start building</Button>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="liquid-blob absolute -left-20 top-0 size-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="liquid-blob absolute right-0 top-20 size-[28rem] rounded-full bg-chart-4/25 blur-3xl [animation-delay:-3s]" />
        <div className="liquid-blob absolute bottom-0 left-1/3 size-80 rounded-full bg-chart-1/20 blur-3xl [animation-delay:-6s]" />
      </div>
      <section className="relative mx-auto max-w-4xl px-4 pb-16 pt-16 text-center sm:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm"><Sparkles className="size-4 text-primary" /> The AI builder built for Africa & the world</span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl">Build production web apps in minutes — for Nairobi, New York, and beyond.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">Turn ideas into live apps with instant M-Pesa STK push, WhatsApp order dispatch, KES & USD pricing, or Stripe checkout. No technical jargon needed.</p>
        <div className="mx-auto mt-9 max-w-3xl text-left"><Composer large onSend={ask} /></div>
        <div className="mx-auto mt-4 max-w-3xl"><PillStrip items={starters} onPick={ask} /></div>
      </section>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16" id="showcase">
        <h2 className="text-center text-3xl font-semibold">Built with Friendlu</h2>
        <p className="mt-2 text-center text-muted-foreground">Real-looking apps made from a single sentence.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {showcase.map((s) => (
            <button className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl" key={s.name} onClick={() => ask(s.prompt)} type="button">
              <div className="flex items-center gap-1.5 border-b border-border bg-muted px-3 py-2">
                <span className="size-2.5 rounded-full bg-destructive/70" /><span className="size-2.5 rounded-full bg-chart-4" /><span className="size-2.5 rounded-full bg-chart-2" />
                <span className="ml-2 truncate rounded bg-background px-2 py-0.5 text-[11px] text-muted-foreground">{s.url}</span>
              </div>
              <div className="relative h-44 overflow-hidden">
                <img alt={s.name} className="size-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" src={s.img} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-sm font-bold">{s.headline}</p>
                  <span className="mt-1 inline-block rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-black">{s.badge}</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div><p className="text-xs font-medium text-primary">{s.tag}</p><p className="font-semibold">{s.name}</p></div>
                <span className="text-sm font-semibold text-primary">Try this →</span>
              </div>
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
