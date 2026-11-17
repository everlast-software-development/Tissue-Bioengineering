import { useSyncExternalStore } from 'react';

/**
 * Whether the Home hero's primary button ("Explore Research") is on screen. The header's Book
 * Consultation is outlined while it is and filled once it has scrolled away (Navbar.tsx); the
 * hero reports from an IntersectionObserver (Hero.tsx). One module-level value, so there is a
 * single source of truth without threading state through the layout.
 */
/* Home opens on the hero, so on a Home URL the button starts in view: the header renders
   outlined from its first paint instead of switching once the (lazy) Home chunk mounts. */
let visible = typeof location !== 'undefined' && /^\/(ar\/?)?$/.test(location.pathname);
const listeners = new Set<() => void>();

export function setHeroPrimaryVisible(next: boolean): void {
  if (next === visible) return;
  visible = next;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useHeroPrimaryVisible(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => visible,
    () => visible
  );
}
