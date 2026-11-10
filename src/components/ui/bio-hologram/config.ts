/**
 * Tuning for the Home Hero "bio hologram": DNA double helices rising out of a glowing tissue
 * scaffold with cells, rendered as additive light (a holographic look).
 *
 * Units: world units (the composition is ~4.4 units wide, ~4.2 tall), seconds, radians.
 * Colours are sRGB hex; light adds up in display space.
 */
export const CONFIG = {
  seed: 0x5eed_d7a1,

  background: '#060a10',

  camera: {
    fov: 38, // vertical, degrees
    lookAt: [0, 0.25, 0],
    elevation: 0.15, // camera height factor (looks slightly down into the scaffold)
    /** The composition is fitted to this share of the view, per layout. */
    fit: {
      desktop: { halfWidth: 0.6, halfHeight: 0.84, shift: [0.4, 0.08] },
      mobile: { halfWidth: 0.95, halfHeight: 0.46, shift: [0, 0.5] },
    },
    /** Composition extent in world units (half width, half height around lookAt). */
    extent: [2.25, 2.15],
  },

  scaffold: {
    centre: [0, -1.0, 0],
    rings: 4,
    topRadius: 1.85,
    ringDrop: 0.24, // vertical spacing between rings
    ringShrink: 0.17, // radius lost per ring (a shallow bowl)
    ringSegments: 72,
    verticals: 20,
    braceChance: 0.45,
    postHeight: 0.2,
    stemLength: 1.2,
    strutRadius: 0.026,
    braceRadius: 0.013,
    colour: '#48d8ee',
    rimColour: '#6fe4f4',
    intensity: 0.62,
    spin: 0.05, // rad/s, slow continuous rotation about its axis
  },

  web: {
    somas: 14,
    fibreRadius: 0.0055,
    colour: '#9fe6ff',
    intensity: 0.42,
  },

  helices: {
    strandColour: '#7d8bff',
    strandGlow: '#a7b4ff',
    rungColours: ['#9a6bff', '#ff6fb1', '#6fb8ff', '#c98bff'],
    samplesPerTurn: 16,
    rungsPerTurn: 10,
    /** Main helix (rises from the scaffold) + floating fragments. Positions in scene space. */
    list: [
      { base: [0.05, -0.9, 0.1], dir: [0.16, 1, -0.05], bend: [0.22, 0, 0.12], length: 3.35, radius: 0.31, turns: 3.3, strand: 0.03, rung: 0.014, intensity: 0.78, spin: 0.35, bob: 0.03, main: true },
      { base: [-1.55, 0.95, -0.4], dir: [0.62, 0.78, 0], bend: [0, 0.05, 0], length: 1.55, radius: 0.15, turns: 2.6, strand: 0.016, rung: 0.008, intensity: 0.56, spin: -0.45, bob: 0.06, main: false },
      { base: [-0.55, 1.55, -0.9], dir: [-0.28, 1, 0.1], bend: [0.06, 0, 0], length: 1.45, radius: 0.14, turns: 2.4, strand: 0.015, rung: 0.0075, intensity: 0.53, spin: 0.5, bob: 0.05, main: false },
      { base: [-1.75, 0.1, 0.25], dir: [0.88, 0.5, 0.1], bend: [0, 0.08, 0], length: 1.25, radius: 0.13, turns: 2.1, strand: 0.014, rung: 0.007, intensity: 0.5, spin: 0.4, bob: 0.07, main: false },
      { base: [1.25, -0.05, 0.35], dir: [-0.22, 1, 0.05], bend: [-0.05, 0, 0], length: 1.5, radius: 0.16, turns: 2.4, strand: 0.016, rung: 0.008, intensity: 0.56, spin: -0.4, bob: 0.05, main: false },
      { base: [1.55, 1.45, -0.7], dir: [-0.45, 0.9, 0], bend: [0, 0, 0], length: 0.95, radius: 0.11, turns: 1.7, strand: 0.012, rung: 0.006, intensity: 0.4, spin: 0.55, bob: 0.04, main: false },
    ],
    /** A bright band runs up the main helix every `period` seconds. */
    pulse: { period: 7, width: 0.28, gain: 1.4 },
  },

  cells: {
    /** Large cells resting in the scaffold: centre, radius, membrane colour, organelle tint. */
    large: [
      { c: [-1.0, -0.82, 0.48], r: 0.36, membrane: '#c86bff', tint: 0 },
      { c: [0.95, -0.88, 0.52], r: 0.33, membrane: '#7fa8ff', tint: 1 },
      { c: [-0.5, -1.22, 0.95], r: 0.24, membrane: '#ff7ac8', tint: 2 },
      { c: [1.55, -0.72, -0.25], r: 0.21, membrane: '#e07bff', tint: 0 },
      { c: [0.25, -0.98, -0.75], r: 0.26, membrane: '#8f7dff', tint: 1 },
    ],
    organelles: ['#ff5fa8', '#ff9a4d', '#5fe39a', '#9d6bff'],
    nucleus: '#b04dff',
  },

  particles: {
    count: 260,
    box: [[-2.8, -1.8, -1.6], [2.8, 2.9, 1.3]],
    rise: 0.05, // units/s
    colours: ['#7fe8ff', '#b9c4ff', '#ffffff', '#5fb8ff'],
  },

  /** Soft out-of-focus lights in the background (a hint of a lab, nothing literal). */
  bokeh: [
    { ndc: [-0.85, 0.15], size: 150, colour: '#1c5a8a', alpha: 0.18 },
    { ndc: [-0.55, -0.45], size: 110, colour: '#146a78', alpha: 0.14 },
    { ndc: [0.92, 0.3], size: 170, colour: '#1a4f8f', alpha: 0.16 },
    { ndc: [0.75, -0.6], size: 120, colour: '#16707f', alpha: 0.13 },
    { ndc: [0.05, 0.85], size: 140, colour: '#203a80', alpha: 0.12 },
  ],

  motion: {
    revealDuration: 3.2, // entrance: scaffold builds, helices zip up, cells and light fade in
    driftYaw: 0.06,
    tiltYaw: 0.28,
    tiltPitch: 0.12,
    tiltDamping: 2.6,
    hoverFade: 6.5,
    hoverRadius: 0.17, // ndc (height units)
    tapDuration: 2.8,
    idleSlowdown: 0.6,
  },

  perf: {
    dprCap: 1.75,
    dprMin: 0.75,
    dprStep: 0.15,
    slowFrameMs: 24,
    fastFrameMs: 15,
    sampleFrames: 45,
    warmupFrames: 30,
  },

  mobile: {
    dprCap: 1.5,
    particles: 140,
    somas: 8,
    ringSegments: 48,
    verticals: 14,
  },
} as const;
