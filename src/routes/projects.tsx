import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LayoutGrid, List, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PageFrame, go, inputCls } from "@/components/app-extras";
import { cn } from "@/lib/utils";

const meta = { t: "Projects — Friendlu AI", d: "All your Friendlu apps in one place: open, rename, duplicate or delete." };
export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: meta.t }, { name: "description", content: meta.d }, { property: "og:title", content: meta.t }, { property: "og:description", content: meta.d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Projects,
});

type P = { id: string; name: string; status: "Live" | "Draft" | "Archived"; edited: string };
const seed: P[] = [
  { id: "nairobi-electronics", name: "Nairobi Electronics Shop", status: "Live", edited: "2 min ago" },
  { id: "kilimani-salon", name: "Kilimani Salon Booking", status: "Draft", edited: "Yesterday" },
  { id: "chama-ledger", name: "Chama Savings Ledger", status: "Live", edited: "3 days ago" },
  { id: "apex-saas", name: "Apex Cloud SaaS", status: "Draft", edited: "Last week" },
  { id: "ruaka-grocery", name: "Ruaka Fresh Grocery", status: "Archived", edited: "Last month" },
];

function Projects() {
  const [items, setItems] = useState(seed);
  const [grid, setGrid] = useState(true);
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const [del, setDel] = useState<P | null>(null);
  const shown = items.filter((p) => (tab === "All" || p.status === tab) && p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <PageFrame action={<Button className="h-11" onClick={() => go("/dashboard")}><Plus /> New project</Button>} subtitle="Open, rename or tidy up your apps." title="Projects">
      <div className="mb-4 flex flex-wrap gap-2">
        <input className={cn(inputCls, "min-w-48 flex-1")} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" value={q} />
        {["All", "Live", "Draft", "Archived"].map((t) => <Button className="h-11" key={t} onClick={() => setTab(t)} variant={tab === t ? "secondary" : "ghost"}>{t}</Button>)}
        <Button aria-label="Toggle grid or list" className="size-11" onClick={() => setGrid(!grid)} size="icon" variant="outline">{grid ? <List /> : <LayoutGrid />}</Button>
      </div>
      <div className={grid ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-2"}>
        {shown.map((p) => (
          <div className={cn("flex rounded-2xl border border-border bg-card p-3", grid ? "flex-col" : "items-center gap-3")} key={p.id}>
            {grid && <button className="mb-3 h-28 rounded-xl bg-secondary" onClick={() => go(`/chat/${p.id}`)} type="button" aria-label={`Open ${p.name}`} />}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <button className="min-w-0 flex-1 text-left" onClick={() => go(`/chat/${p.id}`)} type="button"><p className="truncate font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.status} · edited {p.edited}</p></button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button aria-label="Project actions" size="icon" variant="ghost"><MoreVertical /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => go(`/chat/${p.id}`)}>Open</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => { const n = window.prompt("New project name", p.name)?.trim(); if (n) setItems((s) => s.map((x) => (x.id === p.id ? { ...x, name: n } : x))); }}>Rename project</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => { setItems((s) => [{ ...p, id: p.id + Date.now(), name: `${p.name} (copy)`, status: "Draft", edited: "Just now" }, ...s]); toast.success("Project duplicated"); }}>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onSelect={() => setDel(p)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        {!shown.length && <p className="text-muted-foreground">No projects here yet.</p>}
      </div>
      <AlertDialog onOpenChange={(o) => !o && setDel(null)} open={!!del}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete {del?.name}?</AlertDialogTitle><AlertDialogDescription>This removes the app and its preview link.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { setItems((s) => s.filter((x) => x.id !== del?.id)); toast("Project deleted"); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageFrame>
  );
}
