export type MemoryItem = { label: string; value: string };

const KEY = "friendlu-ai-memory";

export function readMemory(): MemoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as MemoryItem[]) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.label && item?.value) : [];
  } catch {
    return [];
  }
}

export function saveMemoryItems(items: MemoryItem[]): MemoryItem[] {
  if (typeof window === "undefined") return [];
  const merged = [...readMemory()];
  for (const item of items) {
    const index = merged.findIndex(
      (existing) => existing.label.toLowerCase() === item.label.toLowerCase(),
    );
    if (index >= 0) merged[index] = item;
    else merged.push(item);
  }
  const trimmed = merged.slice(-40);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    /* ignore quota errors */
  }
  return trimmed;
}

export function clearMemory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
