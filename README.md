# Ruth's Garden

A redesigned website for **Ruth's Garden** — an intimate garden event venue in historic
downtown Gastonia, North Carolina, and a living gift to the **Animal League of Gaston County**.

The garden hosts weddings, photoshoots, and celebrations of every kind. It was made possible
by **Ruth Waggoner**, who donated the funding to build it, and it carries a memorial brick &
paver program that supports the Animal League.

🌿 **Live:** https://www.ruthsgarden.org/ · ☎️ 980-777-7279 · ✉️ ruthsgarden.algc@gmail.com

---

## About this build

A complete redesign of the original hand-coded site, rebuilt as a single, elegant long-scroll
experience. No build step, no framework — just hand-written HTML, CSS, and a touch of vanilla
JavaScript, so it deploys anywhere static and loads fast.

**Design language — "Garden Heirloom":** deep evergreen, warm cream, antique brass, and brick
terracotta, all drawn from the garden's own photography. Typography pairs *Cormorant Garamond*
(display) with *Jost* (interface) and *Great Vibes* script flourishes that echo the original logo.

### Sections
1. **Hero** — full-bleed garden photography with the venue's invitation
2. **Welcome** — what the garden is, and the three things it's made for
3. **The Garden** — editorial features: the pavilion, the millstone fountain, the bronze companions
4. **Our Story** — Ruth Waggoner and the gift behind the garden
5. **Film** — the venue promo video
6. **Gallery** — a lightbox gallery of real moments in the garden
7. **Legacy** — the engraved-brick, paver, and sponsorship program for the Animal League
8. **Visit** — contact details and a live booking inquiry form
9. **Footer**

### Features
- Fully responsive (mobile-first) with an elegant mobile menu
- Accessible: semantic HTML, keyboard-navigable lightbox, focus states, `prefers-reduced-motion` support, alt text, skip link
- Scroll-reveal animations, a subtle hero parallax, and scroll-spy navigation
- Lazy-loaded, web-optimized imagery with reserved dimensions (no layout shift)
- SEO + Open Graph + Twitter cards + `EventVenue` structured data

## Project structure

```
ruths-garden/
├── index.html              # the whole site, one page
├── assets/
│   ├── css/styles.css      # design system + all styles
│   ├── js/main.js          # nav, reveals, parallax, lightbox, video, form resize
│   └── img/
│       ├── *.jpg           # web-optimized photography
│       ├── favicon.svg     # botanical mark
│       └── raw/            # original full-resolution source photography (archive)
└── README.md
```

## Run locally

It's a static site — serve the folder with anything:

```bash
python3 -m http.server 5312
```

Then open http://localhost:5312.

## Deploy (GitHub Pages)

1. Push to the `main` branch (done).
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   choose `main` / `root`, and save.
3. To serve it at `ruthsgarden.org`, add a `CNAME` file containing the domain and point the
   domain's DNS at GitHub Pages.

## Content & credits

All photography, copy, the booking form, and the brick-order link were carried over from the
original ruthsgarden.org. Booking inquiries flow through the venue's existing JotForm; brick &
paver orders go through the Animal League's fundraising partner.

Redesigned and rebuilt with care by Nash Davis.
