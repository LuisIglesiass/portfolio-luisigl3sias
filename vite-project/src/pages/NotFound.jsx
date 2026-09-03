export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 text-center">
      <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground mb-4">
        404 — NOT FOUND
      </span>
      <h1 className="font-display text-6xl sm:text-8xl mb-6 text-primary">
        Lost page
      </h1>
      <a href="/" className="btn-solid">
        Back to home
      </a>
    </div>
  );
};
