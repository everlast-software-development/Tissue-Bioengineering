# Image Asset Sources

Where locally hosted images came from, and why some earlier images were removed.

## Replaced with licensed stock images (2026-11-19)

These replace earlier images that showed people. Each licence was read on the image's own page on 2026-11-19. Every licence below allows commercial use on a website. None of the images is a premium, sponsored or paid asset. The full-resolution originals, the processing scripts (`tools/process.js`, `tools/process-round2.js`) and a provenance log are kept outside the repo in the image-work folder (`approved/PROVENANCE.md`).

Two images (`cell-culture-biosafety-cabinet.webp`, `bioprinting-laboratory.webp`) **require attribution**, and one of them is share-alike. See [Attribution required](#attribution-required) below.

| Local file | Final size | Source page | Creator | Licence | Processing | Used in |
|---|---|---|---|---|---|---|
| `public/images/diabetic-foot-examination.webp` | 1400×930, 34.5 KB | https://unsplash.com/photos/x-ray-of-human-feet-against-a-black-background-IhGonjnG148 (original 6144×3456, a 3D render) | Rohit Choudhari (https://unsplash.com/@iamrohitchoudhari) | Unsplash License, "Free to use under the Unsplash License" (https://unsplash.com/license) | Right-weighted 3:2 crop (x 960–6144) so the right foot sits in the Services `66% 62%` square crop; small hue shift toward cyan; WebP q86 | Services 02 (diabetic foot), Home timeline row 02, Home clinical-cases slider (case-2) |
| `public/images/biomedical-research-laboratory.webp` | 1200×800, 48.7 KB | https://www.pexels.com/photo/equipment-inside-a-laboratory-9574569/ (original 5590×3727) | Tima Miroshnichenko (https://www.pexels.com/@tima-miroshnichenko/) | Pexels License, marked "Free" (https://www.pexels.com/license/) | Full frame; brightness and saturation lowered slightly, cooled slightly toward teal; WebP q80 | Technologies tech-2 (Home + Technologies page), Article 2 cover (Home Featured Articles, Articles list, Article detail), `research.ts` (unrendered) |

| `public/images/surgical-team-operating-room.webp` | 1200×1200, 36.7 KB | https://www.pexels.com/photo/operating-table-inside-a-room-7108118/ (original 5473×3654) | Pavel Danilyuk (https://www.pexels.com/@pavel-danilyuk/) | Pexels License, marked "Free" (https://www.pexels.com/license/); no attribution required | Square crop (x 1250–4904) keeping the surgical light, table and laser; darkened, slightly desaturated, cooled toward teal; WebP q80 | Services 01 (burn scar), Case Studies cs-2, `research.ts` (unrendered) |
| `public/images/diabetic-foot-assessment.webp` | 1200×600, 29.7 KB | https://unsplash.com/photos/blue-and-brown-ceramic-vase-_W94Eb1iNYc (original 5184×3456; page title is wrong, tags confirm a foot anatomy model) | Anne Nygård (https://unsplash.com/@polarmermaid) | Unsplash License, "Free to use under the Unsplash License" (https://unsplash.com/license); no attribution required | 2:1 crop (y 350–3402), plain black background mirror-extended 460 px each side so toe and heel stay inside the narrow card crops; slight desaturation; WebP q84. The model's small printed reference numbers are part of the teaching model and were left | Article 3 cover (Home Featured Articles, Articles list, Article detail) |
| `public/images/stem-cell-culture-flasks.webp` | 1200×800, 50.0 KB | https://commons.wikimedia.org/wiki/File:Celcultuuroven.JPG (original 2560×1920) | Biol (Wikimedia Commons user) | Public domain (PD-self: released worldwide "for any purpose"); no attribution required | 3:2 crop from the top (drops a bottom strip); warm cast cooled, darkened; WebP q82 | Services 07 (stem cell), Home timeline row 06, Home clinical-cases slider (case-7), Case Studies cs-1 |
| `public/images/cell-culture-biosafety-cabinet.webp` | 1600×1066, 107.3 KB | https://commons.wikimedia.org/wiki/File:UV_Sterilisation.jpg (original 6000×4000) | Orla Keogh | **CC BY 4.0** (https://creativecommons.org/licenses/by/4.0/); attribution required | Full frame resized; a readable equipment brand wordmark above the cabinet was cloned out with adjacent plain background; blacks restored, slight desaturation; WebP q80 | About page hero |
| `public/images/bioprinting-laboratory.webp` | 1200×800, 22.0 KB | https://commons.wikimedia.org/wiki/File:Bioprinting.jpg (original 5796×3966; VRT permission ticket #2019030410006517) | Philip Ezze | **CC BY-SA 4.0** (https://creativecommons.org/licenses/by-sa/4.0/); attribution and share-alike required | 3:2 crop (y 40–3904); darkened, desaturated, cooled toward teal; WebP q82 | Technologies tech-1 (Home + Technologies page), Article 1 cover (Home Featured Articles, Articles list, Article detail), Home clinical-cases slider (case-8) |

The replaced originals were "Physician examining the foot of a patient with diabetes" and "Researcher in a biomedical lab lined with benchtop analyzers" (Unsplash `photo-1579154204601-01588f351e67`). The 2026-11-19 second round replaced a surgical team seen from the operating table (Unsplash `photo-1579684385127-1ef15d508118`), a clinician examining a diabetic patient's foot, a scientist handling flasks in a biosafety cabinet, a scientist working in a biosafety cabinet, and a researcher operating a 3D bioprinter (NIH/NCATS "3-D Bioprinting"). Byte-identical copies of all replaced files are in the image-work folder (`originals/`).

### Attribution required

CC BY and CC BY-SA require a credit that viewers can reasonably find, a link to the licence, and a note that the image was changed. The site does not yet show image credits anywhere. **Before publishing**, add these lines to a credits location (for example a footer "Image credits" link or the page where the image appears):

- About page hero: "UV Sterilisation" by Orla Keogh, via Wikimedia Commons (https://commons.wikimedia.org/wiki/File:UV_Sterilisation.jpg), licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Cropped, retouched and colour-graded.
- Bioprinter image (Technologies, Article 1, Home): "Bioprinting" by Philip Ezze, via Wikimedia Commons (https://commons.wikimedia.org/wiki/File:Bioprinting.jpg), licensed CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Cropped and colour-graded; this modified version is also available under CC BY-SA 4.0.

Share-alike applies to the modified image only, not to the rest of the site.

## Removed: stock portraits of named team members

These stock photographs showed people who are not on the team. They were captioned as named staff, which is misleading. The About page now shows initials avatars until authentic, approved headshots are supplied. Do not replace them with stock or AI-generated portraits.

| Was shown as | Former source |
|---|---|
| Dr. Aris Thorne | https://images.unsplash.com/photo-1622253692010-333f2da6031d (the subject's scrubs carry another person's embroidered name) |
| Dr. Elena Rostova | `public/images/team-elena-rostova.webp` (stock portrait; the unreferenced file was deleted on 2026-11-10) |
| Dr. Michael Chen | https://images.unsplash.com/photo-1537368910025-700350fe46c7 |

The article author `avatar` fields that pointed at these images were removed as well. The field is now optional and is not rendered anywhere.

## Brand icons

| File | Origin |
|---|---|
| `public/apple-touch-icon.png` (180×180 PNG) | The existing mark from `public/images/tissuebioengineering-favicon-150x150.webp`, centered with a 28px inset on the brand navy `#0B1F3A`. The background is opaque because iOS fills transparent touch-icon pixels with black. |
| `public/images/tissuebioengineering-favicon-150x150.webp` | Unchanged; still the browser favicon. |

## Still remote (not rendered)

The `coverImage` values in `src/data/research.ts` other than the two local files above (`surgical-team-operating-room.webp`, `biomedical-research-laboratory.webp`) still point at Unsplash. No component renders `ResearchPaper.coverImage`, so nobody sees them. `photo-1581093458791-9f3c3900df4b` (paper `res-5`) returns HTTP 404.
