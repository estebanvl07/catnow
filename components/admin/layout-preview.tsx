import type { LayoutTemplate } from "@/lib/types"

export function LayoutPreview({ layout }: { layout: LayoutTemplate }) {
  if (layout === "classic") {
    return (
      <div className="flex h-32 w-full flex-col rounded-lg border border-border bg-background p-2">
        {/* Header */}
        <div className="mb-1.5 h-3 w-full rounded bg-muted" />
        {/* Sidebar + Grid */}
        <div className="flex flex-1 gap-1.5">
          <div className="w-6 rounded bg-muted" />
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-1">
              <div className="aspect-square rounded bg-primary/20" />
              <div className="aspect-square rounded bg-primary/20" />
              <div className="aspect-square rounded bg-primary/20" />
              <div className="aspect-square rounded bg-primary/20" />
              <div className="aspect-square rounded bg-primary/20" />
              <div className="aspect-square rounded bg-primary/20" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (layout === "modern") {
    return (
      <div className="flex h-32 w-full flex-col rounded-lg border border-border bg-background p-2">
        {/* Header */}
        <div className="mb-1.5 flex items-center justify-between">
          <div className="h-3 w-12 rounded bg-primary/30" />
          <div className="h-3 w-8 rounded bg-muted" />
        </div>
        {/* Hero */}
        <div className="mb-1.5 h-6 rounded bg-primary/10" />
        {/* Grid */}
        <div className="grid flex-1 grid-cols-2 gap-1">
          <div className="rounded bg-primary/20" />
          <div className="rounded bg-primary/20" />
          <div className="rounded bg-primary/20" />
          <div className="rounded bg-primary/20" />
        </div>
      </div>
    )
  }

  if (layout === "minimal") {
    return (
      <div className="flex h-32 w-full flex-col rounded-lg border border-border bg-background p-2">
        <div className="mb-1.5 flex justify-center">
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 shrink-0 rounded bg-primary/20" />
            <div className="h-2 flex-1 rounded bg-muted" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 shrink-0 rounded bg-primary/20" />
            <div className="h-2 flex-1 rounded bg-muted" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 shrink-0 rounded bg-primary/20" />
            <div className="h-2 flex-1 rounded bg-muted" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 shrink-0 rounded bg-primary/20" />
            <div className="h-2 flex-1 rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (layout === "cards") {
    return (
      <div className="flex h-32 w-full flex-col rounded-lg border border-border bg-background p-2">
        <div className="mb-1.5 h-3 w-full rounded bg-muted" />
        <div className="flex flex-1 gap-1.5">
          <div className="flex-1 rounded-lg border border-border bg-card">
            <div className="h-8 rounded-t-lg bg-primary/15" />
            <div className="flex items-center justify-between p-1">
              <div className="h-2 w-8 rounded bg-muted" />
              <div className="h-2 w-6 rounded bg-primary/30" />
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card">
            <div className="h-8 rounded-t-lg bg-primary/15" />
            <div className="flex items-center justify-between p-1">
              <div className="h-2 w-8 rounded bg-muted" />
              <div className="h-2 w-6 rounded bg-primary/30" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Compact
  return (
    <div className="flex h-32 w-full flex-col rounded-lg border border-border bg-background p-2">
      <div className="mb-1.5 h-3 w-20 rounded bg-muted" />
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1 rounded border border-border bg-card p-0.5">
          <div className="h-5 w-5 shrink-0 rounded bg-primary/20" />
          <div className="h-1.5 flex-1 rounded bg-muted" />
          <div className="h-1.5 w-4 rounded bg-primary/20" />
        </div>
        <div className="flex items-center gap-1 rounded border border-border bg-card p-0.5">
          <div className="h-5 w-5 shrink-0 rounded bg-primary/20" />
          <div className="h-1.5 flex-1 rounded bg-muted" />
          <div className="h-1.5 w-4 rounded bg-primary/20" />
        </div>
        <div className="flex items-center gap-1 rounded border border-border bg-card p-0.5">
          <div className="h-5 w-5 shrink-0 rounded bg-primary/20" />
          <div className="h-1.5 flex-1 rounded bg-muted" />
          <div className="h-1.5 w-4 rounded bg-primary/20" />
        </div>
      </div>
    </div>
  )
}
