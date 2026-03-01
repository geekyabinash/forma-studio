export default function Loading() {
  return (
    <div className="min-h-screen bg-light-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-coral/30 border-t-coral rounded-full animate-spin" />
        <span className="font-sans font-light text-sm text-mid-gray tracking-wider">
          Loading...
        </span>
      </div>
    </div>
  );
}
