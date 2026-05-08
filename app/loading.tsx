export default function Loading() {
  return (
    <main className="container py-16">
      <div className="animate-pulse space-y-3">
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
      </div>
    </main>
  );
}

