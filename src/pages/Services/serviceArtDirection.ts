import type { Service } from '@/types';

/**
 * How strongly an image is graded toward the page's navy/teal palette (see .svc-media in
 * index.css). Micrographs keep their stain colors because the colors carry the science.
 * - `photo`: clinical/lab photography; desaturated and toned teal.
 * - `micrograph`: stained or false-colored microscopy; only dimmed slightly.
 * - `brightfield`: light-field microscopy on a white background; the white is toned down.
 * - `false-color`: an SEM whose color was added for contrast (it carries no stain meaning), so its
 *   hue is shifted from violet to the palette's blue and softened.
 */
export type ImageGrade = 'photo' | 'micrograph' | 'brightfield' | 'false-color';

/**
 * Per-image treatment. Frame size and aspect ratio are deliberately not here: the layouts in
 * ServiceCard.tsx set them, so every alternating section (02–07) uses the identical frame and
 * only the crop position differs per image.
 */
export interface ArtDirection {
  grade: ImageGrade;
  /** CSS object-position: keeps the subject in frame inside the shared crop. */
  position: string;
  /** Intrinsic size of the file. */
  width: number;
  height: number;
}

const FALLBACK: ArtDirection = {
  grade: 'photo',
  position: '50% 50%',
  width: 1200,
  height: 900,
};

/** Per-therapy image composition, keyed by service slug. */
const ART_DIRECTION: Record<string, ArtDirection> = {
  'burn-scar-treatment': {
    grade: 'photo',
    position: '50% 50%',
    width: 1200,
    height: 1200,
  },
  'diabetic-foot-ulcer-regeneration': {
    grade: 'photo',
    position: '66% 62%',
    width: 1400,
    height: 930,
  },
  'wound-healing-biomaterials': {
    grade: 'false-color',
    position: '45% 50%',
    width: 900,
    height: 798,
  },
  'scar-management-therapeutics': {
    grade: 'micrograph',
    position: '30% 50%',
    width: 1000,
    height: 748,
  },
  'facial-palsy-nerve-reconstruction': {
    grade: 'brightfield',
    position: '50% 50%',
    width: 1200,
    height: 677,
  },
  'facial-asymmetry-reconstruction': {
    grade: 'photo',
    position: '72% 50%',
    width: 1200,
    height: 600,
  },
  'regenerative-stem-cell-medicine': {
    grade: 'photo',
    position: '58% 50%',
    width: 1200,
    height: 800,
  },
};

export const getArtDirection = (service: Service): ArtDirection =>
  ART_DIRECTION[service.slug] ?? FALLBACK;
