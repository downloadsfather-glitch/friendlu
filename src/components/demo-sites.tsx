import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, ChevronDown, Loader2, ShoppingCart, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DemoCategory = "tour" | "portfolio" | "corporate" | "clinic" | "store" | "custom";

const STEPS = [
  "Analyzing archetype & user intent...",
  "Scaffolding component tree & color tokens...",
  "Injecting interactive state & M-Pesa payment rails...",
  "Finalizing responsive mobile & desktop viewports...",
];

export function BuildingAnimation() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-foreground/90">
      <div className="liquid-blob absolute -left-16 -top-16 size-80 rounded-full bg-primary/80 blur-3xl" />
      <div className="liquid-blob absolute -bottom-20 right-0 size-96 rounded-full bg-chart-4/70 blur-3xl [animation-delay:-3s]" />
      <div className="liquid-blob absolute left-1/3 top-1/3 size-72 rounded-full bg-chart-1/60 blur-3xl [animation-delay:-6s]" />
      <div className="relative w-[min(90%,380px)] rounded-2xl border border-background/20 bg-background/15 p-6 text-background shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2 font-semibold"><Sparkles className="size-5" /> Friendlu is building</div>
        <ul className="space-y-3 text-sm">
          {STEPS.map((s, i) => (
            <li className={cn("flex items-center gap-2 transition-opacity", i > step && "opacity-40")} key={s}>
              {i < step ? <Check className="size-4" /> : i === step ? <Loader2 className="size-4 animate-spin" /> : <span className="size-4 rounded-full border border-background/50" />}
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-background/20"><div className="h-full rounded-full bg-background transition-all duration-700" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
      </div>
    </div>
  );
}

export const THINKING: Record<DemoCategory, string[]> = {
  tour: ["Architecture: travel booking domain — packages, itineraries, deposits; serif-free bold typography.", "Components: Navbar, Hero, Package catalog, Itinerary tabs, Booking drawer.", "Interaction: currency toggle (KES/USD), guest counter, 20% M-Pesa deposit math.", "Payments: STK push mock wired to booking drawer.", "Responsive pass: stacked cards on phones, 3-column grid on desktop."],
  store: ["Architecture: retail catalog with categories and cart.", "Components: Navbar with cart badge, filter chips, product grid, cart drawer.", "Interaction: add/remove items, live subtotal.", "Payments: M-Pesa STK push checkout mock.", "Responsive pass: 2-column grid on phones."],
  portfolio: ["Architecture: personal brand site — projects, skills, contact.", "Components: Hero, project filter, project cards, Hire Me modal.", "Interaction: tag filters and contact form state.", "Payments: none needed — lead capture instead.", "Responsive pass: single column on phones."],
  clinic: ["Architecture: patient services and appointments.", "Components: Hero, service list, date picker, time slots, confirmation.", "Interaction: select service, day and slot; booking reference.", "Payments: optional M-Pesa consultation fee.", "Responsive pass: large tap targets for slots."],
  corporate: ["Architecture: B2B logistics company site.", "Components: Hero, services, rate calculator, quote CTA.", "Interaction: route + weight pricing with instant estimate.", "Payments: invoice request flow.", "Responsive pass: calculator stacks on phones."],
  custom: ["Architecture: general business site.", "Components: Hero, services, contact.", "Interaction: contact form state.", "Payments: M-Pesa ready.", "Responsive pass done."],
};
export const SUMMARY: Record<DemoCategory, string> = {
  tour: "**Savannah Mara Expeditions** — safari packages (Maasai Mara, Amboseli, Diani), itinerary tabs, KES/USD toggle and an M-Pesa deposit booking drawer.",
  store: "**Kiko Urban Apparel** — filterable product grid, working cart and M-Pesa STK push checkout.",
  portfolio: "**Brian Otieno — Full Stack & AI** — filterable projects, skills and a Hire Me contact modal.",
  clinic: "**Apex Family Wellness** — services list with date & time slot booking and confirmation.",
  corporate: "**SwiftFreight Kenya** — services and an instant cargo rate calculator from Nairobi.",
  custom: "**Your business site** — hero, services and a contact form.",
};

export function ThinkingBlock({ category }: { category: DemoCategory }) {
  const [open, setOpen] = useState(false);
  const steps = THINKING[category];
  return (
    <div className="mt-2 rounded-lg border border-border bg-muted/50">
      <button className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium" onClick={() => setOpen((o) => !o)} type="button">
        <Sparkles className="size-4 text-primary" /> Thinking Process ({steps.length} steps)
        <ChevronDown className={cn("ml-auto size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ol className="space-y-1.5 border-t border-border px-4 py-3 text-sm text-muted-foreground">
          {steps.map((s, i) => <li key={s}><span className="font-semibold text-foreground">Step {i + 1}.</span> {s}</li>)}
        </ol>
      )}
    </div>
  );
}

function Nav({ name, right }: { name: string; right?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
      <span className="font-bold">{name}<span className="text-primary">.</span></span>
      {right}
    </div>
  );
}

function MpesaPay({ amount, onDone }: { amount: number; onDone: () => void }) {
  const [phone, setPhone] = useState("07");
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor="mpesa-phone">M-Pesa phone number</label>
      <input className="h-11 w-full rounded-md border border-input bg-background px-3" id="mpesa-phone" onChange={(e) => setPhone(e.target.value)} value={phone} />
      <Button className="h-11 w-full" disabled={busy || phone.length < 10} onClick={() => { setBusy(true); toast.loading("STK push sent — enter your PIN", { id: "stk" }); setTimeout(() => { toast.success(`Payment of KES ${amount.toLocaleString()} verified`, { id: "stk" }); setBusy(false); onDone(); }, 1800); }}>
        {busy ? <Loader2 className="animate-spin" /> : null} Pay KES {amount.toLocaleString()}
      </Button>
    </div>
  );
}

