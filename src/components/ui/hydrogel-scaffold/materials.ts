/**
 * Materials: three's MeshStandardMaterial / MeshDepthMaterial, patched with onBeforeCompile.
 *
 * Every patched material shares one uniform set (`shared`), so the render loop updates the
 * clock, probe and reveal once per frame. Displacement happens in the network's object space
 * (the mesh's local space), before three's own transforms, so shading, shadows and fog all
 * see the displaced geometry.
 */
import {
  Color,
  MeshDepthMaterial,
  MeshStandardMaterial,
  RGBADepthPacking,
  Vector3,
  Vector4,
  type WebGLProgramParametersWithUniforms,
} from 'three';
import { CONFIG } from './config';

const MAT = CONFIG.materials;
const MOT = CONFIG.motion;

export function createSharedUniforms() {
  return {
    uIdle: { value: 0 }, // idle clock (s); slowed while probing, frozen with reduced motion
    uMotion: { value: 1 }, // 0 with reduced motion: no sway, crawl or ripple
    uProbe: { value: new Vector4(0, 0, 0, 0) }, // xyz object-space probe point, w strength 0…1
    uViewAxis: { value: new Vector3(0, 0, 1) }, // object-space unit vector towards the camera
    uFocus: { value: new Vector3() },
    uReveal: { value: 1e3 }, // reveal radius around uFocus (object units)
    uProbeTint: { value: new Color(MAT.probeTint) },
  };
}
export type SharedUniforms = ReturnType<typeof createSharedUniforms>;

/* ── GLSL shared by every patched material ──────────────────────────────── */

const COMMON = /* glsl */ `
uniform float uIdle;
uniform float uMotion;
uniform vec4 uProbe;
uniform vec3 uViewAxis;
uniform vec3 uFocus;
uniform float uReveal;
uniform vec3 uProbeTint;

const float SWAY = ${MOT.sway.toFixed(5)};
const float PROBE_R = ${MOT.probeRadius.toFixed(3)};
const float PARTING = ${MOT.probeParting.toFixed(3)};

// Coherent, low-frequency sway: neighbouring geometry moves together, like a soft gel.
vec3 swayAt(vec3 p) {
  return SWAY * uMotion * vec3(
    sin(p.y * 1.3 + p.z * 0.4 + uIdle * 0.55),
    sin(p.z * 1.1 + p.x * 0.5 + uIdle * 0.47 + 1.7),
    sin(p.x * 1.2 + p.y * 0.3 + uIdle * 0.51 + 3.1));
}

// Probe falloff: ellipsoidal (longer along the view axis), so a tip pressing in parts a column of gel.
float probeQ(vec3 d) {
  float along = dot(d, uViewAxis);
  vec3 lat = d - along * uViewAxis;
  return (dot(lat, lat) + along * along * 0.3) / (PROBE_R * PROBE_R);
}

// Parting field, evaluated at a vertex's anchor (its strut's centre-line), so struts and fibres move
// aside as whole cross-sections instead of being magnified. Lateral push of magnitude
// PARTING * u/(u+0.25) * exp(-q): zero at the centre and continuous (no tearing), and its outward
// fall-off is gentle relative to PROBE_R, so the map never folds.
vec3 partAt(vec3 p) {
  vec3 d = p - uProbe.xyz;
  float along = dot(d, uViewAxis);
  vec3 lat = d - along * uViewAxis;
  float u = length(lat) / PROBE_R;
  float fall = exp(-probeQ(d)) * uProbe.w;
  return lat * (PARTING * fall / ((u + 0.25) * PROBE_R)) - uViewAxis * (0.03 * fall);
}

float probeGlow(vec3 p) {
  return exp(-probeQ(p - uProbe.xyz) * 1.3) * uProbe.w;
}

// Irregular reveal front, so the entrance grows out organically rather than as a perfect sphere.
float revealDist(vec3 p) {
  return length(p - uFocus) + 0.18 * sin(p.x * 5.3 + 1.0) * sin(p.y * 4.7 + 2.0) * sin(p.z * 6.1);
}
`;

