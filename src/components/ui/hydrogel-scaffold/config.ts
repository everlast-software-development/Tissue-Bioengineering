/**
 * Every tuning value for the Hero "hydrogel composite" scaffold, in one place.
 *
 * Units: world units (the camera sits CAMERA.distance in front of the network's pivot), seconds,
 * radians. Colours are sRGB hex. `mobile` overrides apply on coarse pointers / narrow screens.
 */
export const CONFIG = {
  seed: 0x5eed_7155,

  camera: {
    fov: 38, // vertical, degrees
    distance: 4, // camera → network pivot (object-space origin)
    near: 0.1,
    far: 12,
  },

  /**
   * The volume the network is generated in: everything the camera can see over the whole range of
   * idle drift + pointer tilt, plus a margin, so the network always runs off every edge.
   */
  volume: {
    /** Distance from the camera at which the network starts: close on the focal side, far behind the copy. */
    frontNear: 2.4,
    frontFar: 4.3,
    /** Noise on the front surface (± half this), so the network's near face is organic, not a clean sheet. */
    frontJitter: 1.0,
    /** Distance at which the network ends. Fog is opaque before this, so the far side never shows. */
    back: 7.4,
    /** Extra lateral margin outside the swept frustum (world units). Larger than a strut, so cut ends stay off-screen. */
    margin: 0.42,
    /** Lowest aspect the coverage is generated for; a wider window regenerates. */
    minCoverageAspect: 16 / 9,
  },

  /** Where the visual weight sits, in NDC of the resting camera. The copy sits on the opposite side. */
  focus: {
    desktop: { x: 0.42, y: 0.02 },
    mobile: { x: 0.25, y: 0.42 },
  },

  struts: {
    spacingMin: 0.24, // Poisson-disk spacing range, driven by smooth noise
    spacingMax: 0.42,
    /** Spacing multiplier behind the copy (sparser) and on the focal side (denser). */
    spacingCopySide: 1.14,
    spacingFocusSide: 0.92,
    /** Spacing grows with distance: far layers are fogged, they don't need full density. */
    spacingFarBoost: 1.0,
    farBoostStart: 3.8,
    neighbours: 3,
    maxLength: 0.68,
    dropFraction: 0.08,
    radiusMin: 0.017,
    radiusMax: 0.032,
    midTaper: 0.62, // radius at mid-span, as a fraction of the end radius
    bow: 0.18, // max sideways bow, as a fraction of the length
    overshoot: 0.6, // each strut runs this many end-radii past its nodes
    nodeScale: 1.02, // junction sphere radius / largest incident strut radius
    lengthSegments: 8,
    radialSegments: { near: 8, far: 6 },
    farLodDistance: 5.2,
  },

  fibres: {
    radius: 0.0026,
    offset: 0.004, // helix sits on the strut surface plus this
    turnsMin: 1.5,
    turnsMax: 4,
    segmentsPerTurn: 12,
    radialSegments: 3,
    /** Helices are sub-pixel and fogged beyond this distance, so they are skipped there. */
    maxDistance: 5.0,
    strutChance: 1, // fraction of eligible struts that carry their two helices
    loose: {
      count: 300,
      step: 0.025,
      stepsMin: 30,
      stepsMax: 80,
      radiusMin: 0.0022,
      radiusMax: 0.0034,
      momentum: 0.94,
    },
  },

  cells: {
    count: 900,
    roundedFraction: 0.2,
    minSpacing: 0.075,
    /** Spindle semi-axes: along the strut, around it, off its surface. */
    spindle: { x: [0.045, 0.085], y: [0.02, 0.032], z: [0.012, 0.02] },
    roundedDiameter: [0.03, 0.048],
    poreClearance: 0.075,
    nucleusScale: [0.4, 0.6],
    maxDistance: 6.0,
    membraneColors: ['#3fb3ab', '#2f9a98', '#4aa985', '#43aec4', '#5cbca4', '#3a8f87'],
    nucleusColor: '#0f4a54',
    membraneOpacity: 0.55,
    /** Sphere tessellation (width × height segments) for membranes and nuclei. */
    segments: { desktop: [14, 9], mobile: [10, 7] },
  },

  ao: {
    radius: 0.17,
    sampleOffset: 0.045, // sample point is pushed off the surface along the normal
    strength: 2.4,
    max: 0.72,
    depthDarkening: 0.45, // extra darkening of the deepest layers
  },

  materials: {
    strut: {
      color: '#6aa9a6',
      roughness: 0.22,
      metalness: 0,
      rim: '#6fd0d8',
      rimPower: 2.6,
      rimStrength: 0.55,
      scatter: 0.22, // emissive "scattered light" = scatter × base colour
    },
    fibre: { color: '#e6efed', roughness: 0.5, rim: '#e9fbfb', rimStrength: 0.14, albedo: 0.9 },
    probeTint: '#7fe3ef',
    fluorescence: { membrane: '#52dca2', nucleus: '#4fb4f2' },
  },

  renderer: { exposure: 1.05 },

  fog: { color: '#060a10', near: 3.0, far: 7.1 },

  lights: {
    hemisphere: { sky: '#bfe6ec', ground: '#081418', intensity: 0.26 },
    key: { position: [-3.2, 3.6, 3.0], intensity: 2.0, shadowMapSize: 2048, shadowRadius: 3 },
    rim: { color: '#74d4e2', position: [3.2, 1.2, -3.0], intensity: 1.5 },
    bounce: { color: '#2d7378', position: [0.6, -3.5, 1.2], intensity: 0.55 },
  },

  motion: {
    driftYaw: 0.05, // idle rotation amplitude (rad)
    driftPitch: 0.025,
    driftSpeed: 0.045, // rad/s of the drift phase
    sway: 0.0045,
    crawl: 0.006,
    ripple: 0.05,
    tiltYaw: 0.35,
    tiltPitch: 0.25,
    tiltTranslate: 0.1,
    tiltDamping: 2.6, // 1/s, exponential smoothing rate
    probeRadius: 0.36,
    probeDepthOffset: 0.75, // probe plane sits this far behind the network front
    probeParting: 0.11, // how far struts part at the probe (world units); small vs the radius ⇒ fold-free
    probeDamping: 7, // probe position smoothing (1/s)
    probeFade: 6.5, // strength ease rate (1/s): ~0.45 s to settle
    cellMigration: 0.022,
    protrusion: 0.028,
    idleSlowdown: 0.75,
    tapDuration: 2.8,
    revealDuration: 2.5,
  },

  perf: {
    dprCap: 1.5,
    dprMin: 0.7,
    dprStep: 0.15,
    slowFrameMs: 24,
    fastFrameMs: 15,
    sampleFrames: 45,
  },

  mobile: {
    countScale: 0.55,
    radialSegments: { near: 6, far: 5 },
    fibreRadialSegments: 3,
    dprCap: 1.5,
    shadows: false,
  },
} as const;

export type HydrogelConfig = typeof CONFIG;
