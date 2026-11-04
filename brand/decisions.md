# Design decisions log

Dated record of assumptions and reference-derived choices. Newest first. Update when the client confirms or overrules.

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
