# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BLAIR.BIZ is the website for Blair Anderson's custom software agency, a full-service software, automation, and AI consultancy based in Kirkland, WA. The consulting fee is $15K/week for onsite engagements where Blair directly architects solutions and ships code alongside your team.

This site serves as the public face of the business: establishing authority, attracting clients, and showcasing expertise in custom software, automation, and AI. Built with Jekyll using the Beautiful Jekyll theme, deployed to Cloudflare Pages via GitHub Actions.

## Development Commands

```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve

# Build the site
bundle exec jekyll build

# Build with future-dated posts visible
bundle exec jekyll build --future
```

## Architecture

- **Theme**: Beautiful Jekyll (forked, not gem-based) — layouts, includes, and assets are all local
- **Config**: `_config.yml` controls site-wide settings (navbar, social links, colors, analytics)
- **Layouts**: `_layouts/` — `base.html` is the root; `home.html` for the homepage; `page.html` and `post.html` extend `base.html`
- **Content**: Blog posts in `_posts/` (format: `YYYY-MM-DD-title.md`), standalone pages as root-level `.md` files
- **Includes**: `_includes/` — partials for nav, footer, header, analytics, social sharing
- **Assets**: `assets/css/` for stylesheets, `assets/js/` for scripts, `assets/img/` for images
- **Data**: `_data/cards.yml` defines the hero cards linking to service sections

## Site Pages

- **Homepage** (`index.html`): Agency pitch, credibility bar, CTA, then blog post feed
- **Services** (`services.md`): Three sections with anchor IDs — Custom Software, AI & Automation, Consulting & Strategy
- **About** (`about.md`): Blair's background and journey (redirects from old `/aboutme/` URL)
- **Selected Work** (`case-studies.md`): Project highlights with Problem/Approach/Outcome format
- **Contact** (`contact/index.html`): Form powered by RizzForms (`forms.rizzness.com/f/nceHpcg0`)
- **Thanks** (`thanks/index.md`): Post-form-submission confirmation

## Key Conventions

- All pages need YAML front matter (even if empty `---\n---`) to be processed by Jekyll
- Posts use `layout: post` by default; other pages use `layout: page` (configured in `_config.yml` defaults)
- Permalink structure: `/:title/`
- Plugins: `jekyll-paginate`, `jekyll-sitemap`, `jekyll-redirect-from`
- Google Analytics via gtag (`G-EP3QCV5FNX`)
- The `_site/` directory is the build output — do not edit files there directly
- Contact form uses RizzForms (not Netlify). API key in `.env.local`.
- Service section anchors use explicit kramdown IDs: `{#custom-software}`, `{#ai-automation}`, `{#consulting}`
