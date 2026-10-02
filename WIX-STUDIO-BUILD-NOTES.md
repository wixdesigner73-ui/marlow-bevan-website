# Marlow Bevan — Wix Studio build notes

The HTML/CSS in this folder is the approved art direction, built and tested at 1440 / 820 / 390 px.
Rebuild it in Wix Studio section by section using the values below. Optimised assets are in `img/`.

## Setup
- **Pages:** Home (/), Book (/book).
- **Breakpoints:** design Desktop 1440 → Tablet 820 → Mobile 390 separately.
- **Fonts:** upload fonts/MarlowBevan.ttf (name wordmark / footer signature only). Headings Playfair Display 600 (+ italic 500). Body Manrope 400/500/700/800. Labels Manrope 800, 11–12px, +0.24em, uppercase.
- **Colours:** bg #0A0B10 · bg-2 #10121A · card #151824 · text #ECE7DC · mute #A29FA8 · light section #F5F2EA · ink #14151C · gold gradient #A87A22 → #F7DC92 → #E3B24A.
- **Shapes:** pill buttons (999px), cards radius 20px, large cards 32–36px. Dark/light sections alternate: Hero (dark) → Facts (light) → Showcase (dark) → Inside (dark) → Author (light) → Signup (dark) → Follow (dark) → Footer.
- **Header:** transparent → blurred dark on scroll; gold pill 'Buy the Book'.

## Home sections (top → bottom)
1. Hero – name in script (~270px desktop / 115px mobile, "Bevan" indented), "Musician, producer and poet", one-line book intro, **Discover the Book** → /book. Photo `photo-1` 4:5 right, slow parallax (scroll effect, ~38px). Name: "reveal – wipe left→right", 2s.
2. Latest book (bg paper-2) – `cover` + `back` overlapped, title 115px Cormorant 300, byline, description, 4 facts, **Discover the Book**.
3. About (#about) – `marlow` square left, bio right (lede = first sentence in Cormorant ~58px).
4. Selected imagery – 6 items, mixed proportions: spreads on panel bg (`spread-*`), photos 4:5 (`photo-3/5/4`). Hover: scale 1.025 over 1.8s. Link to /book#spreads.
5. Newsletter – Wix **Subscribe Form** (email only). Heading "Be the first to hear."
6. Follow (night bg) – 4 text rows, links below.
7. Footer (night) – signature, Explore, Follow, ©.

## Book sections
Hero (night) → About the book (#about-book) → Illustrations & spreads (#spreads) → Publication info → Buy the Book (#buy, night) → Final CTA (night-2, cover + back, button, signup).
All entrance animation: fade + 22px rise, 1.1s, ease-out, once. Images: 1.5s inset wipe. Disable all on prefers-reduced-motion.

## Links (from Website Text.pages — nothing invented)
Waterstones https://www.waterstones.com/book/the-lens-adjusted/marlow-bevan/danny-boatfield/9781068281525
Amazon UK https://www.amazon.co.uk/dp/1068281529 · US https://a.co/d/02Dpn5OW · CA https://a.co/d/0b8XwbrQ · AU: none yet (shown "Link coming soon", not clickable)
Facebook /poetmarlow · Instagram /marlowbevan · YouTube @MarlowBevan · TikTok @marlowbevan

## SEO (Wix: Pages > SEO)
Home title: "Marlow Bevan — Poet, Musician & Author of The Lens Adjusted"
Book title: "The Lens Adjusted — Illustrated Poetry Book by Marlow Bevan"
Descriptions, OG tags, JSON-LD (Person / Book) are in the `<head>` of each HTML file — copy into Wix SEO fields / Advanced SEO > Structured data.
Social share image: `img/og.jpg` (1200×630). One H1 per page, H2 per section. Alt text is written on every `<img>`. Sitemap is automatic in Wix; `sitemap.xml`/`robots.txt` here are for reference.

## Open items for the client
- Contact details, privacy/cookie text: none supplied, so the footer has none.
- No excerpts/quotations supplied, so no excerpt section was built (spread captions use page numbers from the render filenames).
- Newsletter copy mentions the "December book launch" (from the brief) while the supplied text says the limited first edition is "currently available" — confirm wording.
- ISBN 9781068281525 is taken from the Waterstones URL — confirm.
- Amazon Australia link.
- Hero photo `photo-1` is soft at large sizes; a sharper cover photo would improve it.

## Premium motion layer (css/premium.css + js/premium.js)
Native in Wix Studio: entrance (fade/rise, image wipe, text word-reveal), scroll-linked parallax, marquee, hover scale, sticky column, page transitions, anchor smooth-scroll.
Needs an embed / custom code (Velo or custom element) in Wix: intro sequence (once per session), custom cursor, 3D book tilt with glare, magnetic buttons, Lenis smooth scrolling. All of these are desktop-only and switch off on touch and for reduced-motion.
Gold foil: #B79A5B → #E7D3A0 gradient on buttons (hover sweep), section hairlines, title shimmer, 2px scroll-progress bar.