function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex justify-end bg-overlay animate-in fade-in">
      <div className="h-full w-full max-w-sm overflow-y-auto bg-card p-5 shadow-xl animate-in slide-in-from-right">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold">{title}</h3><Button aria-label="Close" onClick={onClose} size="icon-sm" variant="ghost"><X /></Button></div>
        {children}
      </div>
    </div>
  );
}

const PACKAGES = [
  { name: "Maasai Mara", days: 3, kes: 45000, days_: ["Game drive & Big Five", "Maasai village visit", "Hot-air balloon sunrise"] },
  { name: "Amboseli", days: 2, kes: 32000, days_: ["Kilimanjaro views", "Elephant herds drive"] },
  { name: "Diani Beach", days: 4, kes: 38000, days_: ["Beach resort check-in", "Snorkel Kisite", "Dhow sunset cruise", "Colobus trail"] },
];
function TourSite() {
  const [usd, setUsd] = useState(false);
  const [tab, setTab] = useState(0);
  const [book, setBook] = useState<number | null>(null);
  const [guests, setGuests] = useState(2);
  const price = (k: number) => (usd ? `$${Math.round(k / 130).toLocaleString()}` : `KES ${k.toLocaleString()}`);
  const pkg = book !== null ? PACKAGES[book]! : null;
  return (
    <div className="relative">
      <Nav name="Savannah Mara" right={<div className="flex rounded-full bg-muted p-0.5 text-xs">{["KES", "USD"].map((c) => <button className={cn("rounded-full px-3 py-1", (c === "USD") === usd && "bg-background shadow-sm")} key={c} onClick={() => setUsd(c === "USD")} type="button">{c}</button>)}</div>} />
      <div className="bg-gradient-to-br from-primary/25 via-accent to-chart-4/30 px-6 py-14 text-center">
        <p className="text-sm font-semibold text-primary">Licensed Kenyan safari operator</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Wake up in the wild.</h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">Small-group safaris and coast escapes. Reserve with a 20% M-Pesa deposit.</p>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-3">
        {PACKAGES.map((p, i) => (
          <div className="rounded-xl border border-border bg-card p-4" key={p.name}>
            <img alt={p.name} className="h-28 w-full rounded-lg object-cover" loading="lazy" src={IMG.tour[i % 4]} />
            <h3 className="mt-3 font-semibold">{p.name}</h3>
            <p className="text-sm text-muted-foreground">{p.days} days · from {price(p.kes)}</p>
            <Button className="mt-3 h-10 w-full" onClick={() => setBook(i)}>Book Safari</Button>
          </div>
        ))}
      </div>
      <div className="px-5 pb-8">
        <h2 className="mb-2 font-semibold">Itineraries</h2>
        <div className="mb-3 flex gap-2">{PACKAGES.map((p, i) => <Button key={p.name} onClick={() => setTab(i)} size="sm" variant={tab === i ? "default" : "outline"}>{p.name}</Button>)}</div>
        <ol className="space-y-2">{PACKAGES[tab]!.days_.map((d, i) => <li className="rounded-lg bg-muted px-3 py-2 text-sm" key={d}><b>Day {i + 1}:</b> {d}</li>)}</ol>
      </div>
      {pkg && (
        <Drawer onClose={() => setBook(null)} title={`Book ${pkg.name}`}>
          <div className="mb-4 flex items-center justify-between"><span>Guests</span><div className="flex items-center gap-2"><Button onClick={() => setGuests((g) => Math.max(1, g - 1))} size="icon-sm" variant="outline">−</Button>{guests}<Button onClick={() => setGuests((g) => g + 1)} size="icon-sm" variant="outline">+</Button></div></div>
          <div className="mb-4 space-y-1 rounded-lg bg-muted p-3 text-sm"><div className="flex justify-between"><span>Total</span><b>KES {(pkg.kes * guests).toLocaleString()}</b></div><div className="flex justify-between"><span>20% deposit now</span><b className="text-primary">KES {(pkg.kes * guests * 0.2).toLocaleString()}</b></div></div>
          <MpesaPay amount={pkg.kes * guests * 0.2} onDone={() => setBook(null)} />
        </Drawer>
      )}
    </div>
  );
}

