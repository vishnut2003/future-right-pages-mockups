# CLAUDE.md — Future Right: Website Redesign Mockups

## Project objective

**Future Right Financial Solutions LLC** (https://futureright.us/) has hired **WebSpider Solutions** to redesign and
rebuild its website. The full agreement is the MoU at `project-details/Future-Right-Website-MoU-WebSpider-Solutions.pdf`
(dated 23 October 2026). Read it when scope, pages or sections are in question; it is the contract.

**This repo covers only the design phase (MoU Phase 3).** It holds **page design mockups** that the client reviews and
approves before development starts. The final site will be built separately in WordPress with a custom theme; nothing
in this repo is production code.

The MoU says designs would be shared in Figma. **Decision (2026-11-04): mockups are built here as pure HTML, CSS and JS
instead**, shared as a clickable preview link or zip. Same deliverable, different tool.

The deliverable is a *design*, not a product. Optimise for:

1. Looking finished and polished when the client opens it, on a phone as well as a desktop.
2. Being fast to iterate on: the MoU allows **2 rounds of design changes**, so get it close on the first pass.
3. Being easy to share (plain files, no build step, no server).

## What the MoU requires from the design phase

- **Phase 3, Day 2–5:** style direction (colours, fonts, buttons, icons, photo style) plus **desktop and mobile designs
  for the Home page and the Service page template**. Those two approved designs are the contractual deliverable and
  trigger the 30% milestone payment. Build and polish these two first; every other page follows their system.
- **Up to 2 rounds of design changes.** Each round is one consolidated list from the client. Record every round in
  `feedback/`. Anything beyond two rounds, or a redesign after approval, is a change request; flag it to the user.
- **Design based on the Future Right logo and colours** (MoU §3). Reuse the existing logo; evolve the palette, don't
  replace it unless the client asks.
- **Two separate journeys:** "Plan My Future" (clients) and "Join Our Team" (recruits). Keep them visually distinct
  and never mix recruiting copy into client-facing service pages.
- **Mobile-first** with accessibility basics: readable sizes, contrast, keyboard-friendly menus and forms.
- **Conversion elements must be visible in the designs:** "Book a free consultation" primary CTA, sticky "Book a call"
  button and click-to-call on mobile, enquiry form, lead-magnet download block, booking-calendar embed placeholder.
- **Compliance:** footer disclosures block on every page, educational tone, no guarantees, no income promises on
  recruiting pages, reviews only where marked "compliance-approved". Advisor credentials appear only "as provided".

## About the client (from the current site and MoU)

- **Business:** personal financial planning and wealth-protection services for families, professionals, pre-retirees
  and business owners, plus a recruiting track for people joining the financial-services business.
- **Six services:** Retirement Planning; Life & Family Protection; Kids Education / College Funding; Estate Planning
  (Will & Trust); Tax-Smart Savings; Investment Planning.
- **Location:** San Jose / Bay Area, California (a local landing page is in scope). Licensed states to be confirmed.
- **Contact:** +1 (669) 245-8382, futureright.fin@gmail.com (a domain email is planned). Social: Facebook, LinkedIn.
- **Current site:** Hostinger/Zyro builder, stock Unsplash photos, template blog posts, unverified testimonial. The
  MoU calls for removing all of that. The redesign should look custom and trustworthy, not templated.
- **Current brand found in the live CSS:** near-black `#0d141a`, burnt-orange accent `#cc6333`, cream `#ffeacc`;
  fonts Lato and Inter. Logo at `assets/logo/futureright-logo.png` (pulled from the live site; ask for source files).
- **Pending from the client (MoU §10):** brand guidelines, advisor names/photos/bios/credentials, office address and
  service area, product providers, disclosure text, approved reviews. Until supplied, use clearly labelled placeholders.

Keep `brand/brief.md` as the single source of truth for business facts and update it when the client tells us more.

## Design references

The MoU lists five US financial sites as direction, not to copy. The client has said they **like facet.com most**.

| Site | Look at | Use for |
|---|---|---|
| **facet.com** (primary) | Hero, simple 3-step process, team section, sample money questions, footer disclosures | Home page flow and "How it works" |
| range.com | Service areas by topic, 5-step onboarding, FAQs | Services hub and service grouping |
| brooklynfi.com | "Without us vs with us" comparison, clear audience, warm tone | Who We Help page and a human voice |
| trustandwill.com | Wills & trusts education, plan-finder quiz, strong FAQs | Estate Planning page, will vs trust table |
| ethos.com | Clean insurance journey, "how it works", calculator linked from FAQs | Life & Family Protection page and calculator |

- **Access:** facet.com is geo-blocked from India and blocks automated fetching (direct fetches return 403 and
  browser-rendering tools are refused). The user captures full-page screenshots over a VPN into
  `referance-websites/<site>/` (facet.com is already there). To read a tall screenshot, slice it into ~1400px-high
  chunks with Pillow into the scratchpad and view the slices; sample colours from it with Pillow. Design from
  screenshots, not from memory.
- **What to take from facet.com:** premium, calm, modern financial look: large confident headlines, generous whitespace,
  restrained palette with one strong accent, pill-shaped buttons, real-people photography, clean card grids, FAQ
  accordions, trust strip, repeated CTA. Confirm with the client what specifically they like.
- **Use references for:** page rhythm, section patterns, type hierarchy, spacing, component styling, mobile nav.
- **Never use:** their copy, brand names, logos, exact colours, illustrations or photos.
- Record reference-driven decisions in `brand/decisions.md` ("Hero follows Facet: left headline, right photo").

## Tech stack: pure HTML, CSS and JavaScript

**Hard rule:** mockups are written in plain, hand-authored HTML5, CSS3 and vanilla JavaScript. Nothing else.

- No frameworks or libraries of any kind: no Tailwind, Bootstrap, React, Vue, jQuery, Alpine, GSAP, Swiper, etc.
- No CDN scripts or stylesheets, except Google Fonts.
- No build step, no preprocessors (no Sass/Less/PostCSS), no TypeScript, no `package.json`, no `node_modules`.
- Every page must open by double-clicking the file and work offline.
- **One folder per design** at `designs/v<N>/<page>/` with `index.html`, `styles.css`, `script.js` and `img/`.
- Layout with modern CSS: Flexbox, Grid, custom properties, `clamp()` for fluid type, container/media queries.
  No float-based or table-based layouts.
- JavaScript only for interaction (mobile nav, accordions, tabs, sticky CTA, the calculator demo). Keep it small,
  use `defer`, no inline `onclick=` handlers.
- Brand colours, fonts, spacing, radii and shadows live as CSS custom properties in `:root` at the top of each
  design's `styles.css` and are referenced everywhere via `var(--token)`. Never hard-code a brand hex in markup.
- Fonts: Google Fonts only. Images: real client assets from `assets/` when supplied, otherwise placeholders that match
  the final aspect ratio and subject (families, advisors, offices). No images showing other brands or apps (MoU §6).
- Fully responsive at 375px, 768px and 1440px. The client reviews on phones, so mobile is not optional.
- No backend, no forms that submit, no analytics, no real booking embed. Show a realistic placeholder for the Calendly
  embed. Interactive elements should *work* so the client can feel the page, but never call external services.
- Placeholder copy must be realistic and on-brand (plain, educational, trust-first). Never ship "Lorem ipsum".

## Folder layout

```
.
├── CLAUDE.md                      # this file
├── index.html                     # mockup gallery: one card per design with status, round and link
├── project-details/               # MoU PDF and any other signed documents (read-only)
├── referance-websites/<site>/     # client-supplied full-page screenshots of reference sites (facet.com_.png etc.)
├── brand/
│   ├── brief.md                   # business facts, audience, tone, services, contact (source of truth)
│   └── decisions.md               # dated log of design assumptions and reference-derived decisions
├── assets/logo/                   # client logo (never edit originals)
├── designs/
│   └── v<N>/<page>/               # one folder per design version per page, e.g. designs/v1/home/
│       ├── index.html             # the page
│       ├── styles.css             # tokens in :root + all page CSS (self-contained per design)
│       ├── script.js              # vanilla interactions only
│       └── img/                   # placeholder photos and the logo copy used by this design
└── feedback/                      # client feedback per design and round, e.g. home-v1-r1.md
```

Each design folder is self-contained (own CSS, JS, images) so a version can be zipped or published on its own and
never breaks when another version changes. When a new page reuses the approved Home design system, copy the
tokens and shared component CSS from the approved design rather than linking across folders.

Versioning: `v1`, `v2`… are **design directions** shown to the client. Revision rounds within a direction edit the
same folder in place and are logged in `feedback/`. Create a new `v<N>` only when the client asks for a different
direction, not for round changes.

Create missing folders as needed; do not invent other top-level folders without a reason.

## Pages

The MoU site has 19 pages. The design phase only requires Home and the Service template, but the mockups should make
the whole site's design system obvious. Build in this order.

### Tier 1: contractual design deliverables (build first, get approved)

| Page | File | Required sections (MoU §5) |
|---|---|---|
| Home | `pages/home.html` | Hero with value line + "Book a free consultation"; Who we help (families, professionals, pre-retirees, business owners); Services grid (6); How it works in 3 steps; Meet the advisor(s) strip; Reviews (compliance-approved only); Free guide download; FAQs (6–8); Join Our Team teaser; Booking section; footer with disclosures |
| Service page template | `pages/service-template.html` | Answer-first intro; Who it is for; How we help (process); Options explained simply; FAQs (8–10); Advisor box + disclosures; Booking CTA + related links. Mock it with Retirement Planning content. |

### Tier 2: pages that need their own layout (build after Tier 1 approval, if time allows)

| Page | File | Notes |
|---|---|---|
| About Us | `pages/about.html` | Story, mission, values, team overview, credentials, product providers, CTA |
| Advisor profile | `pages/advisor.html` | Photo, name, role, credentials, bio, licence lookup link, LinkedIn, "Book with this advisor" |
| Services hub | `pages/services.html` | Intro, 6 service cards, "Not sure where to start?" CTA |
| Who We Help | `pages/who-we-help.html` | Young families, tech professionals, business owners, pre-retirees; goals + matching services |
| Life Insurance Needs Calculator | `pages/calculator.html` | Inputs: income, debts, kids, years of support, existing cover; instant estimate; disclaimer; CTA. Demo logic in vanilla JS. |
| Join Our Team | `pages/join-our-team.html` | Career overview, training, what to expect, FAQs, opportunity-call form. No income promises. |
| Contact & Book | `pages/contact.html` | Booking calendar placeholder, enquiry form, phone, email, address, map placeholder, office hours |
| San Jose / Bay Area | `pages/san-jose.html` | Local intro, services for Bay Area families, local FAQs, map, booking |
| Learning Center | `pages/blog.html` + `pages/article.html` | Listing with categories and search; article with author box, TOC, FAQs |

### Tier 3: utility pages (derive from the system, low effort)

Disclosures, Privacy Policy / Terms, Thank You, 404. One simple text-page template covers all of these.

Service variations noted in the MoU (will vs trust comparison table, 529 basics, "consult an attorney/CPA" notes,
calculator link) are section variants of the service template; show them in `service-template.html` only if asked.

## Workflow

### Starting a new page
1. Read `brand/brief.md`, `brand/decisions.md`, the MoU page list above, and the screenshots in `referance-websites/`.
   If the brief is empty, draft it from the facts in this file and ask the user to confirm.
2. Start from the latest approved (or most recent) design's `styles.css` tokens and components so pages match.
3. Build `designs/v<N>/<page>/index.html` with exactly the sections the MoU lists for that page, in a sensible order.
4. Add a card for it to the root `index.html` with status `Draft`, and log decisions in `brand/decisions.md`.

### Checking a design visually
Headless Edge is installed and works from Bash:
`"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=8000 --window-size=1440,12000 --screenshot=<out.png> file:///<path>/index.html`.
For mobile, Edge enforces a minimum window width, so wrap the page in a scratch HTML file containing a 375px-wide
iframe, add `--allow-file-access-from-files`, and screenshot that at `--window-size=520,15000`. Slice the result with
Pillow before viewing. Trim blank space using centre-column pixels, not edge pixels (inset cards fool edge trims).

### Versioning and client rounds
- Keep **one live file per page**. Do not create `home-v2.html`, `home-final.html`, etc.
- Each client round is recorded in `feedback/<page>-r<N>.md`: date, who gave the feedback, each request, what changed.
- Status in `index.html`: `Draft` → `Sent for review` → `Round 1 changes` → `Round 2 changes` → `Approved`.
  If a third round is requested, stop and tell the user; it is outside the MoU.
- When a page is approved, add `<!-- APPROVED: YYYY-MM-DD by <client name> -->` at the top of the HTML and stop
  editing it unless the client asks. Approval of Home + Service template is a payment milestone; say so in the recap.
- If git is initialised, commit at the end of each round with a message like `home: round 1 changes (hero copy, CTA)`.

### Sharing with the client
- Preferred: publish as a private link, or zip `index.html` + `pages/` + `shared/` + `assets/` so it opens offline.
- Before sending, check: opens from `file://` with no console errors, all relative paths resolve, all images load,
  mobile layout holds at 375px, sticky CTA works on mobile, no placeholder text, no dev comments visible,
  disclosures block present in the footer.

## Design rules

- Follow the brand in `brand/`. If something is undefined, pick a sensible option, use it consistently, and note the
  assumption in `brand/decisions.md`.
- Consistency across pages beats cleverness on one page. Shared header, footer, buttons and spacing rhythm must match.
- One clear primary CTA per page: "Book a free consultation" for client pages, "Book an opportunity call" for recruiting.
- Tone: trustworthy, calm, premium, human, educational. Real-people photography, plain language, visible contact
  details. No hype, no guarantees, no returns or income figures.
- Trust signals get real estate: advisor strip, credentials "as provided", product providers, compliance-approved reviews.
- Accessibility baseline: 4.5:1 body contrast, visible focus styles, alt text, semantic HTML (`header`, `nav`,
  `main`, `section`, `footer`), keyboard-operable menus and accordions.
- Motion is subtle and optional. Nothing should distract during a client review.

## What NOT to do

- Don't introduce any framework, library, CDN script, preprocessor, build step or `package.json`.
- Don't copy any reference site's text, logo, colours, photos or illustrations.
- Don't make silent design changes to an already-approved page.
- Don't leave TODOs, lorem ipsum, broken links or `#` hrefs in a file marked `Sent for review`.
- Don't fetch remote images from random sites; use `assets/` or neutral placeholder services.
- Don't invent credentials, licences, reviews, guarantees, returns or income figures.
- Don't add pages or features beyond the MoU list without telling the user it is a change request.
- Don't put MoU commercials or other confidential details into any mockup or shared file.

## Working with Claude on this repo

- When asked for "a new page", produce the full HTML file plus the gallery update, then say what assumptions were made.
- When asked to apply client feedback, read the latest `feedback/<page>-r<N>.md` (or the message given), make the
  edits, update the feedback file with what changed, and bump the status in `index.html`.
- When asked for a variation ("try a darker hero"), implement it in the same file behind a clearly labelled toggle or
  as a second section the client can compare, rather than forking the file. Remove the loser once the client decides.
- Screenshots: if a visual check is requested and a browser tool is available, capture 375px and 1440px widths.
  Reference sites cannot be fetched by tools; rely on screenshots in `brand/reference/`.
- Code style: 2-space indent, kebab-case BEM-ish class names (`.hero__title`, `.btn--primary`), semantic HTML,
  comments only at section boundaries (`<!-- Hero -->`).
- Keep responses short. The output is the HTML/CSS/JS; explain only decisions the client or user needs to know about.
