# Image Asset Sources

Where locally hosted images came from, and why some earlier images were removed.

## Localized from Unsplash

This image was downloaded from the Unsplash CDN at 1200px wide, uncropped, so the composition matches what the site showed before. It was then re-encoded as WebP (quality 0.78). It renders with the same CSS boxes and `object-cover` as before.

| Local file | Size | Source URL (as previously referenced) | Subject | Used in |
|---|---|---|---|---|
| `public/images/surgical-team-operating-room.webp` | 1200×1200, 99 KB | https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80 | Surgical team in scrubs and masks, viewed from the operating table | Home timeline row 01 (Burn Scar Complications), Home clinical-cases slider (case-1), Services page (burn scar service), Case Studies (cs-2), `research.ts` (unrendered) |

## Replaced with licensed stock images (2026-11-19)

These replace earlier images that showed people. Each licence was read on the image's own page on 2026-11-19. Both licences allow free commercial use on a website, with no attribution required. Neither image is a premium, sponsored or paid asset. The full-resolution originals and the processing script are kept outside the repo in the image-work folder.

| Local file | Final size | Source page | Creator | Licence | Processing | Used in |
|---|---|---|---|---|---|---|
| `public/images/diabetic-foot-examination.webp` | 1400×930, 34.5 KB | https://unsplash.com/photos/x-ray-of-human-feet-against-a-black-background-IhGonjnG148 (original 6144×3456, a 3D render) | Rohit Choudhari (https://unsplash.com/@iamrohitchoudhari) | Unsplash License, "Free to use under the Unsplash License" (https://unsplash.com/license) | Right-weighted 3:2 crop (x 960–6144) so the right foot sits in the Services `66% 62%` square crop; small hue shift toward cyan; WebP q86 | Services 02 (diabetic foot), Home timeline row 02, Home clinical-cases slider (case-2) |
| `public/images/biomedical-research-laboratory.webp` | 1200×800, 48.7 KB | https://www.pexels.com/photo/equipment-inside-a-laboratory-9574569/ (original 5590×3727) | Tima Miroshnichenko (https://www.pexels.com/@tima-miroshnichenko/) | Pexels License, marked "Free" (https://www.pexels.com/license/) | Full frame; brightness and saturation lowered slightly, cooled slightly toward teal; WebP q80 | Technologies tech-2 (Home + Technologies page), Article 2 cover (Home Featured Articles, Articles list, Article detail), `research.ts` (unrendered) |

The replaced originals were "Physician examining the foot of a patient with diabetes" and "Researcher in a biomedical lab lined with benchtop analyzers" (Unsplash `photo-1579154204601-01588f351e67`).

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

The `coverImage` values in `src/data/research.ts` other than the two above still point at Unsplash. No component renders `ResearchPaper.coverImage`, so nobody sees them. `photo-1581093458791-9f3c3900df4b` (paper `res-5`) returns HTTP 404.
