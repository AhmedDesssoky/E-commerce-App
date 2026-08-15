export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <main className="flex max-w-xl flex-col gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Editorial Souk
        </h1>
        <p className="text-mute text-lg leading-relaxed">
          Next.js App Router is ready. Edit{" "}
          <code className="rounded-sm bg-bone px-1.5 py-0.5 font-mono text-sm text-ink">
            src/app/page.tsx
          </code>{" "}
          to get started.
        </p>
      </main>
    </div>
  );
}
