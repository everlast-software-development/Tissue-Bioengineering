/**
 * The Hero hydrogel-composite scene: renderer, lights, meshes, interaction and render loop.
 * Loaded lazily (three.js stays out of the main bundle).
 *
 *   createScaffoldScene()  — builds everything, returns a handle (or null without WebGL 2)
 *   ├─ build()             — runs the generator (Web Worker) and turns its buffers into meshes
 *   ├─ interaction         — pointer parallax + probe (mouse), tap probe (touch)
 *   └─ frame()             — damping, uniforms, adaptive DPR, render; pauses off-screen / hidden
 */
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Mesh,
  PCFShadowMap,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type Material,
} from 'three';
import { CONFIG } from './config';
import type { GenerateOptions, MeshData, ScaffoldData } from './generate';
import { TAN_HALF_FOV, frontDistance } from './layout';
import {
  createCellMaterial,
  createDisplacedDepthMaterial,
  createFibreMaterial,
  createSharedUniforms,
  createStrutMaterial,
} from './materials';

export interface ScaffoldSceneOptions {
  /** Element the canvas is appended to (fills it). */
  container: HTMLElement;
  /** Element whose pointer events drive the scene (the Hero section). */
  host: HTMLElement;
  /** Called once the first frame with geometry has rendered. */
  onReady?: () => void;
}

export interface ScaffoldSceneHandle {
  dispose(): void;
}

const MOT = CONFIG.motion;
const PERF = CONFIG.perf;
const CAM = CONFIG.camera.distance;

/** Exponential smoothing factor for rate k over dt seconds. */
const damp = (k: number, dt: number) => 1 - Math.exp(-k * dt);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/* ── Generation (worker, with an in-thread fallback) ───────────────────── */

function runGenerator(opts: GenerateOptions): { promise: Promise<ScaffoldData>; cancel: () => void } {
  let worker: Worker | null = null;
  const inline = () => import('./generate').then((m) => m.generateScaffold(opts));
  const promise = new Promise<ScaffoldData>((resolve, reject) => {
    try {
      worker = new Worker(new URL('./generate.worker.ts', import.meta.url), { type: 'module' });
    } catch {
      inline().then(resolve, reject);
      return;
    }
    worker.onmessage = (e: MessageEvent<ScaffoldData>) => {
      resolve(e.data);
      worker?.terminate();
      worker = null;
    };
    worker.onerror = (e) => {
      e.preventDefault();
      worker?.terminate();
      worker = null;
      inline().then(resolve, reject);
    };
    worker.postMessage(opts);
  });
  return { promise, cancel: () => worker?.terminate() };
}

function toGeometry(d: MeshData) {
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(d.position, 3));
  g.setAttribute('aAnchor', new BufferAttribute(d.anchor, 3));
  g.setAttribute('normal', new BufferAttribute(d.normal, 3));
  g.setAttribute('color', new BufferAttribute(d.color, 3));
  g.setIndex(new BufferAttribute(d.index, 1)); // Uint32 indices
  g.computeBoundingSphere();
  return g;
}

/* ── Scene ─────────────────────────────────────────────────────────────── */

