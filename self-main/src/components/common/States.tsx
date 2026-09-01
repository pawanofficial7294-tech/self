import React from 'react';
import { AlertTriangle, FolderOpen, ChevronRight, Home } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Card } from './Card';

// 1. LoadingSpinner Component
export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Loading details, please wait...'
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center gap-3">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gov-navy/20 border-t-gov-navy" />
    <p className="text-sm text-gov-muted font-medium animate-pulse">{message}</p>
  </div>
);

// 2. Skeleton Loader Component
export const SkeletonLoader: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="w-full space-y-3 p-4 animate-pulse">
    <div className="h-5 bg-gov-border rounded w-1/4 mb-5" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gov-border rounded w-full" />
        <div className="h-3 bg-gov-border rounded w-5/6" />
      </div>
    ))}
  </div>
);

// 3. EmptyState Component
export const EmptyState: React.FC<{ title?: string; message?: string }> = ({
  title = 'No records available',
  message = 'There is currently no information to show in this view.'
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gov-border rounded-lg bg-gov-bg-alt gap-3">
    <FolderOpen className="h-10 w-10 text-gov-muted" />
    <h3 className="text-sm font-semibold text-gov-charcoal">{title}</h3>
    <p className="text-xs text-gov-muted max-w-sm">{message}</p>
  </div>
);

// 4. ErrorState Component
export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Something went wrong',
  message = 'Unable to load the requested information. Please try again.',
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center border border-red-100 rounded-lg bg-red-50/20 gap-3">
    <AlertTriangle className="h-10 w-10 text-gov-error" />
    <h3 className="text-sm font-semibold text-gov-error">{title}</h3>
    <p className="text-xs text-gov-muted max-w-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 text-xs font-semibold text-gov-navy underline hover:text-gov-navy-hover"
      >
        Try Again
      </button>
    )}
  </div>
);

// 5. SectionHeader Component
export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  badge?: string;
}> = ({ title, subtitle, align = 'left', badge }) => (
  <div className={`flex flex-col gap-1.5 mb-8 ${align === 'center' ? 'items-center text-center' : ''}`}>
    {badge && (
      <span className="text-[11px] font-bold tracking-wider uppercase text-gov-saffron bg-gov-saffron-light px-2.5 py-1 rounded-full border border-gov-saffron/20 self-start">
        {badge}
      </span>
    )}
    <h2 className="text-xl md:text-2xl font-bold text-gov-charcoal border-l-4 border-gov-saffron pl-3">
      {title}
    </h2>
    {subtitle && <p className="text-sm text-gov-muted max-w-2xl">{subtitle}</p>}
  </div>
);

// 6. StatCard Component
export const StatCard: React.FC<{
  value: string;
  label: string;
  iconName: string;
}> = ({ value, label, iconName }) => {
  // Safe dynamic lucide icon loader
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

  return (
    <Card className="flex items-center gap-4 bg-white p-5 border-l-4 border-l-gov-navy shadow-sm transition-all hover:shadow-md hover:border-l-gov-saffron group">
      <div className="p-3 bg-gov-navy-light text-gov-navy rounded-lg group-hover:bg-gov-saffron-light group-hover:text-gov-saffron transition-all">
        <IconComponent className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-bold text-gov-charcoal leading-tight">
          {value}
        </span>
        <span className="text-xs text-gov-muted font-medium mt-0.5 uppercase tracking-wider">
          {label}
        </span>
      </div>
    </Card>
  );
};

// 7. Breadcrumb Component
interface BreadcrumbItem {
  label: string;
  url?: string;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 py-3 text-xs font-medium text-gov-muted bg-gov-bg-alt border-b border-gov-border px-4 md:px-8">
    <a href="/" className="hover:text-gov-navy flex items-center gap-1">
      <Home className="h-3.5 w-3.5" />
      <span className="sr-only">Home</span>
    </a>
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        <ChevronRight className="h-3 w-3 text-gov-border flex-shrink-0" />
        {item.url ? (
          <a href={item.url} className="hover:text-gov-navy truncate">
            {item.label}
          </a>
        ) : (
          <span className="text-gov-charcoal truncate" aria-current="page">
            {item.label}
          </span>
        )}
      </React.Fragment>
    ))}
  </nav>
);
