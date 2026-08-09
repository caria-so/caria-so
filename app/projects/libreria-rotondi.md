---
title: Libreria Rotondi
summary: Full e-commerce rebuild for Rome's esoteric bookshop.
status: live
date: 2024–present
role: Solo developer
client: Libreria Rotondi
services:
  - product
  - development
desktop_cover: /static/assets/images/projects/libreria_rotondi/desktop_cover.png
mobile_cover: 
pattern: lr-pattern-dots
technologies:
  - WordPress
  - WooCommerce
  - PHP
  - Nexi XPay
  - ACF
  - ATUM
live_link: https://libreriarotondi.it
github_link:
accent: hatch-ecommerce
related_posts:
  - ux__checkout-optimization

sections:
  - type: text
    title: The Problem
    content: |
      <p>A historical esoteric bookshop in Rome with 20,000+ items, messy catalog, broken checkout, poor sync, a clucky event management system and a hosting environment held together with tape.</p>

  - type: metrics
    items:
      - value: "20k+"
        label: Products synced
      - value: "3"
        label: Payment gateways
      - value: "0"
        label: UI Builders
      - value: "100%"
        label: Business Tailored solutions

  - type: split
    title: Payment Rework
    content: |
      <p>Migrated from PayPal PPCP (silent <code>onApprove</code> failures) to
      Nexi XPay Build v3 with iframe styling, fallback flow, and proper error capture. Il checkout è stato completamente ridisegnato con un plugin per overw</p>
    image: /static/images/projects/rotondi-payment.jpg
    reverse: false

  - type: code
    title: Stock Sync Fix
    filename: sync-handler.php
    content: |
      // Before: set_product_stock() reset WC stock on every sync
      // After: differential updates via _rotondi_synced_capacity meta
      function sync_stock_differential( $product_id, $new_capacity ) {
          $prev = get_post_meta( $product_id, '_rotondi_synced_capacity', true );
          if ( $prev === $new_capacity ) return;
          update_post_meta( $product_id, '_rotondi_synced_capacity', $new_capacity );
          wc_update_product_stock( $product_id, $new_capacity );
      }

  - type: split
    title: Event System
    content: |
      <p>Custom taxonomy restructure — <code>iniziative</code> parent with children
      <code>eventi</code>, <code>corsi</code>, <code>visite-guidate</code>,
      <code>lettura-tarocchi</code>. Waitlist, capacity tracking, "Tutto esaurito" notices.</p>
    image: /static/images/projects/rotondi-events.jpg
    reverse: true

  - type: callout
    title: Key Takeaway
    content: |
      <p>The hardest part wasn't the code — it was untangling years of plugin conflicts
      and undocumented customizations without breaking the live store.</p>

  - type: gallery
    title: Mobile UX
    images:
      - src: /static/images/projects/rotondi-mobile-1.jpg
        alt: Cart dropdown
      - src: /static/images/projects/rotondi-mobile-2.jpg
        alt: Checkout flow
      - src: /static/images/projects/rotondi-mobile-3.jpg
        alt: PDP
---