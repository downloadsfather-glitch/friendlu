import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InviteDialog, PageFrame, inputCls } from "@/components/app-extras";

const meta = { t: "Workspace Settings — Friendlu AI", d: "Manage your workspace, team members, billing and private keys." };
export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: meta.t }, { name: "description", content: meta.d }, { property: "og:title", content: meta.t }, { property: "og:description", content: meta.d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [members, setMembers] = useState([["Dfather", "Admin"], ["Wanjiru K.", "Member"], ["Otieno J.", "Viewer"]]);
  const [keys, setKeys] = useState(["FRIENDLU_API_KEY", "MPESA_PASSKEY"]);
  const [invite, setInvite] = useState(false);
  return (
    <PageFrame subtitle="Dfather's Workspace" title="Settings">
      <Tabs defaultValue="general">
        <TabsList className="no-scrollbar h-auto w-full justify-start overflow-x-auto">
          {[["general", "General"], ["team", "Team & Members"], ["billing", "Billing"], ["keys", "API Keys & Secrets"]].map(([v, l]) => <TabsTrigger key={v} value={v!}>{l}</TabsTrigger>)}
        </TabsList>
        <div className="max-w-2xl pt-4">
          <TabsContent className="space-y-3" value="general">
            <label className="block text-sm">Workspace name<input className={inputCls} defaultValue="Dfather's Workspace" /></label>
            <label className="block text-sm">Web address<input className={inputCls} defaultValue="dfather" /></label>
            <label className="block text-sm">Default currency<select className={inputCls}><option>KES</option><option>USD</option></select></label>
            <Button className="h-11" onClick={() => toast.success("Settings saved")}>Save</Button>
          </TabsContent>
          <TabsContent value="team">
            <Button className="mb-3 h-11" onClick={() => setInvite(true)}>Invite members</Button>
            {members.map(([n, r], i) => (
              <div className="flex items-center gap-3 border-b border-border py-3" key={n}>
                <span className="grid size-9 place-items-center rounded-full bg-secondary text-sm font-semibold">{n![0]}</span><span className="flex-1">{n}</span>
                <select className="h-10 rounded-lg border border-input bg-background px-2 text-sm" onChange={(e) => setMembers((m) => m.map((x, j) => (j === i ? [x[0]!, e.target.value] : x)))} value={r}><option>Admin</option><option>Member</option><option>Viewer</option></select>
              </div>
            ))}
          </TabsContent>
          <TabsContent className="space-y-4" value="billing">
            <div className="rounded-2xl border border-border bg-card p-4"><p className="font-semibold">Free Starter</p><p className="mb-2 text-sm text-muted-foreground">18 of 30 credits left this month</p><Progress value={60} /><Button className="mt-3 h-11" onClick={() => (window.location.href = "/pricing")}>Upgrade plan</Button></div>
            {["Sep 2026 · KES 1,200", "Aug 2026 · KES 650"].map((r) => <div className="flex items-center justify-between border-b border-border py-2 text-sm" key={r}>{r}<Button onClick={() => toast.success("Receipt downloaded")} size="sm" variant="ghost">Download</Button></div>)}
          </TabsContent>
          <TabsContent value="keys">
            {keys.map((k) => <div className="flex items-center gap-2 border-b border-border py-3 text-sm" key={k}><span className="flex-1 font-medium">{k}</span><span className="text-muted-foreground">••••••••3f2a</span><Button onClick={() => setKeys((s) => s.filter((x) => x !== k))} size="sm" variant="ghost">Revoke</Button></div>)}
            <Button className="mt-3 h-11" onClick={() => setKeys((s) => [...s, `NEW_KEY_${s.length + 1}`])} variant="outline">Create key</Button>
          </TabsContent>
        </div>
      </Tabs>
      <InviteDialog onOpenChange={setInvite} open={invite} />
    </PageFrame>
  );
}
