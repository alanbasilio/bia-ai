interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5 sm:mb-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-wide leading-none text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 font-medium tracking-wide uppercase">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