const DISPLACE_VERTEX = /* glsl */ `
#include <begin_vertex>
vObj = transformed;
transformed += swayAt(transformed) + partAt(aAnchor);
`;

const REVEAL_DISCARD = /* glsl */ `
#include <clipping_planes_fragment>
if (revealDist(vObj) > uReveal) discard;
`;

type Shader = WebGLProgramParametersWithUniforms;

function addUniforms(shader: Shader, shared: SharedUniforms, extra: Record<string, { value: unknown }> = {}) {
  Object.assign(shader.uniforms, shared, extra);
}

function patchVertexDisplace(shader: Shader) {
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', `#include <common>\n${COMMON}\nattribute vec3 aAnchor;\nvarying vec3 vObj;`)
    .replace('#include <begin_vertex>', DISPLACE_VERTEX);
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', `#include <common>\n${COMMON}\nvarying vec3 vObj;`)
    .replace('#include <clipping_planes_fragment>', REVEAL_DISCARD);
}

/* ── Hydrogel struts: wet, translucent-looking ─────────────────────────── */

export function createStrutMaterial(shared: SharedUniforms) {
  const m = new MeshStandardMaterial({
    color: MAT.strut.color,
    roughness: MAT.strut.roughness,
    metalness: MAT.strut.metalness,
    vertexColors: true, // baked AO
  });
  const extra = {
    uRim: { value: new Color(MAT.strut.rim) },
    uRimStrength: { value: MAT.strut.rimStrength },
    uScatter: { value: MAT.strut.scatter },
  };
  m.onBeforeCompile = (shader) => {
    addUniforms(shader, shared, extra);
    patchVertexDisplace(shader);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\nuniform vec3 uRim;\nuniform float uRimStrength;\nuniform float uScatter;`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        /* glsl */ `#include <emissivemap_fragment>
        {
          float fres = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), ${MAT.strut.rimPower.toFixed(2)});
          float glow = probeGlow(vObj);
          vec3 rim = mix(uRim, uProbeTint, glow);
          // Fresnel rim (wet surface), scattered light inside the gel, a soft cyan wash near the probe.
          totalEmissiveRadiance += rim * fres * (uRimStrength + 0.4 * glow);
          totalEmissiveRadiance += diffuseColor.rgb * uScatter;
          totalEmissiveRadiance += uProbeTint * glow * 0.035;
          // A faint front on the entrance reveal.
          float edge = 1.0 - smoothstep(0.0, 0.22, uReveal - revealDist(vObj));
          totalEmissiveRadiance += uRim * edge * 0.35;
        }`,
      );
  };
  m.customProgramCacheKey = () => 'hydrogel-strut';
  return m;
}

/** Shadow-pass twin of a displaced material: same displacement and reveal, so shadows match. */
export function createDisplacedDepthMaterial(shared: SharedUniforms) {
  const m = new MeshDepthMaterial({ depthPacking: RGBADepthPacking });
  m.onBeforeCompile = (shader) => {
    addUniforms(shader, shared);
    patchVertexDisplace(shader);
  };
  m.customProgramCacheKey = () => 'hydrogel-depth';
  return m;
}

/* ── Collagen fibres ───────────────────────────────────────────────────── */

export function createFibreMaterial(shared: SharedUniforms) {
  const m = new MeshStandardMaterial({
    color: MAT.fibre.color,
    roughness: MAT.fibre.roughness,
    metalness: 0,
    vertexColors: true,
  });
  const extra = { uFibreRim: { value: new Color(MAT.fibre.rim) } };
  m.onBeforeCompile = (shader) => {
    addUniforms(shader, shared, extra);
    patchVertexDisplace(shader);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nuniform vec3 uFibreRim;`)
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>\n// Soft off-white: fibres read as texture on the gel, not as bright wire.\ndiffuseColor.rgb = mix(diffuseColor.rgb * ${MAT.fibre.albedo.toFixed(2)}, uProbeTint, probeGlow(vObj) * 0.55);`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        /* glsl */ `#include <emissivemap_fragment>
        {
          float fres = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.0);
          float glow = probeGlow(vObj);
          totalEmissiveRadiance += mix(uFibreRim, uProbeTint, glow) * fres * (${MAT.fibre.rimStrength.toFixed(2)} + 0.4 * glow);
          totalEmissiveRadiance += uProbeTint * glow * 0.12;
        }`,
      );
  };
  m.customProgramCacheKey = () => 'hydrogel-fibre';
  return m;
}

/* ── Cells: instanced membrane + nucleus ───────────────────────────────── */

const CELL_VERTEX = /* glsl */ `
#include <begin_vertex>
{
  mat4 im = instanceMatrix;
  vec3 c = im[3].xyz;
  vec3 axis = normalize(im[0].xyz);
  vec3 toward = uProbe.xyz - c;
  toward /= max(length(toward), 1e-4);
  float near = exp(-probeQ(c - uProbe.xyz) * 0.8) * uProbe.w;
  vGlow = near;

#ifdef MEMBRANE
  // Gentle membrane ripple, phase-shifted per cell.
  float rip = sin(position.x * 5.0 + uIdle * 1.1 + aPhase) * sin(position.y * 4.0 - uIdle * 0.8 + aPhase * 1.7);
  transformed *= 1.0 + ${MOT.ripple.toFixed(3)} * uMotion * rip;
#endif

  vec3 p = (im * vec4(transformed, 1.0)).xyz;

#ifdef MEMBRANE
  // A small protrusion on the membrane side facing the probe.
  float facing = smoothstep(0.3, 1.0, dot(normalize(p - c), toward));
  p += toward * (${MOT.protrusion.toFixed(4)} * near * facing * facing);
#endif

  // Follow the gel (sway + parting), crawl along the long axis, migrate towards the probe.
  vec3 delta = swayAt(c) + partAt(c)
    + axis * (${MOT.crawl.toFixed(4)} * uMotion * sin(uIdle * 0.7 + aPhase))
    + toward * (${MOT.cellMigration.toFixed(4)} * near);

  // Entrance: cells grow in as the reveal front passes them.
  float grow = 1.0 - smoothstep(uReveal - 0.3, uReveal, revealDist(c));
  p = c + (p - c) * grow + delta;

  transformed = (inverse(im) * vec4(p, 1.0)).xyz;
}
`;

export function createCellMaterial(shared: SharedUniforms, kind: 'membrane' | 'nucleus') {
  const membrane = kind === 'membrane';
  const C = CONFIG.cells;
  const m = new MeshStandardMaterial({
    color: membrane ? '#ffffff' : C.nucleusColor, // membrane colour comes per instance
    roughness: membrane ? 0.35 : 0.55,
    metalness: 0,
    transparent: membrane,
    depthWrite: !membrane,
  });
  if (membrane) m.defines = { MEMBRANE: '' };
  const fluor = new Color(membrane ? MAT.fluorescence.membrane : MAT.fluorescence.nucleus);
  const extra = { uFluor: { value: fluor } };
  m.onBeforeCompile = (shader) => {
    addUniforms(shader, shared, extra);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${COMMON}\nattribute float aPhase;\nvarying float vGlow;`)
      .replace('#include <begin_vertex>', CELL_VERTEX);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nuniform vec3 uFluor;\nvarying float vGlow;`)
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uFluor, vGlow * 0.85);`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        /* glsl */ `#include <emissivemap_fragment>
        float cellFres = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.2);
        totalEmissiveRadiance += uFluor * vGlow * ${membrane ? '0.5' : '0.7'};
        // Light scattered through the cell body, brighter towards the rim.
        totalEmissiveRadiance += diffuseColor.rgb * (${membrane ? '0.2' : '0.06'} + cellFres * 0.3);`,
      );
    if (membrane)
      // Thin at the centre, so the nucleus shows through; denser towards the rim.
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <opaque_fragment>',
        `diffuseColor.a = mix(${C.membraneOpacity.toFixed(2)}, 0.92, cellFres);\n#include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => `hydrogel-cell-${kind}`;
  return m;
}
