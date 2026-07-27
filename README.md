# Springreens — website prototype (3 design directions)

A clickable, hosted prototype for **Springreens** (Healthy Halal Soul Food, East Atlanta),
built by **Inheriting Islam Studio** as a sales tool. Static, self-contained, no build step.

## Three designs to choose from — use the "Design" switcher at the bottom of any page
1. **Soul Kitchen** (`/`) — warm, cozy, appetite-first. Fraunces + Mulish, deep green + honey + cream.
2. **Fresh Market** (`/v2/`) — bright, modern, editorial. Bricolage Grotesque + Inter, green + citrus.
3. **Heritage** (`/v3/`) — premium, cinematic, ornamental. Playfair Display + Jost, gold + terracotta on espresso.

Each design shares the same real content, photos, logo, and behaviour. v1 (Soul Kitchen)
also has the full page set (About, Order, Gift Cards, VIP, Events); v2 & v3 cover the three
hero pages (Home, Menu, Catering).

## Content & brand
- All menu items, prices, descriptions, story and testimonials are the client's **real content**.
- **Real logo** recovered from the current site (4870×1647, transparent) and used as a
  `currentColor` mask so it adapts to each palette (green / mint / gold / white). Favicon derived
  from the ornamental "S". Marks live in `assets/brand/`.
- Fonts embedded as data-URI @font-face — no CDN. Images optimized to WebP. Light + dark themes.
- SEO + Restaurant schema per page. `noindex` while it's a prototype.

## Notes to confirm with the client
- **Order Online** links to the existing ordering page (`springreens.com/popmenu-order`).
- **Catering form** opens the visitor's email app (mailto) — wire to a real inbox on launch.
- Review star ratings are illustrative; the review text is the client's real testimonials.

Preview locally: `python3 -m http.server 8080` → http://localhost:8080