const PRODUCTS = [
  { n: "Kitenge Bomber", c: "Jackets", p: 3500 }, { n: "Urban Cargo Pants", c: "Bottoms", p: 2200 }, { n: "Nairobi Tee", c: "Tops", p: 1200 },
  { n: "Denim Jacket", c: "Jackets", p: 4200 }, { n: "Linen Shorts", c: "Bottoms", p: 1500 }, { n: "Ankara Shirt", c: "Tops", p: 2600 },
];
function StoreSite() {
  const [filter, setFilter] = useState("All");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((s, p) => s + (cart[p.n] ?? 0) * p.p, 0);
  return (
    <div className="relative min-h-full">
      <Nav name="Kiko Urban" right={<Button onClick={() => setOpen(true)} size="sm" variant="outline"><ShoppingCart /> {count}</Button>} />
      <div className="px-5 py-8"><h1 className="text-3xl font-bold">New drop: Nairobi Streets</h1><p className="text-muted-foreground">Free delivery in Nairobi over KES 3,000.</p></div>
      <div className="flex gap-2 px-5">{["All", "Tops", "Bottoms", "Jackets"].map((f) => <Button key={f} onClick={() => setFilter(f)} size="sm" variant={filter === f ? "default" : "outline"}>{f}</Button>)}</div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
        {PRODUCTS.filter((p) => filter === "All" || p.c === filter).map((p, i) => (
          <div className="rounded-xl border border-border bg-card p-3" key={p.n}>
            <img alt={p.n} className="aspect-square w-full rounded-lg object-cover" loading="lazy" src={IMG.store[i % 4]} />
            <p className="mt-2 text-sm font-medium">{p.n}</p><p className="text-sm text-muted-foreground">KES {p.p.toLocaleString()}</p>
            <Button className="mt-2 h-9 w-full" onClick={() => { setCart((c) => ({ ...c, [p.n]: (c[p.n] ?? 0) + 1 })); toast.success(`${p.n} added to cart`); }} size="sm">Add to Cart</Button>
          </div>
        ))}
      </div>
      {open && (
        <Drawer onClose={() => setOpen(false)} title="Your cart">
          {count === 0 ? <p className="text-muted-foreground">Cart is empty.</p> : (
            <>
              <ul className="mb-4 space-y-2">{PRODUCTS.filter((p) => cart[p.n]).map((p) => <li className="flex items-center justify-between text-sm" key={p.n}><span>{p.n} × {cart[p.n]}</span><button className="text-destructive" onClick={() => setCart((c) => { const n = { ...c }; delete n[p.n]; return n; })} type="button">Remove</button></li>)}</ul>
              <div className="mb-4 flex justify-between font-semibold"><span>Total</span><span>KES {total.toLocaleString()}</span></div>
              <MpesaPay amount={total} onDone={() => { setCart({}); setOpen(false); }} />
            </>
          )}
        </Drawer>
      )}
    </div>
  );
}

