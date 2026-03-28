# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BLAIR.BIZ is the website for Blair Anderson's consulting agency — the premiere AI, automation, and custom software consultancy in Kirkland, WA. The consulting fee is $15K/week for onsite engagements where Blair directly architects solutions that propel businesses to the next level.

This site serves as the public face of the business: establishing authority, attracting clients, and showcasing expertise in AI, automation, and software. Built with Jekyll using the Beautiful Jekyll theme, hosted on GitHub Pages.

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
- **Config**: `_config.yml` controls site-wide settings (navbar, social links, colors, analytics, comments)
- **Layouts**: `_layouts/` — `default.html` is the base; `post.html` and `page.html` extend it; `reveal.html` for presentations
- **Content**: Blog posts in `_posts/` (format: `YYYY-MM-DD-title.md`), standalone pages as root-level `.md` files
- **Includes**: `_includes/` — partials for nav, footer, comments, analytics, social sharing
- **Assets**: `assets/css/` for stylesheets, `assets/js/` for scripts, `assets/img/` for images

## Key Conventions

- All pages need YAML front matter (even if empty `---\n---`) to be processed by Jekyll
- Posts use `layout: post` by default; other pages use `layout: page` (configured in `_config.yml` defaults)
- Permalink structure: `/:title/`
- Plugins: `jekyll-paginate`, `jekyll-sitemap`, `jekyll-redirect-from`
- Google Analytics via gtag (`G-EP3QCV5FNX`)
- The `_site/` directory is the build output — do not edit files there directly
