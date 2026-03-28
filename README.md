# OpenClaw Trend Store MVP

A polished, dependency-free storefront MVP for evaluating trend-driven ecommerce opportunities.

## What’s included

- Homepage with hero, featured opportunities, categories, and value props
- Catalog page with searchable/filterable product grid
- Product detail page with metrics, opportunity scoring, and merchandising copy
- Admin-style dashboard with summary KPIs, rankings, and category breakdowns
- Seed data and deterministic scoring logic in plain JavaScript
- Tiny Node server with zero external dependencies

## Run locally

```bash
cd /home/ilk2010/.openclaw/workspace/projects/trend-store-mvp
npm start
```

Then open:

- `http://localhost:3210/`
- `http://localhost:3210/catalog`
- `http://localhost:3210/dashboard`

## Project structure

- `server.js` – lightweight static server
- `public/index.html` – storefront homepage
- `public/catalog.html` – category/product listing
- `public/product.html` – product detail view
- `public/dashboard.html` – admin-like opportunity dashboard
- `public/assets/data.js` – seed catalog data + scoring logic
- `public/assets/app.js` – shared rendering and UI helpers
- `public/assets/styles.css` – design system and layout styles

## Scoring logic

Each product receives an opportunity score from 0–100 based on weighted inputs:

- Demand momentum
- Margin potential
- Competition ease
- Inventory risk
- Repeat purchase potential
- Social proof

The dashboard uses these scores to calculate headline metrics and identify best opportunities.
