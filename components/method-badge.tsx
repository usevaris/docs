/**
 * An HTTP method in a square, bordered badge, coloured by what it does in
 * the brand's status colours (app/global.css): success reads, info creates,
 * warning changes, error deletes. `compact` tightens it for the sidebar.
 */
export function MethodBadge({
  method,
  compact = false,
  className = '',
}: {
  method: string;
  compact?: boolean;
  className?: string;
}) {
  const upper = method.toUpperCase();
  return (
    <span
      data-method={upper}
      className={`inline-flex shrink-0 items-center justify-center border font-mono font-semibold ${
        compact ? 'px-1 text-[0.625rem] leading-4' : 'px-1.5 text-xs leading-5'
      } ${colours[upper] ?? colours.GET} ${className}`}
    >
      {upper}
    </span>
  );
}

const colours: Record<string, string> = {
  GET: 'border-fd-success/40 text-fd-success',
  POST: 'border-fd-info/40 text-fd-info',
  PUT: 'border-fd-warning/40 text-fd-warning',
  PATCH: 'border-fd-warning/40 text-fd-warning',
  DELETE: 'border-fd-error/40 text-fd-error',
};
