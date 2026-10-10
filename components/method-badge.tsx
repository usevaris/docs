/**
 * An HTTP method in a bordered pill, coloured by what it does: green reads,
 * blue creates, amber changes, red deletes. `compact` tightens it for the
 * sidebar.
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
      className={`inline-flex shrink-0 items-center justify-center rounded-md border font-mono font-semibold ${
        compact ? 'px-1 text-[0.625rem] leading-4' : 'px-1.5 text-xs leading-5'
      } ${colours[upper] ?? colours.GET} ${className}`}
    >
      {upper}
    </span>
  );
}

const colours: Record<string, string> = {
  GET: 'border-green-600/40 text-green-700 dark:border-green-400/40 dark:text-green-400',
  POST: 'border-blue-600/40 text-blue-700 dark:border-blue-400/40 dark:text-blue-400',
  PUT: 'border-amber-600/40 text-amber-700 dark:border-amber-400/40 dark:text-amber-400',
  PATCH: 'border-amber-600/40 text-amber-700 dark:border-amber-400/40 dark:text-amber-400',
  DELETE: 'border-red-600/40 text-red-700 dark:border-red-400/40 dark:text-red-400',
};
