---
title: Libreria Rotondi
summary: Digital platform and e-commerce rebuild for Rome's historic esoteric bookshop.
status: live
date: 2024–present
role: UX Consultant & Lead Developer
client: Libreria Rotondi
services:
  - product
  - UX
image: /static/assets/images/projects/libreria_rotondi/desktop_cover.webp
desktop_cover: /static/assets/images/projects/libreria_rotondi/desktop_cover.webp
mobile_cover:
pattern: lr-pattern-dots
technologies:
  - WordPress
  - WooCommerce
  - PHP
  - ACF Pro
  - YITH POS
  - Nexi XPay
  - Embla Carousel
  - GA4
live_link: https://libreriarotondi.it
github_link:
accent: hatch-ecommerce
related_posts:
  - ux__checkout-optimization

sections:
  - type: text
    title: The Problem
    content: |
      <p>Libreria Rotondi is one of Rome's oldest esoteric bookshops, with a catalog of more than 18,000 products spanning esotericism, Eastern philosophy, rare books and antiquarian texts. The existing WooCommerce store had grown around the needs of the catalog rather than the needs of the business: the product data was difficult to manage, the checkout created unnecessary friction, events required separate manual workflows, and online and in-store sales were not treated as one system. The technical environment was equally constrained. WordPress and WooCommerce had to remain in place because of existing supplier integrations, staff familiarity and the YITH POS setup. The site also ran on shared hosting with a small team responsible for day-to-day operations. The goal was therefore not simply to replace the storefront, but to turn an increasingly fragile e-commerce installation into a platform the owners could actually operate themselves.</p>
    image: /static/assets/images/projects/libreria_rotondi/page_checkout_payment.webp
    caption: |
      The checkout was redesigned around a clearer one-page flow, with delivery options and Nexi XPay integrated into the same experience.

  - type: metrics
    items:
      - value: "20k+"
        label: Items
      - value: "2"
        label: Sales channels
      - value: "4"
        label: Custom plugins
      - value: "100%"
        label: Business-tailored

  - type: split
    title: Full site rework
    content: |
      <p>The project became a full rebuild of the digital experience. I redesigned the information architecture, product taxonomy, navigation, archives, product cards and responsive layouts while removing unnecessary dependencies and replacing fragile third-party functionality with purpose-built systems. The new theme introduced a shared design system with light and dark modes, custom typography, namespaced components and a consistent visual language across books, events, courses and guided visits. Homepage and archive pages were rebuilt, togehter with product page and checkout to support both ordinary book purchases and mixed book-and-event carts.</p>
    image: /static/assets/images/projects/libreria_rotondi/desktop_cover.webp
    caption: |
      A custom theme and design system reorganise the experience around the bookshop's identity, content and program of events.
    reverse: true

  - type: split
    title: Payment Rework
    content: |
      <p>The checkout was rebuilt as a dedicated <code>rotondi-checkout</code> plugin. The new flow uses a one-step checkout layout with numbered sections, delivery or pickup selection, live order-summary updates and a payment step designed around Nexi XPay. Shipping is calculated dynamically from WooCommerce shipping zones. Event-only carts automatically remove the shipping section, while mixed carts retain the appropriate delivery flow. The order-pay page was also brought into the same visual system for redirect and retry scenarios.</p>
    image: /static/assets/images/projects/libreria_rotondi/page_checkout_payment.webp
    caption: |
      The payment form moves away from the standard WooCommerce pattern into a more usable one-page checkout with multiple payment methods and embedded Nexi XPay.
    reverse: false

  - type: code
    title: Stock Sync Fix
    filename: sync-handler.php
    content: |
      // Before: saving an event could reset WooCommerce stock to full capacity.
      // After: capacity changes are applied differentially.
      function sync_stock_differential( $product_id, $new_capacity ) {
          $prev = get_post_meta(
              $product_id,
              '_rotondi_synced_capacity',
              true
          );

          if ( $prev === $new_capacity ) {
              return;
          }

          update_post_meta(
              $product_id,
              '_rotondi_synced_capacity',
              $new_capacity
          );

          wc_update_product_stock(
              $product_id,
              $new_capacity
          );
      }

  - type: split
    title: Event System
    content: |
      <p>The previous event workflow was replaced with a custom event management system that connects an ACF-managed <code>eventi</code> post type directly to WooCommerce. Staff can create an event once and the system generates and maintains its corresponding product, including price, stock, categories and metadata.</p>
      <p>Multi-slot events are represented as variable products, giving each session its own capacity and price. Registrations are stored in a dedicated database table with attendee and check-in information, while custom WooCommerce emails handle confirmations, calendar attachments and slot-aware 24-hour reminders. The system also provides an admin dashboard, CSV exports, calendar views and frontend event carousels.</p>
    image: /static/assets/images/projects/libreria_rotondi/page_corsi.webp
    caption: |
      The event and course experience gives the shop a dedicated frontend for its growing program of live activities.
    reverse: true

  - type: methodology
    title: Observe, Prototype, Replace
    content: |
      <p>Started in the shop — watching how staff handled stock, events, POS sales and the edge cases that don't survive a brief. Built working versions early so the owners could react to something concrete instead of approving wireframes.</p>
    detail_label: Process & decisions
    case_study:
      problem: |
        <p>18K+ products, fragile WooCommerce install, event workflows duct-taped together, online and in-store sales disconnected. The owners knew the business cold but couldn't spec the platform — requirements only surfaced by watching the shop operate.</p>
      role: |
        <p>UX consultant and lead developer — strategy through implementation, no handoff layer.</p>
      method: |
        <p>In-store observation → rapid prototypes → continuous feedback via weekly calls, chat and shared docs → incremental replacement of live systems without downtime.</p>
      decisions: |
        <p><strong>Keep WordPress/WooCommerce</strong> — staff knew it, YITH POS depended on it, supplier integrations were wired in. Remove complexity from their workflows, don't add a new platform to learn.</p>
        <p><strong>Prototype the hard parts first</strong> — checkout, mixed carts, event capacity and loyalty mechanics. Their edge cases were impossible to understand from docs alone.</p>
        <p><strong>Observe before abstracting</strong> — in-store visits separated real requirements from assumptions about how e-commerce should work.</p>
      constraints: |
        <p>Live store — nothing breaks sales. WordPress/WooCommerce non-negotiable. SiteGround shared hosting. Small team with limited technical capacity; admin workflows had to be self-service.</p>
      outcome: |
        <p>Staff create events, sell tickets, track capacity, run loyalty mechanics and handle book sales through systems shaped around their actual workflows — no developer needed for daily operations.</p>
      lessons: |
        <p>For a small business with deep domain expertise and limited technical expertise, working prototypes and in-store observation produce better requirements than documentation.</p>
      metrics:
        - label: Feedback loop
          before: "Periodic review"
          after: "Continuous"
        - label: Event creation
          before: "Fragmented workflow"
          after: "Self-service"
        - label: Sales channels
          before: "Disconnected"
          after: "Unified"
      evidence:
        - image: /static/assets/images/projects/libreria_rotondi/page_checkout_payment.webp
          caption: Iterative checkout work — testing the complete purchase flow with the owners before refining the final interaction patterns.
        - image: /static/assets/images/projects/libreria_rotondi/page_eventi.webp
          caption: Event system iteration — translating operational requirements around sessions, capacity and registrations into a self-service interface.

  - type: split
    title: Loyalty Game
    content: |
      <p>For the shop's 85th anniversary, I designed and built the <em>Gioco dell'Oca Iniziatico</em>, a six-tier loyalty game integrated directly into WooCommerce. Customers purchase a membership card and progress through a 24-square board based on their spending, unlocking discounts, rare books and exclusive experiences.</p>
      <p>The system tracks completed orders from both the online store and YITH POS, prevents duplicate credits, supports manual adjustments and provides a complete prize-fulfillment workflow. A universal <code>oca5</code> coupon is validated server-side against player status, allowing staff to apply the correct benefit in-store without managing individual customer coupon codes.</p>
    image: /static/assets/images/projects/libreria_rotondi/dashboard.webp
    caption: |
      Custom administrative tooling gives the team visibility over players, progress, prizes and fulfillment without exposing the underlying complexity.
    reverse: true

  - type: split
    title: Operational tooling
    content: |
      <p>The platform also includes a set of smaller systems designed around real operational problems: antiquarian books with no fixed price are converted into inquiry flows instead of allowing invalid €0 purchases; past Patreon-recorded events are protected from direct URL purchases; event managers can manually mark individual sessions as sold out; and stock indicators make capacity visible at a glance.</p>
      <p>SEO and infrastructure were treated as part of the product rather than an afterthought. Thin author taxonomy pages were removed from the sitemap, enriched author pages were retained, bot traffic was mitigated at the server level, GA4 e-commerce tracking was implemented behind consent management, and frontend dependencies such as Embla were consolidated into the theme.</p>
    image: /static/assets/images/projects/libreria_rotondi/dashboard.webp
    caption: |
      Administrative interfaces turn complex WooCommerce data into tools that staff can use during everyday operations.
    reverse: false

  - type: gallery
    title: Responsive experience
    images:
      - src: /static/assets/images/projects/libreria_rotondi/page_autocomplete.webp
        alt: Search autocomplete
      - src: /static/assets/images/projects/libreria_rotondi/page_eventi.webp
        alt: Events list
      - src: /static/assets/images/projects/libreria_rotondi/page_pdp.webp
        alt: Product page
  
  - type: callout
    title: E-commerce that fits the business, not the other way around
    content: |
      <p>I build platforms around how shops actually operate — not how CMS and templates thinks they should.</p>
    button: Get in touch
---
