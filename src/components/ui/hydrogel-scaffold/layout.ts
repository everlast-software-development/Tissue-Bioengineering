import { CONFIG } from './config';

/**
 * Screen layout shared by the generator and the scene: where the copy sits, where the network
 * comes closest to the camera, and where the visual focus is. All in NDC of the resting camera
 * (x right, y up, -1…1).
 */

export const TAN_HALF_FOV = Math.tan((CONFIG.camera.fov * Math.PI) / 360);

export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 1 behind the copy, 0 on the focal side. Side-by-side layout: copy on the left; stacked: at the bottom. */
export function copyWeight(nx: number, ny: number, stacked: boolean): number {
  // Wide, gentle transitions: under tilt a narrow one would read as a cliff in the network.
  return stacked ? smoothstep(0.4, -0.6, ny) : smoothstep(0.5, -0.65, nx);
}

/** Distance from the camera at which the network begins along the ray through (nx, ny). */
export function frontDistance(nx: number, ny: number, stacked: boolean): number {
  return lerp(CONFIG.volume.frontNear, CONFIG.volume.frontFar, copyWeight(nx, ny, stacked));
}

export function focusNdc(stacked: boolean) {
  return stacked ? CONFIG.focus.mobile : CONFIG.focus.desktop;
}
