# Springreens — website prototype

A clickable, hosted prototype for **Springreens** (Healthy Halal Soul Food, East Atlanta),
built by **Inheriting Islam Studio** as a sales tool. Static, self-contained, no build step.

- Pages: Home, Menu, Catering, Our Story, Order, Gift Cards, VIP, Private Events.
- All content (menu items, prices, descriptions, story, reviews) is the client's real content.
- Fonts (Fraunces + Mulish) are embedded as data-URI @font-face — no CDN.
- Images optimized to WebP. Light + dark themes. Responsive. SEO + schema per page.
- `noindex` while it's a prototype (robots.txt + meta).

### Placeholders to confirm with the client
- **Logo:** the sprout seal + "Springreens" wordmark is a *tasteful placeholder* derived from
  the current site's green script logo. Confirm or replace with the official logo.
- **Order Online** links to the existing ordering page (`springreens.com/popmenu-order`).
- **Catering form** opens the visitor's email app (mailto). Wire to a real inbox/form backend on launch.
- Star ratings on reviews are illustrative; review text is the client's real testimonials.

Preview locally: `python3 -m http.server 8080` then open http://localhost:8080
