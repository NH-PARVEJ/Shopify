# Press by Heart — Shopify Online Store 2.0 Theme

**Theme Name:** Press by heart  
**Version:** 1.0.0  
**Architecture:** Shopify Online Store 2.0 (OS 2.0)  
**Compatibility:** Shopify Admin, Theme Editor (Customizer), Liquid API, Ajax Cart API, Section Rendering API

---

## 💎 Overview
**Press by Heart** is a luxury, salon-quality press-on nail Shopify Online Store 2.0 theme. It provides a 100% pixel-perfect conversion of the approved design with zero hardcoding. All content, menus, banners, testimonials, product cards, collections, and policies are fully dynamic and manageable directly from the Shopify Theme Editor (Customizer).

---

## 📁 Theme Directory Structure

```text
press-by-heart/
├── assets/                     # Stylesheets, JS engines, local fonts, svg icons
│   ├── commerce.js             # Core OS 2.0 Ajax cart & variant state engine
│   ├── kids-menu.js            # Kids navigation and mobile menu logic
│   ├── style.css               # Base theme styles & typography
│   ├── refinements.css         # Visual styling, cart drawer & modal refinements
│   ├── product.css             # Product detail page layout & gallery styles
│   ├── shop-all.css            # Catalog grid, filter pill styles
│   ├── kids.css                # Kids collection layout & promo styling
│   └── shop-by-design.css      # Design chip interactive filter matrix
├── config/
│   ├── settings_schema.json    # Global Theme Editor schema (colors, typography, cart)
│   └── settings_data.json      # Theme Editor default settings preset
├── layout/
│   ├── theme.liquid            # Primary store wrapper (header, main, footer, drawer)
│   └── password.liquid         # Storefront password protection layout
├── locales/
│   └── en.default.json         # Internationalization dictionary
├── sections/                   # Modular Liquid sections with customizer schemas
│   ├── announcement-bar.liquid # Top alert bar with customizable text & link
│   ├── header.liquid           # Dynamic logo, navigation, mega menus, search & bag
│   ├── hero.liquid             # Hero banner with dynamic image, heading & CTA
│   ├── collections-grid.liquid # Elementor-style modular collection category cards
│   ├── benefits-bar.liquid     # Modular USP icons and value propositions
│   ├── best-sellers.liquid     # Dynamic product collection carousel/grid
│   ├── features-grid.liquid    # Modular highlight feature promo banners
│   ├── why-choose-us.liquid    # Modular testimonials & checklist with live preview
│   ├── instagram-grid.liquid   # Dynamic social media showcase grid
│   ├── footer.liquid           # Multi-column footer, newsletter, payment badges
│   ├── cart-drawer.liquid      # Dynamic slide-out cart drawer with promo code
│   ├── main-product.liquid     # PDP section with variant selector, gallery & tabs
│   ├── main-collection.liquid  # Collection catalog with filter chips & pagination
│   ├── main-kids.liquid        # Kids collection page with promo banner
│   ├── shop-by-design.liquid   # Shape, length, colour interactive design matrix
│   └── main-page.liquid        # Generic page content section
├── snippets/                   # Reusable Liquid snippets
│   ├── product-card.liquid     # Dynamic product card with variant price & badges
│   ├── catalog-card.liquid     # Shop All & collection product card component
│   ├── mega-menu-shop-all.liquid     # Dynamic Shop All mega menu panel
│   ├── mega-menu-kids.liquid         # Dynamic Kids mega menu panel
│   ├── mega-menu-shop-by-design.liquid # Dynamic Shop by Design mega menu panel
│   ├── pagination.liquid       # Accessible page navigation snippet
│   └── theme-settings.liquid   # CSS custom properties injector
└── templates/                  # Online Store 2.0 JSON templates
    ├── index.json              # Modular homepage template
    ├── product.json            # Dynamic product page template
    ├── collection.json         # Dynamic collection page template
    ├── cart.json               # Full shopping bag page template
    ├── page.json               # Dynamic page template
    ├── 404.json                # Not found page template
    ├── search.json             # Search results page template
    └── customers/              # Customer account templates (login, register, account)
```

---

## 🎨 Theme Editor & Dynamic Navigation (Elementor-Style Customization)

Every section, block, and navigation menu in the theme is dynamic and configurable through the **Shopify Theme Editor (Online Store > Themes > Customize)** and **Shopify Admin**:

### 1. 100% Dynamic Navigation & Pages (`Shopify Admin > Navigation`)
- **Desktop & Mobile Menus:** Both the header navigation bar and the mobile drawer menu dynamically render from your Shopify navigation menu (`Main menu` / `linklists[section.settings.menu]`).
- **Add / Remove Pages Easily:** Any page, collection, blog, or custom link you add in **Shopify Admin > Online Store > Navigation > Main menu** will automatically appear in the navigation bar!
- **Multi-Level Dropdowns:** If a menu item has child links, the theme renders an accessible luxury dropdown menu automatically.
- **Zero Static Pages:** No hardcoded links or fixed page URLs. When you create a new page in Shopify Admin (`Online Store > Pages`) and add it to your navigation, it immediately becomes active.

### 2. Elementor-Style Mega Menus as Blocks (`sections/header.liquid`)
All three luxury mega menus are now configured as modular blocks in the Theme Editor sidebar:
- **Shop All Mega Menu Block:** Featured product card, badge text, promo image picker, column titles, subtitles, and destination links.
- **Kids Mega Menu Block:** Category links, promo banner image picker, headlines, subheadings, and button targets.
- **Shop by Design Mega Menu Block:** Shapes, lengths, colour swatches, custom sizing promo card, and direct URLs.
- **Real-Time Live Preview:** When you click any Mega Menu block in the Theme Editor sidebar, the theme automatically opens that mega menu in the live preview so you can see your visual edits instantly in real time (just like Elementor).

### 3. Dynamic Testimonials (`sections/why-choose-us.liquid`)
- Add, remove, and reorder testimonial reviews as modular blocks.
- **Block settings:** Quote text, author name, and star rating.
- **Theme Editor Live Preview:** Clicking any testimonial block in the Theme Editor sidebar instantly transitions the live preview to that review.

### 4. Collections & Featured Products (`sections/collections-list.liquid`, `sections/best-sellers.liquid`)
- Connect any collection from your Shopify Admin.
- Custom collection cards with dynamic titles, descriptions, and custom images.
- Product cards automatically display Shopify pricing, compare-at pricing, sold-out badges, and real variant photos.

### 5. Slide-Out Cart Drawer (`sections/cart-drawer.liquid`)
- Built-in Free Shipping Goal Progress Bar with configurable threshold (`Settings > Free shipping threshold`).
- Dynamic promo code engine supporting native Shopify discount codes (e.g. `HEART10`).
- Customizable promo placeholder text, apply button label, subtotal label, delivery text, and perk banner copy.
- Instant item stepper (`+` / `-`), item removal, and redirect to native checkout.

---

## 🏷️ Product Tagging Conventions

The theme automatically reads product tags to power badges and catalog filter chips:

| Tag Format | Example | Behavior |
| :--- | :--- | :--- |
| `badge:<TEXT>` | `badge:BEST SELLER`, `badge:NEW` | Renders a gold or pink luxury badge over the product image |
| `shape:<NAME>` | `shape:Almond`, `shape:Coffin`, `shape:Square` | Connects product to Shop by Design shape filter chips |
| `length:<NAME>`| `length:Short`, `length:Medium`, `length:Long` | Connects product to Shop by Design length filter chips |
| `colour:<NAME>`| `colour:Pink`, `colour:Nude`, `colour:Red` | Connects product to Shop by Design colour filter swatches |

---

## ⚙️ Shopify Admin Setup Checklist

Before launching your store, ensure the following settings are configured in your **Shopify Admin (`/admin`)**:

### 1. Activate Payments (Checkout Error Fix)
If you see the error `"This store isn't set up to receive orders yet"`, your Shopify payment provider is not yet activated:
1. Go to **Shopify Admin > Settings > Payments**.
2. Click **Activate Shopify Payments** (or connect **PayPal / Stripe**).
3. For testing without real credit cards, scroll to **Payment providers**, enable **(for testing) Bogus Gateway**, and click **Save**.

### 2. Configure Shipping Zones & Rates
1. Go to **Shopify Admin > Settings > Shipping and delivery**.
2. Under **General shipping rates**, click **Manage**.
3. In your domestic zone (e.g., United Kingdom), ensure you have:
   - **Standard Delivery:** e.g., £3.99 for orders under £30.00.
   - **Free Tracked Delivery:** £0.00 for orders £30.00 and above.
4. Go to **Online Store > Themes > Customize > Theme settings > Cart & Shipping**:
   - Set **Free Shipping Threshold** to `30`.
   - Set **Standard Shipping Rate** to `3.99`.

### 3. Verify Active Markets
1. Go to **Shopify Admin > Settings > Markets**.
2. Confirm your Primary Market (e.g., United Kingdom) is set to **Active**.
3. If selling internationally, add shipping zones to the respective international markets.

---

## 🚀 Theme Installation & Updates

1. In your Shopify Admin, go to **Online Store > Themes**.
2. In the **Theme library** section, click **Add theme > Upload zip file**.
3. Select `press-by-heart.zip` and click **Upload**.
4. Once uploaded, click **Actions > Publish** to make it your live store theme.
