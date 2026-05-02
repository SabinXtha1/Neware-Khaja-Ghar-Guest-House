# Redesign Landing Page with Framer Motion & Micro-interactions

The goal is to revamp the Neware Khaja Ghar landing page to feature a highly dynamic, "React Bits" style aesthetic. We will introduce smooth micro-interactions, scroll animations, and text reveals using Framer Motion to make the page feel premium, interactive, and alive.

## User Review Required

> [!IMPORTANT]
> The current landing page (`app/page.tsx`) is a Server Component fetching data from MongoDB. To add Framer Motion animations, I will need to extract the UI sections into Client Components (e.g., `<HeroSection />`, `<FeaturedRooms />`) while passing the fetched data to them as props. This ensures we keep SEO and initial load performance while adding interactivity.

## Open Questions

> [!WARNING]
> React Bits is a collection of components that can be installed via CLI or copy-pasted. Since there are many components (e.g., animated backgrounds, text effects), I plan to build high-quality Framer Motion animations from scratch that mimic the "React Bits" aesthetic (Text Reveal, Fade In, Spring Hover effects). If you have specific React Bits components in mind (like a specific background or text effect), please let me know!

## Proposed Changes

---

### Landing Page Components

I will create a set of client-side animated components that will be used in the main page.

#### [NEW] `components/landing/hero-section.tsx`
- A client component (`"use client"`) implementing the Hero section.
- Uses Framer Motion for staggered text reveals and button spring animations.
- Introduces a subtle floating animation for background elements.

#### [NEW] `components/landing/animated-section.tsx`
- A wrapper component to handle scroll animations (`whileInView`).
- Will wrap the "Featured Rooms", "Culinary Delights", and "Why Choose Us" sections so they fade and slide in smoothly as the user scrolls down.

#### [NEW] `components/landing/feature-card.tsx`
- A client component for the individual Room, Food, and Feature cards.
- Adds micro-interactions on hover: slight scaling (`scale: 1.05`), shadow lifting, and a subtle icon bounce.

---

### Main Application Page

#### [MODIFY] `app/page.tsx`
- Keep the server-side data fetching (`await Room.find()`, `await FoodItem.find()`).
- Replace the static HTML sections with the new animated Client Components.
- Pass the fetched `rooms` and `foodItems` down as props.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure no hydration or server/client boundary errors.

### Manual Verification
- Start the dev server (`npm run dev`) and verify that:
  - The hero text animates smoothly on page load.
  - Scrolling down triggers fade-in animations for the rooms and food items.
  - Hovering over cards triggers the scale and shadow micro-interactions.
  - The navbar and responsive design remain intact.