const PROJECTS = [
  { n: "M-Pesa Expense Tracker", t: "Web" }, { n: "Swahili Chatbot", t: "AI" }, { n: "Matatu Route Finder", t: "Mobile" }, { n: "Crop Disease Detector", t: "AI" }, { n: "Campus Events App", t: "Web" },
];
function PortfolioSite() {
  const [tag, setTag] = useState("All");
  const [hire, setHire] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <div className="relative min-h-full">
      <Nav name="Brian Otieno" right={<Button onClick={() => setHire(true)} size="sm">Hire Me</Button>} />
      <div className="px-6 py-12"><p className="text-sm font-semibold text-primary">Full Stack & AI Engineer · Nairobi</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">I build useful software for African users.</h1><div className="mt-4 flex flex-wrap gap-2">{["React", "Python", "TypeScript", "LLMs", "Supabase"].map((s) => <span className="rounded-full bg-secondary px-3 py-1 text-xs" key={s}>{s}</span>)}</div></div>
      <div className="flex gap-2 px-6">{["All", "Web", "AI", "Mobile"].map((f) => <Button key={f} onClick={() => setTag(f)} size="sm" variant={tag === f ? "default" : "outline"}>{f}</Button>)}</div>
      <div className="grid gap-3 p-6 sm:grid-cols-2">
        {PROJECTS.filter((p) => tag === "All" || p.t === tag).map((p) => (
          <button className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary" key={p.n} onClick={() => toast(`Opening live demo: ${p.n}`)} type="button">
            <img alt={p.n} className="h-24 w-full rounded-lg object-cover" loading="lazy" src={IMG.portfolio[PROJECTS.indexOf(p) % 4]} /><p className="mt-2 font-medium">{p.n}</p><p className="text-xs text-muted-foreground">{p.t} · View live demo →</p>
          </button>
        ))}
      </div>
      {hire && (
        <Drawer onClose={() => { setHire(false); setSent(false); }} title="Work with Brian">
          {sent ? <p className="flex items-center gap-2 text-primary"><Check /> Message sent! Brian replies within 24h.</p> : (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Message sent"); }}>
              <input className="h-11 w-full rounded-md border border-input bg-background px-3" placeholder="Your name" required />
              <input className="h-11 w-full rounded-md border border-input bg-background px-3" placeholder="Email" required type="email" />
              <textarea className="min-h-24 w-full rounded-md border border-input bg-background p-3" placeholder="Tell me about the project" />
              <Button className="h-11 w-full" type="submit">Send message</Button>
            </form>
          )}
        </Drawer>
      )}
    </div>
  );
}

