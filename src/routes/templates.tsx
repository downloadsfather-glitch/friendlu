import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageFrame, inputCls, startPrompt } from "@/components/app-extras";

const meta = { t: "Templates — M-Pesa, Chama & Booking apps | Friendlu AI", d: "Ready-made app templates for shops, chamas, salons and SaaS. Start building in one tap." };
export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: meta.t }, { name: "description", content: meta.d }, { property: "og:title", content: meta.t }, { property: "og:description", content: meta.d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Templates,
});

const cats = ["All", "Kenyan E-Commerce", "Chamas & SACCOs", "Booking & Services", "Global SaaS"];
const list = [
  { n: "M-Pesa Electronics Store", c: "Kenyan E-Commerce", t: ["M-Pesa", "KES", "WhatsApp"] },
  { n: "Fresh Grocery Delivery", c: "Kenyan E-Commerce", t: ["M-Pesa", "SMS"] },
  { n: "Chama Savings Ledger", c: "Chamas & SACCOs", t: ["M-Pesa", "KES"] },
  { n: "SACCO Loan Tracker", c: "Chamas & SACCOs", t: ["SMS", "KES"] },
  { n: "Salon Booking with SMS", c: "Booking & Services", t: ["SMS", "M-Pesa"] },
  { n: "Boda Delivery Tracker", c: "Booking & Services", t: ["WhatsApp"] },
  { n: "SaaS Boilerplate", c: "Global SaaS", t: ["Stripe", "React 19"] },
  { n: "Agency Portfolio", c: "Global SaaS", t: ["React 19"] },
];

function Templates() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const shown = list.filter((x) => (cat === "All" || x.c === cat) && x.n.toLowerCase().includes(q.toLowerCase()));
  return (
    <PageFrame subtitle="Pick one, then tell Friendlu what to change." title="Templates">
      <input className={inputCls} onChange={(e) => setQ(e.target.value)} placeholder="Search templates" value={q} />
      <div className="no-scrollbar my-4 flex gap-2 overflow-x-auto">{cats.map((c) => <Button className="h-10 shrink-0 rounded-full" key={c} onClick={() => setCat(c)} variant={cat === c ? "default" : "outline"}>{c}</Button>)}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((x) => (
          <div className="flex flex-col rounded-2xl border border-border bg-card p-3" key={x.n}>
            <div className="mb-3 h-28 rounded-xl bg-gradient-to-br from-accent to-secondary" />
            <p className="font-semibold">{x.n}</p>
            <p className="text-xs text-muted-foreground">{x.c}</p>
            <div className="my-2 flex flex-wrap gap-1">{x.t.map((t) => <span className="rounded-full bg-secondary px-2 py-0.5 text-xs" key={t}>{t}</span>)}</div>
            <Button className="mt-auto h-11" onClick={() => startPrompt(`Build a ${x.n} with ${x.t.join(", ")}`)}>Use this template</Button>
          </div>
        ))}
        {!shown.length && <p className="text-muted-foreground">No templates match.</p>}
      </div>
    </PageFrame>
  );
}
