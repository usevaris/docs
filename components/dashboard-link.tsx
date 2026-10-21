import { dashboardUrl } from '@/lib/shared';

/**
 * Opens the Varis app. The brand's primary button: signal orange with
 * graphite text, square, sized to the topbar's controls.
 */
export function DashboardLink({ className = '' }: { className?: string }) {
  return (
    <a
      href={dashboardUrl}
      className={`inline-flex shrink-0 items-center bg-(--brand) px-3 py-1 text-[0.8125rem] font-medium whitespace-nowrap text-(--on-brand) transition-colors duration-[80ms] hover:bg-(--brand-hover) ${className}`}
    >
      Dashboard
    </a>
  );
}
