import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageFrame, inputCls } from "@/components/app-extras";

const meta = { t: "Tools & Integrations — M-Pesa, WhatsApp, eTIMS | Friendlu AI", d: "Plug M-Pesa, WhatsApp, SMS, KRA eTIMS, Stripe and domains into your app with one tap." };
export const Route = createFileRoute("/tools")({
  head: () => ({ meta: [{ title: meta.t }, { name: "description", content: meta.d }, { property: "og:title", content: meta.t }, { property: "og:description", content: meta.d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Tools,
});

type Tool = { n: string; d: string; b: string; f: string[] };
const groups: [string, Tool[]][] = [
  ["Payments", [
    { n: "M-Pesa Express", d: "Customers pay by entering their M-Pesa PIN.", b: "Popular in Kenya", f: ["Till or Paybill number", "Consumer key", "Consumer secret", "Passkey"] },
    { n: "Pesapal", d: "Cards, Airtel Money and M-Pesa in one checkout.", b: "Instant setup", f: ["Consumer key", "Consumer secret"] },
    { n: "Stripe", d: "Accept cards from customers worldwide.", b: "Global", f: ["Secret key"] },
  ]],
  ["Customers & Commerce", [
    { n: "WhatsApp Commerce Bot", d: "Send orders and receipts on WhatsApp.", b: "Popular in Kenya", f: ["WhatsApp business number", "Access token"] },
    { n: "Africa's Talking SMS", d: "Booking reminders and one-time codes by SMS.", b: "Instant setup", f: ["Username", "API key", "Sender ID"] },
    { n: "KRA eTIMS", d: "Tax-compliant receipts for every sale.", b: "Beta", f: ["KRA PIN", "Device serial"] },
  ]],
  ["Hosting & Domains", [
    { n: "1-Click .co.ke Domain", d: "Get yourshop.co.ke connected in minutes.", b: "Instant setup", f: ["Domain name"] },
    { n: "Install as phone app", d: "Customers add your site to their home screen.", b: "Instant setup", f: ["App name"] },
  ]],
  ["AI Agents", [
    { n: "Safaricom Network Optimizer", d: "Makes pages load fast on 3G and 4G.", b: "Beta", f: [] },
    { n: "Auto-Debugger", d: "Finds and fixes problems for you.", b: "Beta", f: [] },
  ]],
];

function Tools() {
  const [open, setOpen] = useState<Tool | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({});
  return (
    <PageFrame subtitle="Add ready-made features to your app. No coding needed." title="Tools & Integrations">
      {groups.map(([g, tools]) => (
        <section className="mb-8" key={g}>
          <h2 className="mb-3 text-lg font-semibold">{g}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <div className="flex flex-col rounded-2xl border border-border bg-card p-4" key={t.n}>
                <span className="mb-2 w-fit rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{t.b}</span>
                <p className="font-semibold">{t.n}</p><p className="mb-3 text-sm text-muted-foreground">{t.d}</p>
                <Button className="mt-auto h-11" onClick={() => { setVals({}); t.f.length ? setOpen(t) : toast.success(`${t.n} added to your app`); }} variant="outline">Add to app</Button>
              </div>
            ))}
          </div>
        </section>
      ))}
      <Dialog onOpenChange={(o) => !o && setOpen(null)} open={!!open}>
        <DialogContent>
          <DialogHeader><DialogTitle>Connect {open?.n}</DialogTitle><DialogDescription>Your keys are kept private and never shown in chat.</DialogDescription></DialogHeader>
          {open?.f.map((f) => <input aria-label={f} className={inputCls} key={f} onChange={(e) => setVals((v) => ({ ...v, [f]: e.target.value }))} placeholder={f} value={vals[f] ?? ""} />)}
          <Button onClick={() => setVals(Object.fromEntries((open?.f ?? []).map((f, i) => [f, i === 0 ? "174379" : `sandbox_${Math.random().toString(36).slice(2, 10)}`])))} variant="secondary">⚡ Auto-fill Safaricom Sandbox Demo Keys</Button>
          <Button className="h-11" onClick={() => { toast.success(`${open?.n} connected`); setOpen(null); }}>Save & activate</Button>
        </DialogContent>
      </Dialog>
    </PageFrame>
  );
}
