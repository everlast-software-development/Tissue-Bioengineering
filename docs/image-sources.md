# Image Asset Sources

Where locally hosted images came from, and why some earlier images were removed.

## Localized from Unsplash

Both images were downloaded from the Unsplash CDN at 1200px wide, uncropped, so the composition matches what the site showed before. They were then re-encoded as WebP (quality 0.78). They render with the same CSS boxes and `object-cover` as before.

| Local file | Size | Source URL (as previously referenced) | Subject | Used in |
|---|---|---|---|---|
| `public/images/surgical-team-operating-room.webp` | 1200×1200, 99 KB | https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80 | Surgical team in scrubs and masks, viewed from the operating table | Home timeline row 01 (Burn Scar Complications), Home clinical-cases slider (case-1), Services page (burn scar service), Case Studies (cs-2), `research.ts` (unrendered) |
| `public/images/biomedical-research-laboratory.webp` | 1200×800, 83.5 KB | https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80 | Researcher in a biomedical lab lined with benchtop analyzers | Article cover for "Cell-Free Regenerative Therapies: Stem Cell Exosomes Explained", `research.ts` (unrendered) |

## Removed: stock portraits of named team members

These stock photographs showed people who are not on the team. They were captioned as named staff, which is misleading. The About page now shows initials avatars until authentic, approved headshots are supplied. Do not replace them with stock or AI-generated portraits.

| Was shown as | Former source |
|---|---|
| Dr. Aris Thorne | https://images.unsplash.com/photo-1622253692010-333f2da6031d (the subject's scrubs carry another person's embroidered name) |
| Dr. Elena Rostova | `public/images/team-elena-rostova.webp` (stock portrait; the file is no longer referenced) |
| Dr. Michael Chen | https://images.unsplash.com/photo-1537368910025-700350fe46c7 |

The article author `avatar` fields that pointed at these images were removed as well. The field is now optional and is not rendered anywhere.

## Brand icons

| File | Origin |
|---|---|
| `public/apple-touch-icon.png` (180×180 PNG) | The existing mark from `public/images/tissuebioengineering-favicon-150x150.webp`, centered with a 28px inset on the brand navy `#0B1F3A`. The background is opaque because iOS fills transparent touch-icon pixels with black. |
| `public/images/tissuebioengineering-favicon-150x150.webp` | Unchanged; still the browser favicon. |

## Still remote (not rendered)

The `coverImage` values in `src/data/research.ts` other than the two above still point at Unsplash. No component renders `ResearchPaper.coverImage`, so nobody sees them. `photo-1581093458791-9f3c3900df4b` (paper `res-5`) returns HTTP 404.
