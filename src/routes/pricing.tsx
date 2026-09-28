import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageFrame, PayBlock, inputCls } from "@/components/app-extras";
import { cn } from "@/lib/utils";

const meta = { t: "Pricing — Friendlu AI", d: "Simple plans in KES or USD. Pay with M-Pesa or card and build apps for your business." };
export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: meta.t }, { name: "description", content: meta.d }, { property: "og:title", content: meta.t }, { property: "og:description", content: meta.d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Pricing,
});

const tiers: [number, number, number][] = [[100, 2900, 24], [200, 5500, 50], [400, 10500, 100], [800, 19800, 200], [1200, 29400, 294], [2000, 48000, 480], [3000, 70500, 705], [4000, 92000, 920], [5000, 112500, 1125]];

function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [kes, setKes] = useState(true);
  const [tier, setTier] = useState(0);
  const [checkout, setCheckout] = useState<{ name: string; price: string } | null>(null);
  const fmt = (k: number, u: number) => { const m = annual ? 0.8 : 1; return kes ? `KES ${Math.round(k * m).toLocaleString()}` : `$${Math.round(u * m).toLocaleString()}`; };
  const [, pk, pu] = tiers[tier]!;
  const plans = [
    { name: "Free Starter", price: fmt(0, 0), items: ["3 preview projects", "Community templates", "friendlu.app address"] },
    { name: "Pro Creator", price: fmt(pk, pu), items: ["Live M-Pesa payments", "Custom .co.ke domain", "Remove Friendlu badge", "Monthly credits of your choice"], hot: true },
    { name: "Business & Agency", price: fmt(8500, 69), items: ["Team workspace & seats", "KRA eTIMS receipts", "Priority building", "Export source code"] },
  ];
  return (
    <PageFrame subtitle="Start free. Upgrade when your business grows." title="Pricing">
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="flex rounded-full bg-muted p-1">{[false, true].map((a) => <Button className="rounded-full" key={String(a)} onClick={() => setAnnual(a)} size="sm" variant={annual === a ? "default" : "ghost"}>{a ? "Annual (save 20%)" : "Monthly"}</Button>)}</div>
        <div className="flex rounded-full bg-muted p-1">{[true, false].map((k) => <Button className="rounded-full" key={String(k)} onClick={() => setKes(k)} size="sm" variant={kes === k ? "default" : "ghost"}>{k ? "KES" : "USD"}</Button>)}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div className={cn("flex flex-col rounded-2xl border bg-card p-5", p.hot ? "border-primary shadow-lg" : "border-border")} key={p.name}>
            {p.hot && <span className="mb-2 w-fit rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Most popular</span>}
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="mt-2 text-3xl font-bold">{p.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            {p.hot && (
              <select aria-label="Monthly credits" className={cn(inputCls, "mt-3")} onChange={(e) => setTier(Number(e.target.value))} value={tier}>
                {tiers.map(([c], i) => <option key={c} value={i}>{c.toLocaleString()} credits / month{i >= 4 ? ` (Save ${(i - 3) * 2}%)` : ""}</option>)}
              </select>
            )}
            <ul className="my-4 flex-1 space-y-2 text-sm">{p.items.map((i) => <li className="flex gap-2" key={i}><Check className="size-4 text-primary" />{i}</li>)}</ul>
            <Button className="h-11" onClick={() => (p.name === "Free Starter" ? (window.location.href = "/dashboard") : setCheckout({ name: p.name, price: p.price }))} variant={p.hot ? "default" : "outline"}>{p.name === "Free Starter" ? "Start free" : "Upgrade"}</Button>
          </div>
        ))}
      </div>
      <h2 className="mb-2 mt-10 text-xl font-semibold">Questions</h2>
      <Accordion collapsible type="single">
        {[["Can I use my own M-Pesa Till or Paybill?", "Yes. Add your Till or Paybill number in Tools and customers pay you directly."], ["Can I get a .co.ke domain?", "Pro and Business plans include a one-click .co.ke or .com domain."], ["Do you support KRA eTIMS?", "Business plans can send eTIMS-compliant receipts automatically."]].map(([q, a]) => (
          <AccordionItem key={q} value={q!}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>
        ))}
      </Accordion>
      <Dialog onOpenChange={(o) => !o && setCheckout(null)} open={!!checkout}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upgrade to {checkout?.name}</DialogTitle><DialogDescription>{checkout?.price} per month{annual ? ", billed yearly" : ""}.</DialogDescription></DialogHeader>
          <PayBlock label={checkout?.price ?? ""} onPaid={() => { toast.success(`You're on ${checkout?.name}!`); setCheckout(null); }} />
        </DialogContent>
      </Dialog>
    </PageFrame>
  );
}
