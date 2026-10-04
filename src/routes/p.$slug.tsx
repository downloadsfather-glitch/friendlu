import { createFileRoute } from "@tanstack/react-router";
import { DemoSite, type DemoCategory } from "@/components/demo-sites";

const CATS: DemoCategory[] = ["tour", "portfolio", "corporate", "clinic", "store", "custom"];

export const Route = createFileRoute("/p/$slug")({
  head: () => ({
    meta: [
      { title: "Live project — Built with Friendlu AI" },
      { name: "description", content: "A business website built with Friendlu AI." },
      { property: "og:title", content: "Live project — Built with Friendlu AI" },
      { property: "og:description", content: "A business website built with Friendlu AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const cat = (CATS.includes(slug as DemoCategory) ? slug : "store") as DemoCategory;
  return (
    <div className="preview-light min-h-dvh">
      <div className="h-dvh"><DemoSite category={cat} /></div>
      <a className="btn-glow fixed bottom-4 right-4 z-50 rounded-full px-4 py-2 text-xs font-semibold" href="/">Built with Friendlu</a>
    </div>
  );
}
