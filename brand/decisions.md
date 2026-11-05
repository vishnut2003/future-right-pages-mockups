# Design decisions log

Dated record of assumptions and reference-derived choices. Newest first. Update when the client confirms or overrules.

## 2026-11-05 — Home v2 (`designs/v2/home/`)

**Why a second direction.** Client message (relayed via Aditya Kumar, 2026-11-05) narrowed the references to two:
facet.com ("We like the crisp look with contrast color") and ethos.com ("Like the placement of contents, with
background videos, testimonials"), plus the MoU §7 notes for both. v1 was Facet only and had no video, so v2 is a new
direction. v1 is untouched. Neither MoU design round is used: v1 was never sent for review.

**References used.** `referance-websites/facet.com/facet.com_.png` and new captures
`referance-websites/ethos.com/ethos.com_desktop-1440.png` and `ethos.com_mobile-500.png` (headless Edge, 2026-11-05;
ethos.com is not geo-blocked). No copy, logos, colours, photos or video from either site were used. Note: the MoU
lists Ethos for the Life & Family Protection page and calculator; the client is now also using it for Home layout.

**Look, from Facet (crisp contrast).** Two tones and one accent: near-black `#0d141a` against clean white, amber
`#f0a030` as the single accent. Hairline borders instead of glows and gradients. Pill buttons. Large confident
headlines.

**Layout, from Ethos (placement of contents).**
- Full-bleed background video hero, centred headline with an italic serif accent line, wide arrow button, three
  laurel badges under the button, transparent header that turns solid on scroll.
- Client stories directly under the hero: one featured photo card plus review cards in a row that scrolls sideways.
- Split rows: big statement and button on the left, stacked items on the right (Who we help).
- "How it works" as a 1/3, 2/3, 3/3 stepper beside a media panel. It advances by itself and each step can be clicked.
- A rounded media card with a headline on the left and question cards on the right (second background video). This
  also covers Facet's "sample money questions".
- A rounded tinted card for the free guide, with a tilted cover mock.
- Two-column FAQ, title left and accordion right. The life-cover answer links to the Life Insurance Needs Calculator
  (MoU: "calculator linked from FAQs").
- Full-width dark footer with the disclosures block.

**Palette (user decision 2026-11-05: brand colours, sharper; no logo blue).**

| Role | Value | Note |
|---|---|---|
| Ink: dark sections, dark buttons, body text | `#0d141a` | unchanged from v1 |
| Paper: main light background | `#ffffff` | replaces v1's cream `#fbf6ee` |
| Soft background (Who we help, Join band, booking side panel) | `#f5f3ef` | neutral warm grey |
| Cream tint (guide card, available calendar days) | `#fff5e4` / `#ffeacc` | cream kept as a small tint only |
| Accent and primary CTA | `#f0a030` with ink text | 8.8:1 contrast; one CTA colour on light and dark |
| Accent words in headings on white, icons, stars | `#cc6333` | large text and graphics only (3.9:1) |
| Small orange text on white (links, eyebrows) | `#b4552a` | 4.9:1 |

The primary CTA is amber with dark text rather than burnt orange with white text. White on `#cc6333` is 3.9:1, below
the 4.5:1 baseline, and amber stays visible over the video.

**Typography.** Outfit 400/500/600 for headings and body, as in v1. Lora italic for the accent line in each heading
(Ethos sets its accent words in an italic serif; Facet colours them). Review quotes are set in Outfit, not Lora.

**Background video.** Two muted, looping clips, 1280x720, 10 seconds, about 1 MB each, stored in
`designs/v2/home/video/` with poster JPGs so the page works offline.

| File | Source | Licence |
|---|---|---|
| `hero.mp4` | Pexels video 7677030, "Family Bonding Time in the Park" (uploader shown as @kampus) | Pexels Licence: free to use, no attribution required |
| `begin.mp4` | Pexels video 8208434, "A Family Walking by a Lake in a Park" (uploader shown as @rdne) | Pexels Licence: free to use, no attribution required |

- Pexels terms to respect: identifiable people may not be shown in a bad light, and the footage must not imply that
  the people in it endorse the product. Keep the clips as background only, never beside a testimonial.
- Mixkit was tried first and rejected: its video downloads are now "personal use only" (Mixkit Restricted License).
- Behaviour: a clip plays only while on screen, each has a pause/play button, and visitors who prefer reduced motion
  see the poster until they press play. A dark scrim keeps text contrast on any frame.
- The clips also play on phones in the mockup so the client can see them there. For the live build, decide between
  video and poster-only on phones (MoU target: 85+ mobile PageSpeed).
- Video shoots are outside the MoU, so the live site needs licensed stock or client-supplied footage.

**Header logo.** The logo file is the full lock-up (mark plus blue wordmark). The header, drawer, footer and guide
cover show the mark only, cropped in CSS, with "Future Right / Financials" set in type beside it. The file itself is
not edited. Ask the client for mark-only and white source files.
- Header (user request 2026-11-05): the mark is white with no tile while the header is transparent over the video,
  and switches to full colour when the header turns solid on scroll. The white version is a CSS filter on the same
  file.
- Drawer, footer and guide cover: orange mark on a white tile.

**Hero fills the first screen (user request 2026-11-05).** The hero is exactly one screen tall (`100svh`, capped at
1080px), and its headline size and spacing scale with the screen height so the headline, button and three badges all
sit above the fold. Checked from 1920x910 down to 1280x600 on desktop and 430x780 down to 320x568 on phones.
- On phones the hero leaves room for the sticky bar, and the video pause button sits beside "See how it works".
- On short phone screens the badge sub-lines are hidden (under 700px tall) and then the badges (under 620px tall).
- The hero kicker is a plain line of spaced capitals, not a pill with a dot.
- Screenshots: capture at a real screen size (for example 1440x900 or 375x667, full page). In a very tall capture
  window the hero stretches to its 1080px cap, which is not what a visitor sees.

**Left out from v1.** Photo collage, glows and dot grid, stats marquee, diamond ornaments, floating question chips,
the separate trust strip (its badges moved into the hero).

**Placeholders (marked in the HTML with `PLACEHOLDER` comments).** Both video clips; photos copied from v1
(Unsplash licence); advisor names, roles and credentials; five sample reviews, their star rows and the "Verified
client review" label; hero badge claims; disclosure paragraphs; office hours; booking-calendar mock.

**Compliance choices.** Same as v1: no credentials asserted, no returns, guarantees or income figures. The Join Our
Team band has its own tag, outline button and soft background, and its button stays on that band until the recruiting
page exists, so it never leads into the client booking flow.

**Links.** As v1: pages that don't exist yet point to the matching in-page section. The four question cards open the
matching FAQ answer.

**Checked 2026-11-05.** Screenshots at 1440px and 375px are in `designs/v2/home/screenshots/`; also viewed at 768px.
Scripted checks passed for: menu drawer, Services dropdown, stories carousel, stepper, question cards, FAQ, guide
form, booking flow, video pause/play, sticky bar, reduced motion, no sideways scroll at 320/375/768/1440, all images
and anchors resolving, no console errors.

## 2026-11-04 — Home v1 (`designs/v1/home/`)

**Reference.** Layout follows the facet.com home page, section for section, from the full-page screenshot in
`referance-websites/facet.com/facet.com_.png`. Facet's copy, logo, colours and photos were not used.

**Palette (user decision: Future Right's current colours only, no Facet navy/green).**

| Role | Value | Source |
|---|---|---|
| Dark section background, dark buttons | `#0d141a` | live futureright.us text colour |
| Light section background, nav pill | `#fbf6ee` | warm off-white derived from site cream `#ffeacc` |
| Cream surfaces | `#ffeacc` | live site |
| Accent (headline words, step numbers, diamonds, © line) | `#f0a030` | logo orange gradient, light end |
| Primary CTA pill | `#cc6333` | live site accent |
| Cards on dark | `#1b2631` | derived |
| Logo blue `#3b7fe0` | logo only | not used as a UI colour in v1 to keep the two-tone Facet feel; easy to add in v2 |

**Typography.** Outfit 400/500/600 (Google Fonts) as the closest free match to Facet's geometric sans. Lora italic for
review quotes, mirroring Facet's italic serif testimonials. Live site used Lato/Inter; dropped for v1.

**Facet-derived layouts.** Floating pill nav; dark hero with centred 2-line headline (2nd line orange) and a 7-tile
photo collage; laurel trust strip; statement section; full-bleed rounded photo card; chips + grid; dark 3-step "How it
works" with faint curve; two-row stats marquee with hairlines; review card carousel with floating name chips; orange-
framed guide tile with diamond divider; final CTA with 4 diamonds; dark rounded footer card with disclosures.

**Substitutions where Facet content has no Future Right equivalent.**
- Rating badges (Trustpilot, Google, WSJ, NerdWallet) → four neutral trust statements. Real ratings can replace them.
- Phone-app mock-up → four "Who we help" audience cards (MoU requires this section).
- Membership 3-column → six-service card grid (MoU requires the services grid).
- Big stats ($9B AUM etc.) → claim-free statements in the marquee.
- Video + Ramit Sethi endorsement → free-guide download block (MoU requires a lead magnet).
- Trustpilot "Excellent" line → neutral "Client reviews, verified and approved before publishing".

**Placeholders (marked in the HTML with `PLACEHOLDER` comments).** Stock photos (Unsplash licence) in
`designs/v1/home/img/`; advisor names/roles/credentials; five sample reviews; disclosure paragraphs; office
address and hours; booking-calendar mock; trust-strip claims. All to be replaced from MoU §10 inputs.

**Compliance choices.** No credentials asserted (CFP, fiduciary, RIA). No returns, guarantees or income figures.
Recruiting teaser uses neutral wording and a different button style. Estate/tax FAQ advises consulting an attorney or
CPA. Footer reserves a disclosures block and the live-site phone/email are used.

**Links.** Pages that don't exist yet point to the matching in-page section (e.g. service links → `#services`,
About → `#advisors`). Replace with real URLs as pages are built.
