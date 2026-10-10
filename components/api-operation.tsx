'use client';
import { Fragment, useState, type ReactNode } from 'react';
import { Check, ChevronDown, Copy } from 'lucide-react';
import { useOpenAPI } from 'fumadocs-openapi';
import type { OperationObject } from 'fumadocs-openapi';
import { MethodBadge } from './method-badge';

/**
 * The readable column of an API reference page, drawn from openapi.yaml:
 * title, endpoint, description, then parameters (credentials among the
 * headers), Body, and Response. Every field is one row: its name, its type
 * and whether it's required, then its description, allowed values, and
 * default. Nested fields follow under their parent. The only controls are
 * copying the path, showing a long list of options, and picking which
 * response status to read.
 */
export function ApiOperation({
  operation,
  method,
  path,
}: {
  operation: OperationObject;
  method: string;
  path: string;
}) {
  const { doc } = useOpenAPI();
  const r = doc.resolve as <T>(node: T) => T;
  const op = r(operation) as Operation;

  // Credentials are headers (or, for some API keys, query parameters), so
  // they're listed with the others, first.
  const parameters = [
    ...credentials(op, doc.dereferenced as unknown as Spec, r),
    ...(op.parameters ?? []).map((p) => r(p) as Parameter),
  ];
  const groups: [string, Parameter[]][] = [
    ['Path parameters', parameters.filter((p) => p.in === 'path')],
    ['Query parameters', parameters.filter((p) => p.in === 'query')],
    ['Headers', parameters.filter((p) => p.in === 'header')],
  ];

  const body = op.requestBody ? (r(op.requestBody) as RequestBody) : undefined;
  const [bodyType, bodyMedia] = Object.entries(body?.content ?? {})[0] ?? [];

  return (
    <>
      <h1 className="mb-4 text-[1.75em] font-semibold">{op.summary}</h1>
      <Endpoint method={method} path={path} />
      {op.description && <Markdown text={op.description} />}


      {groups.map(
        ([title, items]) =>
          items.length > 0 && (
            <Section key={title} title={title}>
              {items.map((p) => (
                <Field
                  key={p.name}
                  name={p.name}
                  type={p.type}
                  schema={p.schema && r(p.schema)}
                  required={p.required}
                  description={p.description}
                />
              ))}
            </Section>
          ),
      )}

      {bodyMedia?.schema && (
        <Section title="Body" aside={bodyType}>
          {body?.description && <Markdown text={body.description} />}
          <Fields schema={r(bodyMedia.schema)} />
        </Section>
      )}

      <Responses operation={op} />
    </>
  );
}

