# Dudu Bitcoin Site Roadmap

**Launch target:** Sunday, March 8, 2026
**LinkyBoss launch:** 10-14 days after site launch

---

## P0 — Launch (by March 8)

### 1. Newsletter Backend ✅ DONE
Connected email capture to ConvertKit via `/api/subscribe`. All 5 forms across the site now work (homepage, content page, footer, lead magnet popup).

### 2. Remove Broken Membership Links ✅ DONE
Cleaned up `/#membership` references on `/tools` and `/content` pages.

### 3. Testimonials Section 🔧 IN PROGRESS
- ✅ Revolving carousel with 5 cards, auto-rotate, arrows, dots, fade transitions
- ✅ 1 real testimonial (Gidon Ronthal, Super Group) with logo and headshot assets
- ⬜ Replace 4 remaining placeholder quotes with real testimonials
- ⬜ Final review and sign-off

### 4. Content Pages ✅ DONE (structure)
- Removed all dead content links — cards now display as non-clickable previews
- ⬜ Seed real content (articles, webinar replays)

### 5. SEO ✅ DONE
- `sitemap.ts` → auto-generates `/sitemap.xml` with 4 URLs
- `robots.ts` → allows all crawlers, blocks `/api/`
- `opengraph-image.tsx` → dynamic OG image with brand colors
- JSON-LD structured data (Person + WebSite schema) in layout
- `metadataBase` and canonical URL set

### 6. About Me Section ✅ DONE
About page built with timeline, highlights, thesis cards, social proof, and CTAs.

### 7. Content Section ⬜ TODO
- Populate with real or near-final content
- Ensure /content page is launch-ready

### 8. Polish & QA ⬜ TODO
- Bolder text site-wide ✅ (font-weight: 500 applied)
- ✅ Homepage restructured (Hero, What I Do, Testimonials, Fresh Signal, Newsletter CTA, Book a Call)
- ✅ Card component enhanced (3D tilt, gradient border, emoji particles)
- ✅ RotatingSubtitle component added
- ✅ globals.css expanded with brand tokens and animations
- Final homepage copy review
- QA pass across devices
- Overall launch readiness check

### 9. Content Factory System ✅ DONE (Steps 1-3)
- brand-guide.md, winning-formulas.md, engine blueprint completed
- Step 4 (first content batch) starts March 5

---

## P1 — LinkyBoss Launch (+10-14 days)

### 7. LinkyBoss Tool Page
Dedicated page for LinkyBoss with gated access for members.

### 8. Membership / Gating System
- Auth system (NextAuth or Clerk)
- Access control for tools and content
- Gate LinkyBoss behind membership
- `PricingCard.tsx` component already built, unused

### 9. Analytics
- Plausible or GA4
- Conversion events: newsletter signup, Calendly click, content views
- Funnel visibility

---

## P2 — Later

### 10. Paid / Gated Content
Format TBD. Could be premium articles, webinar replays, prompt libraries, or research reports behind paywall.

---

## Current Site Status (as of March 4, 2026)

**Working:**
- Light theme with brand guidelines applied
- Animated hero (avatar, typewriter, parallax, staggered entry)
- 4 pages: home, about, tools, content
- Email capture connected to ConvertKit
- Calendly integration
- Content filtering on /content page
- Mobile responsive
- Social links (LinkedIn, X, YouTube)
- Testimonials section on homepage
- SEO: sitemap, robots.txt, OG image, JSON-LD
- No dead links
- About page with timeline, highlights, thesis cards
- Testimonials carousel (1 real, 4 placeholder)
- Enhanced card components with 3D effects
- RotatingSubtitle hero component

**Not working:**
- No analytics
- PricingCard component built but unused
- Content is placeholder — needs real articles/webinars
- All changes uncommitted — needs git commit

**URGENT:** Commit all March 4 work — large volume of uncommitted changes at risk of loss.
