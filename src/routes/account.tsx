import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageFrame, inputCls } from "@/components/app-extras";

const meta = { t: "Your Account — Friendlu AI", d: "Update your profile, phone login, notifications and signed-in devices." };
export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: meta.t }, { name: "description", content: meta.d }, { property: "og:title", content: meta.t }, { property: "og:description", content: meta.d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Account,
});

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="space-y-3 rounded-2xl border border-border bg-card p-5"><h2 className="font-semibold">{title}</h2>{children}</section>;

function Account() {
  return (
    <PageFrame subtitle="Your personal details and security." title="Account">
      <div className="grid max-w-3xl gap-4">
        <Button className="h-11 w-fit" onClick={() => { window.location.href = "/"; }} variant="outline">← Back to home</Button>
        <Card title="Profile">
          <div className="flex items-center gap-3"><span className="grid size-14 place-items-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">D</span><Button variant="outline">Change photo</Button></div>
          <input aria-label="Name" className={inputCls} defaultValue="Dfather" />
          <input aria-label="Email" className={inputCls} defaultValue="dfather@example.com" />
        </Card>
        <Card title="Phone login (extra security)">
          <p className="text-sm text-muted-foreground">We'll send a code to this M-Pesa number when you sign in on a new device.</p>
          <input aria-label="Phone" className={inputCls} defaultValue="+254 712 345 678" />
          <div className="flex items-center justify-between text-sm">Send codes on WhatsApp instead of SMS<Switch defaultChecked /></div>
        </Card>
        <Card title="Notifications">
          {["Instant WhatsApp order alerts", "Weekly email summary", "Tips for growing my business"].map((n, i) => <div className="flex items-center justify-between text-sm" key={n}>{n}<Switch defaultChecked={i < 2} /></div>)}
        </Card>
        <Card title="Signed-in devices">
          {["Chrome on Windows · Nairobi · now", "Safari on iPhone · Mombasa · 2 days ago"].map((s, i) => <div className="flex items-center justify-between text-sm" key={s}>{s}{i > 0 && <Button onClick={() => toast("Device signed out")} size="sm" variant="ghost">Sign out</Button>}</div>)}
        </Card>
        <Button className="h-11 w-fit" onClick={() => toast.success("Account saved")}>Save changes</Button>
        <Card title="Session">
          <p className="text-sm text-muted-foreground">Sign out of Friendlu on this device.</p>
          <Button className="h-11 w-fit" onClick={() => { toast("Signed out"); setTimeout(() => { window.location.href = "/?signin=1"; }, 600); }} variant="destructive">Sign out</Button>
        </Card>
      </div>
    </PageFrame>
  );
}