function Endpoint({ method, path }: { method: string; path: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="mb-8 flex items-center gap-3 rounded-lg border px-3 py-2.5">
      <MethodBadge method={method} />
      <code className="min-w-0 flex-1 truncate font-mono text-[0.9375rem]">{path}</code>
      <button
        type="button"
        aria-label="Copy path"
        onClick={() => {
          void navigator.clipboard.writeText(path);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="shrink-0 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}

/**
 * The operation's credentials as parameters. Each security requirement is
 * one way to authenticate, and its schemes go together; with a single way,
 * every one of them is required.
 */
function credentials(op: Operation, spec: Spec, r: Resolve): Parameter[] {
  const requirements = op.security ?? spec.security ?? [];
  const names = [...new Set(requirements.flatMap((req) => Object.keys(req)))];

  return names.flatMap((name): Parameter[] => {
    const scheme = r(spec.components?.securitySchemes?.[name]) as SecurityScheme | undefined;
    if (!scheme) return [];
    const bearer = scheme.type === 'http' && scheme.scheme === 'bearer';
    const location = bearer ? 'header' : scheme.in;
    if (location !== 'header' && location !== 'query') return [];
    return [
      {
        name: bearer ? 'Authorization' : (scheme.name ?? name),
        in: location,
        type: bearer ? 'Bearer <token>' : 'string',
        required: requirements.length === 1,
        description: scheme.description,
      },
    ];
  });
}

function Responses({ operation }: { operation: Operation }) {
  const { doc } = useOpenAPI();
  const r = doc.resolve as <T>(node: T) => T;
  const entries = Object.entries(operation.responses ?? {}).map(
    ([status, res]) => [status, r(res) as Response] as const,
  );
  const [status, setStatus] = useState(entries[0]?.[0]);
  const response = entries.find(([s]) => s === status)?.[1];
  if (!response) return null;

  const [type, media] = Object.entries(response.content ?? {})[0] ?? [];

  return (
    <Section
      title="Response"
      aside={
        <span className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
          {type && <Pill>{type}</Pill>}
          <span className="flex flex-wrap gap-1">
            {entries.map(([s]) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                aria-pressed={s === status}
                className={`rounded-md px-1.5 font-mono text-[0.8125rem] transition-colors ${
                  s === status
                    ? 'bg-fd-secondary text-fd-foreground'
                    : 'text-fd-muted-foreground hover:text-fd-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </span>
        </span>
      }
    >
      {response.description && <Markdown text={response.description} />}
      {media?.schema && <Fields schema={r(media.schema)} />}
    </Section>
  );
}

function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-12">
      <div className="mb-2 flex items-baseline justify-between gap-4 border-b pb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        {typeof aside === 'string' ? <Pill>{aside}</Pill> : aside}
      </div>
      {children}
    </section>
  );
}

/** The properties of an object schema, as rows. */
function Fields({ schema }: { schema: Schema }) {
  const { doc } = useOpenAPI();
  const r = doc.resolve as <T>(node: T) => T;
  const object = flatten(schema, r);
  const properties = Object.entries(object.properties ?? {});
  if (properties.length === 0) return null;

  return (
    <div>
      {properties.map(([name, child]) => (
        <Field
          key={name}
          name={name}
          schema={r(child)}
          required={object.required?.includes(name)}
          description={r(child).description}
        />
      ))}
    </div>
  );
}

function Field({
  name,
  schema,
  type,
  required,
  description,
}: {
  name: string;
  schema?: Schema;
  type?: string;
  required?: boolean;
  description?: string;
}) {
  const { doc } = useOpenAPI();
  const r = doc.resolve as <T>(node: T) => T;
  const values = schema && enumOf(schema, r);
  const nested = schema && childObject(schema, r);

  return (
    <div className="border-t py-5 first:border-t-0">
      <div className="flex flex-wrap items-center gap-2">
        <code className="font-mono text-[0.9375rem] font-semibold text-(--accent)">{name}</code>
        <Pill>{type ?? (schema ? typeLabel(schema, r) : 'string')}</Pill>
        {required && <Pill tone="required">required</Pill>}
      </div>
      {description && (
        <div className="mt-2 text-[0.875rem] text-fd-muted-foreground">
          <Markdown text={description} />
        </div>
      )}
      {values && <Options values={values} />}
      {schema?.default !== undefined && (
        <p className="mt-3 text-[0.875rem] text-fd-muted-foreground">
          Default: <Pill>{JSON.stringify(schema.default)}</Pill>
        </p>
      )}
      {nested && (
        <div className="mt-4 border-s ps-5">
          <Fields schema={nested} />
        </div>
      )}
    </div>
  );
}

/**
 * "Available options:" and the values. Past 12, the list shows its first
 * two lines, the second fading out from its top, with "Show all" over the
 * fade.
 */
function Options({ values }: { values: unknown[] }) {
  const [all, setAll] = useState(false);
  const long = values.length > 12 && !all;

  return (
    <div className="relative mt-3">
      <p
        className={`text-[0.875rem] leading-8 text-fd-muted-foreground ${long ? 'max-h-16 overflow-hidden' : ''}`}
        style={long ? { maskImage: 'linear-gradient(to bottom, #000 2rem, transparent 4rem)' } : undefined}
      >
        Available options:{' '}
        {values.map((v, i) => (
          <Fragment key={String(v)}>
            {i > 0 && ', '}
            <Pill>{String(v)}</Pill>
          </Fragment>
        ))}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="absolute end-0 bottom-0 inline-flex items-center gap-1 text-[0.8125rem] text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          Show all
          <ChevronDown className="size-3.5" />
        </button>
      )}
    </div>
  );
}

function Pill({ children, tone }: { children: ReactNode; tone?: 'required' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[0.8125rem] leading-5 ${
        tone === 'required'
          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
          : 'bg-fd-secondary text-fd-secondary-foreground'
      }`}
    >
      {children}
    </span>
  );
}

/**
 * Just enough Markdown for spec descriptions: paragraphs, `code`, and
 * [links](url).
 */
function Markdown({ text }: { text: string }) {
  return (
    <>
      {text
        .trim()
        .split(/\n\s*\n/)
        .map((para, i) => (
          <p key={i} className="my-3 first:mt-0 last:mb-0">
            {inline(para.replace(/\s*\n\s*/g, ' '))}
          </p>
        ))}
    </>
  );
}

function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith('`')) {
      return (
        <code key={i} className="rounded bg-fd-secondary px-1 py-0.5 font-mono text-[0.875em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <a key={i} href={link[2]} className="underline underline-offset-2">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

// --- Reading schemas ---------------------------------------------------------

type Resolve = <T>(node: T) => T;

/** Merges allOf into one schema, so its properties read as one list. */
function flatten(schema: Schema, r: Resolve): Schema {
  if (!schema.allOf) return schema;
  const parts = schema.allOf.map((s) => flatten(r(s), r));
  return {
    ...schema,
    properties: Object.assign({}, schema.properties, ...parts.map((p) => p.properties)),
    required: [...(schema.required ?? []), ...parts.flatMap((p) => p.required ?? [])],
  };
}

function typesOf(schema: Schema): string[] {
  if (Array.isArray(schema.type)) return schema.type;
  return schema.type ? [schema.type] : [];
}

/** `string`, `string | null`, `enum<string>`, `object[]`, `string<uuid>`. */
function typeLabel(schema: Schema, r: Resolve): string {
  const s = flatten(schema, r);
  const variants = s.oneOf ?? s.anyOf;
  if (variants) return variants.map((v) => typeLabel(r(v), r)).join(' | ');

  return (
    typesOf(s)
      .map((t) => {
        if (t === 'array') return `${s.items ? typeLabel(r(s.items), r) : 'any'}[]`;
        if (s.enum && t !== 'null') return `enum<${t}>`;
        if (s.format && t !== 'null') return `${t}<${s.format}>`;
        return t;
      })
      .join(' | ') || (s.properties ? 'object' : 'any')
  );
}

function enumOf(schema: Schema, r: Resolve): unknown[] | undefined {
  const s = flatten(schema, r);
  if (s.enum) return s.enum.filter((v) => v !== null);
  if (s.items) return enumOf(r(s.items), r);
  return undefined;
}

/** The object whose fields nest under this one: itself, or its items'. */
function childObject(schema: Schema, r: Resolve): Schema | undefined {
  const s = flatten(schema, r);
  if (s.properties && Object.keys(s.properties).length > 0) return s;
  if (s.items) return childObject(r(s.items), r);
  return undefined;
}

interface Schema {
  type?: string | string[];
  format?: string;
  description?: string;
  enum?: unknown[];
  default?: unknown;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
}

interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  /** Set for credentials, which have no schema. */
  type?: string;
  required?: boolean;
  description?: string;
  schema?: Schema;
}

interface MediaType {
  schema?: Schema;
}

interface RequestBody {
  description?: string;
  content?: Record<string, MediaType>;
}

interface Response {
  description?: string;
  content?: Record<string, MediaType>;
}

interface SecurityScheme {
  type: string;
  scheme?: string;
  in?: string;
  name?: string;
  description?: string;
}

interface Operation {
  summary?: string;
  description?: string;
  parameters?: unknown[];
  requestBody?: unknown;
  responses?: Record<string, unknown>;
  security?: Record<string, string[]>[];
}

interface Spec {
  security?: Record<string, string[]>[];
  components?: { securitySchemes?: Record<string, unknown> };
}
