import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { getCountryCallingCode, type Country } from 'react-phone-number-input/max';
// The same metadata module react-phone-number-input/max already loads (no extra bytes).
import metadata from 'libphonenumber-js/max/metadata';
import { cn } from '@/lib/utils';

/**
 * Searchable country picker for the phone field. react-phone-number-input renders it
 * through its `countrySelectComponent` prop and passes these props; the library's own
 * picker is a native <select> with no search.
 */
interface CountrySelectProps {
  value?: Country;
  onChange: (country?: Country) => void;
  options: { value?: Country; label: string; divider?: boolean }[];
  disabled?: boolean;
  readOnly?: boolean;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
}

interface Option {
  country: Country;
  label: string;
  code: string;
  /** Lower-case, accent-free text the search runs against. */
  search: string;
}

/** Common short names people type that aren't part of the official country name. */
const ALIASES: Partial<Record<Country, string>> = {
  AE: 'uae emirates dubai abu dhabi',
  GB: 'uk britain england scotland wales',
  US: 'usa america',
  SA: 'ksa saudi',
  KR: 'south korea',
  KP: 'north korea',
};

const optionId = (uid: string, c: Country) => `${uid}-opt-${c}`;

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/**
 * Flag images (3:2 SVGs from country-flag-icons, which react-phone-number-input already
 * depends on), emitted as separate static files (see assetsInlineLimit in vite.config.ts):
 * the page downloads only the flags it shows, instead of bundling all ~250 into the
 * form pages' JavaScript.
 */
const FLAG_URLS = import.meta.glob<string>('/node_modules/country-flag-icons/3x2/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});
const flagUrl = (c: Country) => FLAG_URLS[`/node_modules/country-flag-icons/3x2/${c}.svg`];

/** Rectangular flag; decorative, since every place it appears also shows the name or a label. */
export const CountryFlag: React.FC<{ country: Country; lazy?: boolean }> = ({ country, lazy }) => {
  const src = flagUrl(country);
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-[14px] w-[21px] shrink-0 overflow-hidden rounded-[2px] bg-cf-line ring-1 ring-white/10"
    >
      {src && (
        <img
          src={src}
          alt=""
          width={21}
          height={14}
          loading={lazy ? 'lazy' : undefined}
          decoding="async"
          className="h-full w-full object-cover"
        />
      )}
    </span>
  );
};

