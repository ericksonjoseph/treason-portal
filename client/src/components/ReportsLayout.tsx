import { ReactNode } from 'react';

interface ReportsLayoutProps {
  title: string;
  description: string;
  actions?: ReactNode;
  kpiCards?: ReactNode;
  children: ReactNode;
}

export function ReportsLayout({
  title,
  description,
  actions,
  kpiCards,
  children,
}: ReportsLayoutProps) {
  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
              {title}
            </h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {kpiCards && <div>{kpiCards}</div>}

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
