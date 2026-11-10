/**
 * Every tuning value for the Home Hero "ordered gyroid hydrogel composite", in one place.
 *
 * Units: world units (the camera sits CAMERA.distance in front of the lattice's pivot), seconds,
 * radians. Colours are sRGB hex. `mobile` overrides apply on coarse pointers / narrow screens.
 */
export const CONFIG = {
  camera: {
    fov: 38, // vertical, degrees
    distance: 4, // camera → lattice pivot (object-space origin)
    /** Narrow screens widen the vertical FOV so the horizontal half-FOV tangent stays at least this. */
    minTanX: 0.4,
  },

  /** Depth range the lattice is shown in, measured from the camera along the view axis. */
  volume: {
    /** Where the lattice begins: close on the focal side, further back behind the copy. */
    frontNear: 3.35,
    frontFar: 4.25,
    /** Stacked (mobile) layout: the wider portrait FOV already shows more repeats, so it starts closer. */
    mobileFrontNear: 2.9,
    mobileFrontFar: 3.6,
    /** Walls fade in over this depth after the front, so the front never reads as a cut. */
    frontFade: 0.9,
    /** Where marching stops; fog has faded everything out before it. */
    back: 6.6,
  },

  /** Where the visual weight sits, in NDC of the resting camera. The copy sits on the opposite side. */
  focus: {
    desktop: { x: 0.42, y: 0.02 },
    mobile: { x: 0.25, y: 0.42 },
  },

  /**
   * Sheet gyroid: the hydrogel occupies |g(q)| < t, where
   * g = sin qx·cos qy + sin qy·cos qz + sin qz·cos qx (g ∈ [-1.5, 1.5]) and q = 2π/period · lattice coords:
   * a thickened gyroid minimal surface. The two interwoven labyrinths either side of it are the pores.
   */
  gyroid: {
    period: 0.82,
    /** Wall half-thickness in field units. */
    thickness: 0.3,
    /** ± fraction of the thickness, slow and smooth: subtle variation without losing the order. */
    thicknessVariation: 0.12,
    /** Low-frequency domain warp, as a fraction of the period. */
    warp: 0.04,
    /** Lattice direction that faces the camera (near [1,0,0] shows the classic gyroid weave), and a roll. */
    viewAxis: [1, 0.3, 0.2],
    roll: 0.18,
    /** Per-position tint drifts slowly between cyan, teal and turquoise. */
    tints: ['#66c6cf', '#46a8a5', '#58c2b2'],
  },

  /** Translucent hydrogel shading. */
  gel: {
    opacityFacing: 0.62, // opacity where the wall faces the camera…
    opacityGrazing: 0.82, // …and at grazing angles (Fresnel)
    rim: '#6fd0d8',
    rimPower: 2.4,
    rimStrength: 0.42,
    scatter: 0.12, // emissive "scattered light" = scatter × base colour
    specular: 0.55,
    shininess: 70,
    transmission: 0.55, // back-light through the thin walls from the rim light
    maxLayers: 3, // walls composited per ray
    /** Light falls off with depth behind the first wall a ray meets (per world unit): pores read as depth. */
    poreDarkening: 4.2,
  },

  cells: {
    /** A limited number of cells, at pore centres in the focal region (seeded: identical on every load). */
    count: 44,
    minSpacing: 0.42,
    radius: [0.03, 0.046],
    elongatedFraction: 0.25,
    elongation: 1.55,
    nucleusScale: 0.5,
    /** No cells closer than this behind the front, or further than this from the camera. */
    minDepthBehindFront: 0.3,
    maxDistance: 5.4,
    membraneColors: ['#3fb3ab', '#2f9a98', '#4aa985', '#43aec4', '#5cbca4', '#3a8f87'],
    nucleusColor: '#0f4a54',
    membraneOpacity: 0.55,
  },

  lights: {
    hemisphere: { sky: '#bfe6ec', ground: '#081418', intensity: 0.2 },
    key: { direction: [-3.2, 3.6, 3.0], intensity: 1.45 },
    rim: { color: '#74d4e2', direction: [3.2, 1.2, -3.0] },
    bounce: { color: '#2d7378', direction: [0.6, -3.5, 1.2], intensity: 0.35 },
  },

  probeTint: '#7fe3ef',
  fluorescence: { membrane: '#52dca2', nucleus: '#4fb4f2' },

  exposure: 1.05,
  background: '#060a10',
  fog: { near: 3.4, far: 6.3 },

  motion: {
    driftYaw: 0.05, // idle rotation amplitude (rad)
    driftPitch: 0.025,
    driftSpeed: 0.045,
    sway: 0.006, // coherent idle sway of the lattice (world units)
    crawl: 0.008, // cells drift slightly along their long axis
    ripple: 0.06, // membrane ripple (fraction of the radius)
    tiltYaw: 0.35,
    tiltPitch: 0.25,
    tiltTranslate: 0.1,
    tiltDamping: 2.6, // 1/s, exponential smoothing rate
    probeRadius: 0.5,
    probeDepthOffset: 0.6, // probe plane sits this far behind the lattice front
    probeParting: 0.12, // pores open around the tip (world units)
    probeThinning: 0.15, // walls thin under the tip (field units)
    probeDamping: 7,
    probeFade: 6.5, // strength ease rate (1/s): ~0.45 s to settle
    cellMigration: 0.025,
    idleSlowdown: 0.75,
    tapDuration: 2.8,
    revealDuration: 2.5,
  },

  /** Ray-march budget. */
  march: {
    maxSteps: 96,
    minStep: 0.0025, // × ray distance
    hitEpsilon: 0.0012, // × ray distance
  },

  perf: {
    /** Drawing-buffer pixel budget; the canvas is upscaled when the Hero is larger. */
    pixelBudget: 760_000,
    scaleCap: 1.5,
    scaleMin: 0.5,
    scaleStep: 0.12,
    slowFrameMs: 24,
    fastFrameMs: 15,
    sampleFrames: 45,
    /** Frames ignored after start-up / resume (shader warm-up hitches). */
    warmupFrames: 30,
  },

  mobile: {
    pixelBudget: 520_000,
    maxSteps: 72,
    maxLayers: 3,
    cellCount: 22,
  },
} as const;

export type HydrogelConfig = typeof CONFIG;
