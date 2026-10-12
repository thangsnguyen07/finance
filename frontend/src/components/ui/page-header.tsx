'use client';

function PageHeaderRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
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
      <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-xs text-muted">{description}</p>
      ) : null}
    </div>
  );
}

function PageHeaderActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 self-start sm:self-auto">
      {children}
    </div>
  );
}

export const PageHeader = {
  Root: PageHeaderRoot,
  Content: PageHeaderContent,
  Actions: PageHeaderActions,
};
