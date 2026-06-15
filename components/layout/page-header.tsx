interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-wide leading-none text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5 font-medium tracking-wide uppercase">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
