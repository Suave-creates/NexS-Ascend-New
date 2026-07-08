export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-2.5">
        <span className="h-5 w-1.5 rounded-full bg-brand-700" aria-hidden="true" />
        <h1 className="text-lg font-semibold tracking-tight text-brand-700">NexS Ascend</h1>
      </div>
      <span className="text-xs font-medium text-gray-400">Crafted by: K_ARYA</span>
    </header>
  );
}
