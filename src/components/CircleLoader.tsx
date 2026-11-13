const CircleLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-card px-6">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-muted" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin-loader" />
    </div>
    <p className="mt-5 text-sm text-muted-foreground font-medium tracking-tight">{message}</p>
  </div>
);

export default CircleLoader;
