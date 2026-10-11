'use client';

function PageHeaderRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
      {children}
    </div>
  );
}

function PageHeaderContent({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h1 className="font-serif font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
        {title}
      </h1>
      {description ? (
        <p className="text-xs text-muted mt-1">{description}</p>
      ) : null}
    </div>
  );
}

function PageHeaderActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
      {children}
    </div>
  );
}

export const PageHeader = {
  Root: PageHeaderRoot,
  Content: PageHeaderContent,
  Actions: PageHeaderActions,
};
