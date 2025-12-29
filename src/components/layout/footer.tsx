export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Actual.ly — Verified humans, real posts.</span>
        <span>© {new Date().getFullYear()} Actual.ly</span>
      </div>
    </footer>
  );
}