export function createScaffoldScene({ container, host, onReady }: ScaffoldSceneOptions): ScaffoldSceneHandle | null {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;opacity:0;transition:opacity .6s ease';

  // Create the context ourselves: without WebGL 2 we bail out quietly (three would log errors first),
  // and the section's plain background stays.
  let renderer: WebGLRenderer;
  try {
    const context = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    if (!context) return null;
    renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: true });
  } catch {
    return null;
  }
  container.appendChild(canvas);

  const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarseMq = window.matchMedia('(pointer: coarse)');
  let reduced = reduceMq.matches;

  const viewport = () => {
    const r = container.getBoundingClientRect();
    return { w: Math.max(1, Math.round(r.width)), h: Math.max(1, Math.round(r.height)) };
  };
  const modeFor = (w: number, h: number) => {
    const aspect = w / h;
    const stacked = w < 1024; // the Hero's lg breakpoint
    const lowPower = coarseMq.matches || w < 768;
    return { aspect, stacked, lowPower, coverageAspect: stacked ? aspect : Math.max(aspect, CONFIG.volume.minCoverageAspect) };
  };

  let { w, h } = viewport();
  let mode = modeFor(w, h);

  /* Renderer */
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = CONFIG.renderer.exposure;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.type = PCFShadowMap; // r187: PCF is soft (Vogel disk); PCFSoft was removed
  const dprCap = Math.min(window.devicePixelRatio || 1, mode.lowPower ? CONFIG.mobile.dprCap : PERF.dprCap);
  let dpr = dprCap;
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);

  /* Scene, camera, fog */
  const scene = new Scene();
  scene.fog = new Fog(CONFIG.fog.color, CONFIG.fog.near, CONFIG.fog.far);
  const camera = new PerspectiveCamera(CONFIG.camera.fov, w / h, CONFIG.camera.near, CONFIG.camera.far);
  camera.position.set(0, 0, CAM);
  const network = new Group(); // object space of the scaffold; pivot at the origin
  scene.add(network);

  /* Lights */
  const L = CONFIG.lights;
  scene.add(new HemisphereLight(L.hemisphere.sky, L.hemisphere.ground, L.hemisphere.intensity));
  const key = new DirectionalLight('#ffffff', L.key.intensity);
  key.position.set(...L.key.position);
  const sh = key.shadow;
  sh.mapSize.set(L.key.shadowMapSize, L.key.shadowMapSize);
  sh.radius = L.key.shadowRadius;
  sh.bias = -0.0004;
  sh.normalBias = 0.012;
  Object.assign(sh.camera, { left: -5.5, right: 5.5, top: 4, bottom: -4, near: 0.5, far: 16 });
  sh.camera.updateProjectionMatrix();
  const rim = new DirectionalLight(L.rim.color, L.rim.intensity);
  rim.position.set(...L.rim.position);
  const bounce = new DirectionalLight(L.bounce.color, L.bounce.intensity);
  bounce.position.set(...L.bounce.position);
  scene.add(key, rim, bounce);

  const setShadows = (on: boolean) => {
    renderer.shadowMap.enabled = on;
    key.castShadow = on;
    renderer.shadowMap.needsUpdate = true;
    // Materials must recompile for the shadow defines.
    for (const m of materials) m.needsUpdate = true;
  };

  /* Materials */
  const shared = createSharedUniforms();
  const strutMat = createStrutMaterial(shared);
  const strutDepth = createDisplacedDepthMaterial(shared);
  const fibreMat = createFibreMaterial(shared);
  const membraneMat = createCellMaterial(shared, 'membrane');
  const nucleusMat = createCellMaterial(shared, 'nucleus');
  const materials: Material[] = [strutMat, fibreMat, membraneMat, nucleusMat, strutDepth];
  const [segW, segH] = mode.lowPower ? CONFIG.cells.segments.mobile : CONFIG.cells.segments.desktop;
  const cellSphere = new SphereGeometry(1, segW, segH);
  const shadowsWanted = !(mode.lowPower && !CONFIG.mobile.shadows);
  setShadows(shadowsWanted);

  /* ── Build / rebuild from generated data ─────────────────────────────── */

  let built: { meshes: (Mesh | InstancedMesh)[]; revealRadius: number; key: string } | null = null;
  let pending: ReturnType<typeof runGenerator> | null = null;
  let disposed = false;
  let revealStart = -1;
  const modeKey = (m: typeof mode) => `${m.stacked}|${m.lowPower}|${m.coverageAspect.toFixed(2)}`;

  const clearBuilt = () => {
    if (!built) return;
    for (const m of built.meshes) {
      network.remove(m);
      m.geometry.dispose();
      if (m instanceof InstancedMesh) m.dispose();
    }
    built = null;
  };

  const build = () => {
    pending?.cancel();
    const opts: GenerateOptions = { ...mode };
    const job = runGenerator(opts);
    pending = job;
    const k = modeKey(mode);
    job.promise
      .then((data) => {
        if (disposed || pending !== job) return;
        pending = null;
        clearBuilt();
        const meshes: (Mesh | InstancedMesh)[] = [];

        const struts = new Mesh(toGeometry(data.struts), strutMat);
        struts.customDepthMaterial = strutDepth;
        struts.castShadow = true;
        struts.receiveShadow = true;
        struts.frustumCulled = false; // the volume always overlaps the view
        meshes.push(struts);

        const fibres = new Mesh(toGeometry(data.fibres), fibreMat);
        fibres.receiveShadow = true;
        fibres.frustumCulled = false;
        meshes.push(fibres);

        const n = data.cells.count;
        if (n > 0) {
          const phase = new InstancedBufferAttribute(data.cells.phase, 1);
          const nucGeo = cellSphere.clone();
          nucGeo.setAttribute('aPhase', phase);
          const memGeo = cellSphere.clone();
          memGeo.setAttribute('aPhase', phase);
          const nucleus = new InstancedMesh(nucGeo, nucleusMat, n);
          const membrane = new InstancedMesh(memGeo, membraneMat, n);
          const mtx = new Matrix4();
          const col = new Color();
          const palette = CONFIG.cells.membraneColors.map((c) => new Color(c));
          for (let i = 0; i < n; i++) {
            nucleus.setMatrixAt(i, mtx.fromArray(data.cells.nucleus, i * 16));
            membrane.setMatrixAt(i, mtx.fromArray(data.cells.membrane, i * 16));
            membrane.setColorAt(i, col.copy(palette[data.cells.palette[i]]));
          }
          for (const m of [nucleus, membrane]) {
            m.frustumCulled = false;
            m.receiveShadow = true;
          }
          nucleus.renderOrder = 1;
          membrane.renderOrder = 2; // after the opaque nuclei, so they show through
          meshes.push(nucleus, membrane);
        }

        for (const m of meshes) network.add(m);
        shared.uFocus.value.set(...data.focus);
        built = { meshes, revealRadius: data.revealRadius, key: k };
        revealStart = -1; // starts on the next frame
        if (import.meta.env.DEV) console.debug('[hydrogel]', data.stats);
        kick();
      })
      .catch(() => {
        /* Generation failed: leave the plain background. */
      });
  };

  /* ── Interaction ─────────────────────────────────────────────────────── */

  const pointer = { x: 0, y: 0, inside: false, isMouse: false };
  const tilt = { x: 0, y: 0 }; // smoothed pointer NDC used for parallax
  let tapUntil = -1;
  let probeStrength = 0;
  let probeSnap = true; // jump to the first probe position instead of sweeping across
  const probeObj = new Vector3();
  const probeTarget = new Vector3();
  const tmp = new Vector3();

  const toNdc = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    toNdc(e);
    pointer.inside = true;
    pointer.isMouse = true;
    kick();
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    pointer.inside = false;
    kick();
  };
  let down: { x: number; y: number; t: number } | null = null;
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch') down = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onUp = (e: PointerEvent) => {
    if (e.pointerType !== 'touch' || !down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    if (moved < 12 && performance.now() - down.t < 500) {
      toNdc(e);
      pointer.isMouse = false;
      if (probeStrength < 0.05) probeSnap = true;
      tapUntil = performance.now() + MOT.tapDuration * 1000;
      kick();
    }
    down = null;
  };
  host.addEventListener('pointermove', onMove, { passive: true });
  host.addEventListener('pointerleave', onLeave, { passive: true });
  host.addEventListener('pointerdown', onDown, { passive: true });
  host.addEventListener('pointerup', onUp, { passive: true });

  /** Pointer NDC → object-space point a little behind the network front along the pointer ray. */
  const probePoint = (nx: number, ny: number, out: Vector3) => {
    const d = Math.min(CONFIG.volume.back - 1, frontDistance(nx, ny, mode.stacked) + MOT.probeDepthOffset);
    out.set(nx * TAN_HALF_FOV * camera.aspect * d, ny * TAN_HALF_FOV * d, CAM - d);
    return network.worldToLocal(out);
  };

  /* ── Render loop ─────────────────────────────────────────────────────── */

  let raf = 0;
  let last = -1;
  let onScreen = true;
  let contextLost = false;
  let shownCanvas = false;
  const frameTimes: number[] = [];
  let goodWindows = 0;
  let slowWindows = 0;
  let lastDprChange = 0;
  let failedDpr = Infinity;

  const canRun = () => onScreen && !document.hidden && !contextLost && !disposed;
  function kick() {
    if (!raf && canRun()) {
      last = -1;
      raf = requestAnimationFrame(frame);
    }
  }

  const adaptResolution = (now: number, dt: number) => {
    frameTimes.push(dt * 1000);
    if (frameTimes.length < PERF.sampleFrames) return;
    const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    frameTimes.length = 0;
    if (avg > PERF.slowFrameMs) {
      goodWindows = 0;
      slowWindows++;
      if (dpr > PERF.dprMin + 1e-3) {
        failedDpr = dpr;
        dpr = Math.max(PERF.dprMin, dpr - PERF.dprStep);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        lastDprChange = now;
      } else if (renderer.shadowMap.enabled && slowWindows > 2) {
        setShadows(false); // still slow at the lowest resolution: drop the shadow pass
      }
    } else if (avg < PERF.fastFrameMs + 2.5) {
      slowWindows = 0;
      goodWindows++;
      // Step back up slowly, and not straight back to a level that was too slow.
      const next = Math.min(dprCap, dpr + PERF.dprStep);
      const cooled = now - lastDprChange > 8000;
      if (goodWindows >= 3 && next > dpr + 1e-3 && (next < failedDpr - 1e-3 || cooled)) {
        dpr = next;
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        lastDprChange = now;
        goodWindows = 0;
        if (cooled) failedDpr = Infinity;
      }
    }
  };

  function frame(now: number) {
    raf = 0;
    if (!canRun()) return;
    const dt = last < 0 ? 1 / 60 : Math.min(0.1, (now - last) / 1000);
    last = now;
    reduced = reduceMq.matches;

    // Probe: mouse hovering the Hero, or a recent tap.
    const tapping = now < tapUntil;
    const probing = (pointer.inside && pointer.isMouse) || tapping;
    const prevStrength = probeStrength;
    probeStrength += ((probing ? 1 : 0) - probeStrength) * damp(MOT.probeFade, dt);

    // Parallax: damped tilt towards the pointer (mouse only; a tap leans in gently).
    const tx = pointer.isMouse && pointer.inside ? pointer.x : tapping ? pointer.x * 0.35 : 0;
    const ty = pointer.isMouse && pointer.inside ? pointer.y : tapping ? pointer.y * 0.35 : 0;
    const prevTilt = tilt.x + tilt.y;
    tilt.x += (tx - tilt.x) * damp(MOT.tiltDamping, dt);
    tilt.y += (ty - tilt.y) * damp(MOT.tiltDamping, dt);

    // Idle clock: slows by ~75 % while probing; stopped with reduced motion.
    if (!reduced) shared.uIdle.value += dt * (1 - MOT.idleSlowdown * probeStrength);
    shared.uMotion.value = reduced ? 0 : 1;
    const idle = shared.uIdle.value;
    const driftYaw = reduced ? 0 : MOT.driftYaw * Math.sin(idle * MOT.driftSpeed * 2 * Math.PI * 0.35);
    const driftPitch = reduced ? 0 : MOT.driftPitch * Math.sin(idle * MOT.driftSpeed * 2 * Math.PI * 0.27 + 1.3);
    network.rotation.set(-tilt.y * MOT.tiltPitch + driftPitch, tilt.x * MOT.tiltYaw + driftYaw, 0);
    network.position.set(tilt.x * MOT.tiltTranslate, tilt.y * MOT.tiltTranslate, 0);
    network.updateMatrixWorld();

    // Probe point (object space), damped; view axis in object space.
    if (probing) {
      probePoint(pointer.x, pointer.y, probeTarget);
      if (probeSnap) {
        probeObj.copy(probeTarget);
        probeSnap = false;
      } else probeObj.lerp(probeTarget, damp(MOT.probeDamping, dt));
    } else if (probeStrength < 0.01) probeSnap = true;
    shared.uProbe.value.set(probeObj.x, probeObj.y, probeObj.z, probeStrength);
    shared.uViewAxis.value.copy(network.worldToLocal(tmp.copy(camera.position))).normalize();

    // Entrance reveal (once per build).
    let revealing = false;
    if (built) {
      if (revealStart < 0) revealStart = now;
      const t = reduced ? 1 : Math.min(1, (now - revealStart) / (MOT.revealDuration * 1000));
      shared.uReveal.value = t >= 1 ? 1e3 : easeInOutCubic(t) * built.revealRadius;
      revealing = t < 1;
    }

    renderer.render(scene, camera);
    if (built && !shownCanvas) {
      shownCanvas = true;
      canvas.style.opacity = '1';
      onReady?.();
    }

    if (!reduced) adaptResolution(now, dt);

    // Keep animating: always with motion; with reduced motion only until the hover response settles.
    const settling =
      Math.abs(probeStrength - prevStrength) > 1e-4 ||
      Math.abs(tilt.x + tilt.y - prevTilt) > 1e-5 ||
      (probing && probeObj.distanceToSquared(probeTarget) > 1e-8) ||
      tapping ||
      revealing ||
      !built;
    if (!reduced || settling) raf = requestAnimationFrame(frame);
  }

  /* ── Visibility, resize, context loss ────────────────────────────────── */

  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen) kick();
  });
  io.observe(host);
  const onVis = () => kick();
  document.addEventListener('visibilitychange', onVis);
  const onReduce = () => kick();
  reduceMq.addEventListener('change', onReduce);

  let rebuildTimer = 0;
  const ro = new ResizeObserver(() => {
    const v = viewport();
    if (v.w === w && v.h === h) return;
    ({ w, h } = v);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Regenerate only when the layout mode or the needed coverage changes (window resize / rotation).
    const next = modeFor(w, h);
    const needs =
      next.stacked !== mode.stacked ||
      next.lowPower !== mode.lowPower ||
      (next.stacked ? Math.abs(next.aspect - mode.aspect) > 0.12 : next.coverageAspect > mode.coverageAspect + 0.02);
    if (needs) {
      mode = next;
      window.clearTimeout(rebuildTimer);
      rebuildTimer = window.setTimeout(build, 350);
    }
    kick();
  });
  ro.observe(container);

  const onLost = (e: Event) => {
    e.preventDefault();
    contextLost = true;
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const onRestored = () => {
    contextLost = false;
    kick();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  build();
  kick();

  // Dev-only handle for the verification harness (stripped from production builds).
  if (import.meta.env.DEV)
    (window as unknown as Record<string, unknown>).__hydrogel = {
      renderer,
      scene,
      camera,
      key,
      shared,
      setShadows,
      get dpr() {
        return dpr;
      },
      get stats() {
        return renderer.info.render;
      },
    };

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(rebuildTimer);
      pending?.cancel();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      reduceMq.removeEventListener('change', onReduce);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      clearBuilt();
      cellSphere.dispose();
      for (const m of materials) m.dispose();
      key.shadow.map?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}

