/**
 * Origin fill for every `.cf-btn` (styles: "Origin fill" in src/index.css). The button's fill grows
 * as a circle from the point where a mouse or pen entered it, and on leave shrinks back, toward the
 * exit point once it has covered the button. Keyboard focus grows it from the centre.
 *
 * This only places the circle (`--origin-x` / `--origin-y`, percentages of the button's box, so a
 * resize never needs a re-measure) and sets two marks; CSS does the drawing and timing.
 * - `data-origin`: a mouse or pen is over the button. CSS also requires `:hover`, so the mark can
 *   never leave a button filled. Touch never sets it, so a tap navigates or submits as before and
 *   leaves nothing filled behind.
 * - `data-origin-live`: a fill is showing, from its start until it has shrunk away. Only then does
 *   the button carry the fill's gradient, so at rest it renders exactly as it did without one.
 *
 * One set of delegated listeners serves links and <button>s alike; no button needs its own handlers.
 */
const SELECTOR = '.cf-btn';
const HOVER = 'data-origin';
const LIVE = 'data-origin-live';

let installed = false;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function buttonFrom(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element ? target.closest<HTMLElement>(SELECTOR) : null;
}

/** The fill's current (possibly mid-transition) stop, in percent of the farthest-corner distance. */
function radius(el: HTMLElement): number {
  const match = /(-?[\d.]+)%/.exec(getComputedStyle(el).getPropertyValue('--origin-r'));
  return match ? parseFloat(match[1]) : 0;
}

/** Puts the circle's centre at the pointer, clamped to the button's edges. */
function placeAt(el: HTMLElement, e: PointerEvent) {
  const r = el.getBoundingClientRect();
  const x = r.width ? clamp01((e.clientX - r.left) / r.width) : 0.5;
  const y = r.height ? clamp01((e.clientY - r.top) / r.height) : 0.5;
  el.style.setProperty('--origin-x', `${(x * 100).toFixed(2)}%`);
  el.style.setProperty('--origin-y', `${(y * 100).toFixed(2)}%`);
}

/** Drops the gradient once the fill has fully shrunk away (at once when there's no transition). */
function settle(el: HTMLElement) {
  if (el.hasAttribute(LIVE) && radius(el) <= 0) el.removeAttribute(LIVE);
}

function onPointerOver(e: PointerEvent) {
  const el = buttonFrom(e.target);
  if (!el || el.contains(e.relatedTarget as Node | null) || e.pointerType === 'touch') return;
  // A fill still shrinking away keeps its centre, so it grows back from there without a jump.
  if (radius(el) <= 0) placeAt(el, e);
  el.setAttribute(LIVE, '');
  el.setAttribute(HOVER, '');
}

function onPointerOut(e: PointerEvent) {
  const el = buttonFrom(e.target);
  if (!el || el.contains(e.relatedTarget as Node | null)) return;
  // Shrink toward the exit point once the circle covers the button (at 100% it covers it from any
  // centre, so moving it shows nothing); before that it retracts from where it started.
  if (el.hasAttribute(HOVER) && !el.matches(':focus-visible') && radius(el) >= 99.5) placeAt(el, e);
  el.removeAttribute(HOVER);
  settle(el);
}

function onFocusIn(e: FocusEvent) {
  const el = buttonFrom(e.target);
  if (!el || el !== e.target || !el.matches(':focus-visible')) return;
  if (!el.hasAttribute(HOVER) && radius(el) <= 0) {
    el.style.setProperty('--origin-x', '50%');
    el.style.setProperty('--origin-y', '50%');
  }
  el.setAttribute(LIVE, '');
}

function onFocusOut(e: FocusEvent) {
  const el = buttonFrom(e.target);
  if (el && el === e.target) settle(el);
}

function onTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== '--origin-r' || !(e.target instanceof HTMLElement)) return;
  if (e.target.matches(SELECTOR)) settle(e.target);
}

/** Installs the listeners once for the whole document. */
export function installOriginFill() {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  document.addEventListener('pointerover', onPointerOver, { passive: true });
  document.addEventListener('pointerout', onPointerOut, { passive: true });
  document.addEventListener('focusin', onFocusIn);
  document.addEventListener('focusout', onFocusOut);
  document.addEventListener('transitionend', onTransitionEnd);
  document.addEventListener('transitioncancel', onTransitionEnd);
}