function filterOptions(all: Option[], query: string): Option[] {
  const q = normalize(query);
  if (!q) return all;
  const digits = q.replace(/^\+|^00/, '');
  if (/^\d+$/.test(digits)) {
    // Exact code first, and within a shared code its main country first
    // (+1 → United States, +44 → United Kingdom, +7 → Russia), then the rest alphabetically.
    const rank = (o: Option) =>
      (o.code === digits ? 0 : 2) + (metadata.country_calling_codes[o.code]?.[0] === o.country ? 0 : 1);
    return all.filter((o) => o.code.startsWith(digits)).sort((a, b) => rank(a) - rank(b));
  }
  // Name prefix matches first, then matches anywhere (name, ISO code, aliases).
  const starts = all.filter((o) => o.search.startsWith(q));
  const rest = all.filter((o) => !o.search.startsWith(q) && (o.search.includes(q) || o.country.toLowerCase() === q));
  return [...starts, ...rest];
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  options,
  disabled,
  readOnly,
  onFocus,
  onBlur,
}) => {
  const uid = useId();
  const listId = `${uid}-list`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const all = useMemo<Option[]>(
    () =>
      options.flatMap((o) =>
        o.value && !o.divider
          ? [
              {
                country: o.value,
                label: o.label,
                code: getCountryCallingCode(o.value),
                search: normalize(`${o.label} ${ALIASES[o.value] ?? ''}`),
              },
            ]
          : []
      ),
    [options]
  );
  const results = useMemo(() => filterOptions(all, query), [all, query]);

  const selected = all.find((o) => o.country === value);
  const locked = disabled || readOnly;

  const openList = () => {
    if (locked) return;
    setQuery('');
    setActive(Math.max(0, all.findIndex((o) => o.country === value)));
    setOpen(true);
  };

  const close = (refocusButton: boolean) => {
    setOpen(false);
    if (refocusButton) buttonRef.current?.focus();
  };

  const choose = (o: Option | undefined) => {
    if (!o) return;
    setOpen(false);
    // The phone input takes focus on selection (focusInputOnCountrySelection).
    onChange(o.country);
  };

  // Focus the search box on open and bring the popover fully into view.
  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    searchRef.current?.closest('[role="dialog"]')?.scrollIntoView({ block: 'nearest' });
  }, [open]);

  // Keep the highlighted option visible while navigating.
  useEffect(() => {
    if (!open) return;
    const o = results[active];
    if (o) document.getElementById(optionId(uid, o.country))?.scrollIntoView({ block: 'nearest' });
  }, [open, active, results, uid]);

  // Close on a pointer press outside the picker.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const last = results.length - 1;
    const move = (to: number) => {
      e.preventDefault();
      setActive(Math.min(Math.max(to, 0), Math.max(last, 0)));
    };
    switch (e.key) {
      case 'ArrowDown':
        return move(active + 1);
      case 'ArrowUp':
        return move(active - 1);
      case 'PageDown':
        return move(active + 8);
      case 'PageUp':
        return move(active - 8);
      case 'Enter':
        e.preventDefault(); // never submit the form from the search box
        return choose(results[active]);
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        return close(true);
      case 'Tab':
        return setOpen(false);
    }
  };

  const onButtonKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openList();
    }
  };

  return (
    <div
      ref={rootRef}
      className="flex shrink-0 items-stretch"
      onBlur={(e) => {
        // Focus left the picker entirely (e.g. Tab out of the search box).
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      {/* Leading segment of the phone field's frame; the frame (.cf-phone) draws the border and focus ring. */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-disabled={readOnly || undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          selected
            ? `Country calling code: ${selected.label} +${selected.code}. Change country`
            : 'Choose country calling code'
        }
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onButtonKey}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(
          'flex h-full items-center gap-1.5 rounded-l-[7px] border-r border-cf-line-strong pl-3 pr-2.5 text-base font-medium text-cf-text transition-colors duration-150 hover:bg-white/[0.03] focus:outline-none focus-visible:bg-cf-active disabled:cursor-not-allowed disabled:hover:bg-transparent motion-reduce:transition-none sm:text-[15px]',
          open && 'bg-cf-active'
        )}
      >
        {selected && <CountryFlag country={selected.country} />}
        <span className="tabular-nums">{selected ? `+${selected.code}` : '+'}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-cf-muted transition-transform duration-200 motion-reduce:transition-none',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose country"
          className="absolute right-0 top-full z-30 mt-2 w-full overflow-hidden rounded-lg border border-cf-line-strong bg-cf-raised shadow-2xl shadow-black/60 sm:min-w-[18rem]"
        >
          <div className="relative border-b border-cf-line p-2">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-cf-muted"
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={results[active] ? optionId(uid, results[active].country) : undefined}
              aria-label="Search countries by name or calling code"
              autoComplete="off"
              spellCheck={false}
              placeholder="Search country or code"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
              className="block h-10 w-full rounded-md border border-cf-line-strong bg-cf-bg pl-9 pr-3 text-base text-cf-text placeholder:text-cf-muted/80 focus:border-cf-accent focus:outline-none focus:ring-1 focus:ring-cf-accent sm:text-[15px]"
            />
          </div>

          <ul
            id={listId}
            role="listbox"
            aria-label="Countries"
            className="max-h-64 overflow-y-auto overscroll-contain py-1"
          >
            {results.map((o, i) => (
              <li
                key={o.country}
                id={optionId(uid, o.country)}
                role="option"
                aria-selected={o.country === value}
                data-active={i === active || undefined}
                onPointerMove={() => i !== active && setActive(i)}
                onMouseDown={(e) => e.preventDefault()} // keep focus in the search box
                onClick={() => choose(o)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 px-3 py-2 text-[14px] text-cf-text-2',
                  'data-[active]:bg-cf-active data-[active]:text-cf-text',
                  'aria-selected:font-medium aria-selected:text-cf-accent'
                )}
              >
                <CountryFlag country={o.country} lazy />
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                <span className="shrink-0 tabular-nums text-cf-muted">+{o.code}</span>
              </li>
            ))}
          </ul>
          {results.length === 0 && (
            <p className="px-4 py-3 text-[14px] text-cf-muted" role="status">
              No countries match “{query}”.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