function ClinicSite() {
  const services = ["Dental cleaning", "General checkup", "Physiotherapy", "Teeth whitening"];
  const days = ["Mon 6", "Tue 7", "Wed 8", "Thu 9", "Fri 10"];
  const slots = ["9:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
  const [svc, setSvc] = useState(services[0]!);
  const [day, setDay] = useState(days[0]!);
  const [slot, setSlot] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  return (
    <div className="min-h-full">
      <Nav name="Apex Wellness" right={<span className="text-sm text-muted-foreground">Westlands, Nairobi</span>} />
      <div className="bg-gradient-to-br from-chart-2/20 to-secondary px-6 py-12"><h1 className="text-3xl font-bold">Family care, booked in 30 seconds.</h1><p className="text-muted-foreground">Pick a service, a day and a time.</p></div>
      {ref ? (
        <div className="m-6 rounded-xl border border-border bg-card p-6 text-center"><Check className="mx-auto size-10 text-primary" /><h2 className="mt-2 text-xl font-semibold">Appointment confirmed</h2><p className="text-muted-foreground">{svc} · {day} at {slot}</p><p className="mt-2 font-mono text-sm">Ref {ref}</p><Button className="mt-4" onClick={() => { setRef(null); setSlot(null); }} variant="outline">Book another</Button></div>
      ) : (
        <div className="space-y-5 p-6">
          <div><h2 className="mb-2 font-semibold">1. Service</h2><div className="grid gap-2 sm:grid-cols-2">{services.map((s) => <Button className="h-11 justify-start" key={s} onClick={() => setSvc(s)} variant={svc === s ? "default" : "outline"}>{s}</Button>)}</div></div>
          <div><h2 className="mb-2 font-semibold">2. Day</h2><div className="flex flex-wrap gap-2">{days.map((d) => <Button className="h-11" key={d} onClick={() => setDay(d)} variant={day === d ? "default" : "outline"}>{d}</Button>)}</div></div>
          <div><h2 className="mb-2 font-semibold">3. Time</h2><div className="grid grid-cols-3 gap-2">{slots.map((s, i) => <Button className="h-11" disabled={i === 2} key={s} onClick={() => setSlot(s)} variant={slot === s ? "default" : "outline"}>{s}</Button>)}</div></div>
          <Button className="h-12 w-full" disabled={!slot} onClick={() => { setRef(`APX-${Math.floor(1000 + Math.random() * 9000)}`); toast.success("Booking confirmed — SMS reminder scheduled"); }}>Confirm booking</Button>
        </div>
      )}
    </div>
  );
}

const ROUTES: Record<string, number> = { Mombasa: 120, Kisumu: 95, Nakuru: 45, Eldoret: 80 };
function CorporateSite() {
  const [to, setTo] = useState("Mombasa");
  const [kg, setKg] = useState(500);
  const [express, setExpress] = useState(false);
  const cost = Math.round((ROUTES[to]! * kg) / 10 + 2500) * (express ? 1.4 : 1);
  return (
    <div className="min-h-full">
      <Nav name="SwiftFreight" right={<Button onClick={() => toast.success("Quote request sent — sales will call you")} size="sm">Get a quote</Button>} />
      <div className="bg-gradient-to-br from-foreground/10 to-primary/20 px-6 py-12"><h1 className="text-3xl font-bold">Cargo across Kenya, on time.</h1><p className="text-muted-foreground">Road freight from Nairobi with live tracking.</p></div>
      <div className="grid gap-3 p-6 sm:grid-cols-3">{["Road freight", "Warehousing", "Last-mile delivery"].map((s) => <div className="rounded-xl border border-border bg-card p-4 font-medium" key={s}>{s}</div>)}</div>
      <div className="mx-6 mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 font-semibold">Rate calculator</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">From<input className="mt-1 h-11 w-full rounded-md border border-input bg-muted px-3" disabled value="Nairobi" /></label>
          <label className="text-sm">To<select className="mt-1 h-11 w-full rounded-md border border-input bg-background px-3" onChange={(e) => setTo(e.target.value)} value={to}>{Object.keys(ROUTES).map((r) => <option key={r}>{r}</option>)}</select></label>
          <label className="text-sm sm:col-span-2">Weight: {kg} kg<input className="mt-1 w-full accent-primary" max={5000} min={50} onChange={(e) => setKg(Number(e.target.value))} step={50} type="range" value={kg} /></label>
          <label className="flex items-center gap-2 text-sm"><input checked={express} onChange={(e) => setExpress(e.target.checked)} type="checkbox" /> Express (next day)</label>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary p-4"><span>Estimated cost</span><b className="text-2xl text-primary">KES {cost.toLocaleString()}</b></div>
      </div>
    </div>
  );
}

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;
export const IMG: Record<Exclude<DemoCategory, "custom">, string[]> = {
  tour: [u("photo-1516426122078-c23e76319801"), u("photo-1547471080-7cc2caa01a7e"), u("photo-1489392191049-fc10c97e64b6"), u("photo-1523805009345-7448845a9e53")],
  store: [u("photo-1445205170230-053b83016050"), u("photo-1490481651871-ab68de25d43d"), u("photo-1441986300917-64674bd600d8"), u("photo-1483985988355-763728e1935b")],
  clinic: [u("photo-1519494026892-80bbd2d6fd0d"), u("photo-1576091160399-112ba8d25d1d"), u("photo-1586773860418-d37222d8fce3"), u("photo-1631217868264-e5b90bb7e133")],
  corporate: [u("photo-1586528116311-ad8dd3c8310d"), u("photo-1601584115197-04ecc0da31d7"), u("photo-1494412574643-ff11b0a5c1c3"), u("photo-1553413077-190dd305871c")],
  portfolio: [u("photo-1517694712202-14dd9538aa97"), u("photo-1498050108023-c5249f4df085"), u("photo-1555066931-4365d14bab8c"), u("photo-1461749280684-dccba630e2f6")],
};

export const CONNECTORS = [
  { id: "mpesa", name: "M-Pesa Daraja STK Push", chip: "🟢 M-Pesa STK", field: "Paybill / Till number" },
  { id: "whatsapp", name: "WhatsApp Cloud Ordering", chip: "💬 WhatsApp Orders", field: "WhatsApp business number" },
  { id: "pesapal", name: "Pesapal Checkout", chip: "💳 Pesapal", field: "Consumer key" },
  { id: "etims", name: "KRA eTIMS Invoicing", chip: "🧾 eTIMS", field: "KRA PIN" },
  { id: "sendy", name: "Sendy Courier Dispatch", chip: "🚚 Sendy Courier", field: "API key" },
] as const;

const INFO: Record<Exclude<DemoCategory, "custom">, { brand: string; hero: string; sub: string; svcTab: string; bookTab: string; services: [string, string][]; about: string }> = {
  tour: { brand: "Savannah Mara Expeditions", hero: "Wake up in the wild.", sub: "Small-group safaris across Kenya, from the Mara to the coast.", svcTab: "Packages", bookTab: "Book", services: [["Game drives", "4x4 cruisers with pop-up roofs and expert guides."], ["Hot-air balloons", "Sunrise flights over the Maasai Mara."], ["Tented camps", "Luxury canvas camps by the river."], ["Coast escapes", "Diani beach add-ons after safari."]], about: "Founded in Narok by local guides with 15 years in the bush. KATO-licensed, eco-certified and proudly Kenyan." },
  store: { brand: "Kiko Urban Apparel", hero: "Nairobi streetwear, made local.", sub: "Kitenge, kikoy and modern fits — delivered same day in Nairobi.", svcTab: "Catalog", bookTab: "Order", services: [["Kitenge collection", "Bold African prints for every day."], ["Kikoy essentials", "Light coastal fabrics for warm days."], ["Studio basics", "Minimal tees, cargos and denim."], ["Custom tailoring", "Made-to-measure in 5 days."]], about: "Started in a Gikomba stall, now a studio in Westlands. Every piece is cut and sewn by Kenyan tailors." },
  clinic: { brand: "Apex Family Wellness", hero: "Family care, booked in 30 seconds.", sub: "Doctors, dentists and physios in Westlands — NHIF & insurance accepted.", svcTab: "Services", bookTab: "Book", services: [["Consultations", "General doctors, same-day slots."], ["Pharmacy", "In-house pharmacy, open late."], ["Dental care", "Cleaning, fillings and whitening."], ["Physiotherapy", "Sports and recovery sessions."]], about: "A family clinic serving Nairobi since 2012, with 12 specialists and modern, clean consultation rooms." },
  corporate: { brand: "SwiftFreight Kenya", hero: "Cargo across Kenya, on time.", sub: "Road freight, warehousing and last-mile delivery from Nairobi.", svcTab: "Services", bookTab: "Get quote", services: [["Road freight", "Daily trucks to Mombasa, Kisumu and Eldoret."], ["Warehousing", "Secure storage in Industrial Area."], ["Fleet tracking", "Live GPS updates on every load."], ["Last-mile", "Vans for city deliveries."]], about: "120 trucks, 40 vans and a 24/7 control room. Trusted by 300+ Kenyan businesses." },
  portfolio: { brand: "Brian Otieno", hero: "I build useful software for African users.", sub: "Full Stack & AI Engineer based in Nairobi.", svcTab: "Projects", bookTab: "Hire me", services: [["Web apps", "React, TypeScript and Supabase."], ["AI tools", "Chatbots and LLM features."], ["Mobile UI", "Clean, fast mobile designs."], ["Open source", "300+ GitHub contributions this year."]], about: "Computer Science student at JKUAT. I love turning local problems into simple apps people actually use." },
};

export function DemoSite({ category, connectors = [] }: { category: DemoCategory; connectors?: string[] }) {
  const cat = category === "custom" ? "store" : category;
  const Site = { tour: TourSite, store: StoreSite, portfolio: PortfolioSite, clinic: ClinicSite, corporate: CorporateSite }[cat];
  const info = INFO[cat];
  const img = IMG[cat];
  const [page, setPage] = useState("Home");
  const tabs = ["Home", info.svcTab, "About Us", info.bookTab, "Contact"];
  const active = CONNECTORS.filter((c) => connectors.includes(c.id));
  return (
    <div className="relative h-full overflow-y-auto bg-background animate-in fade-in duration-700">
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2">
        {tabs.map((t) => <button className={cn("h-9 shrink-0 rounded-full px-3 text-sm", page === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")} key={t} onClick={() => setPage(t)} type="button">{t}</button>)}
      </div>
      {active.length > 0 && <div className="flex flex-wrap gap-2 bg-accent px-4 py-2 text-xs font-medium">{active.map((c) => <span className="rounded-full bg-background px-2 py-1" key={c.id}>{c.chip} active</span>)}</div>}
      {page === "Home" && (
        <div>
          <div className="relative h-72 sm:h-80">
            <img alt={info.brand} className="absolute inset-0 size-full object-cover" src={img[0]} />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
            <div className="absolute bottom-0 p-6 text-background">
              <p className="text-sm font-semibold">{info.brand}</p>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{info.hero}</h1>
              <p className="mt-1 max-w-md text-sm opacity-90">{info.sub}</p>
              <Button className="mt-4 h-11" onClick={() => setPage(info.bookTab)}>{info.bookTab} now</Button>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3">{img.slice(1).map((s, i) => <div className="overflow-hidden rounded-xl border border-border bg-card" key={s}><img alt={info.services[i]![0]} className="h-28 w-full object-cover" loading="lazy" src={s} /><p className="p-3 text-sm font-medium">{info.services[i]![0]}</p></div>)}</div>
        </div>
      )}
      {page === info.svcTab && (
        <div className="grid gap-4 p-5 sm:grid-cols-2">{info.services.map(([t, d], i) => <div className="overflow-hidden rounded-xl border border-border bg-card" key={t}><img alt={t} className="h-36 w-full object-cover" loading="lazy" src={img[i % 4]} /><div className="p-4"><h3 className="font-semibold">{t}</h3><p className="text-sm text-muted-foreground">{d}</p><Button className="mt-3 h-10" onClick={() => setPage(info.bookTab)} size="sm" variant="outline">Choose</Button></div></div>)}</div>
      )}
      {page === "About Us" && (
        <div className="grid gap-5 p-6 sm:grid-cols-2"><img alt="About" className="h-64 w-full rounded-xl object-cover" src={img[2]} /><div><h2 className="text-2xl font-bold">About {info.brand}</h2><p className="mt-3 text-muted-foreground">{info.about}</p><div className="mt-5 grid grid-cols-3 gap-2 text-center">{[["4.9★", "Rating"], ["2k+", "Customers"], ["24/7", "Support"]].map(([a, b]) => <div className="rounded-lg bg-muted p-3" key={b}><b>{a}</b><p className="text-xs text-muted-foreground">{b}</p></div>)}</div></div></div>
      )}
      {page === info.bookTab && <Site />}
      {page === "Contact" && (
        <form className="mx-auto max-w-md space-y-3 p-6" onSubmit={(e) => { e.preventDefault(); toast.success("Message sent — we'll reply on WhatsApp"); }}>
          <h2 className="text-2xl font-bold">Talk to us</h2>
          <p className="text-sm text-muted-foreground">Nairobi, Kenya · +254 700 000 000</p>
          <input className="h-11 w-full rounded-md border border-input bg-background px-3" placeholder="Your name" required />
          <input className="h-11 w-full rounded-md border border-input bg-background px-3" placeholder="Phone or email" required />
          <textarea className="min-h-24 w-full rounded-md border border-input bg-background p-3" placeholder="How can we help?" />
          <Button className="h-11 w-full" type="submit">Send message</Button>
          {connectors.includes("whatsapp") && <Button className="h-11 w-full" onClick={() => toast("Opening WhatsApp chat…")} type="button" variant="outline">💬 Order on WhatsApp</Button>}
        </form>
      )}
    </div>
  );
}
