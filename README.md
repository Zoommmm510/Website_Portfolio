# Aerospace Portfolio Website

This is a local multi-page portfolio app for an undergraduate aerospace engineering student.

## What it includes

- `index.html` for the public-facing portfolio site
- `request.html` for verified portfolio access requests
- `portfolio.html` for a print-ready generated portfolio packet
- `admin.html` for adding and editing projects locally
- Category cards with hoverable sub-fields
- Filterable project cards and a project detail modal
- A staged `Request Portfolio` form with sequential field unlocks
- Field-specific, alphabetized company/institution dropdowns
- Imported California aerospace/aeronautical company directory in `company-directory.js`
- Admin tools for suggested gallery ordering and generated portfolio pages
- Local browser storage for drafts, with optional Supabase cloud sync for GitHub Pages

## Run locally

Open `index.html` directly, or serve the folder:

```powershell
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

If port `5500` is blocked on your machine, try `9000` instead.

## How to use the admin page

1. Open `http://localhost:5500/admin.html`
2. Update your name, school, year, and notification email
3. Add projects with category, sub-field, descriptions, tags, and image paths
4. Upload project images or use hosted image URLs
5. If Supabase is configured, sign in under Cloud Sync and push/pull shared data

## GitHub Pages deployment

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.
It publishes only the public site files to GitHub Pages:

- `index.html`
- `request.html`
- `portfolio.html`
- shared CSS/JS/data files
- Supabase public client config

It does not publish:

- `admin.html`
- `admin.js`
- `supabase-schema.sql`
- this README

To enable it on GitHub:

1. Push the repo to GitHub.
2. Go to repository Settings -> Pages.
3. Under Build and deployment, set Source to GitHub Actions.
4. Push to `main` or run the workflow manually.
5. Add your custom domain in Settings -> Pages when ready.

Keep using local admin at:

```text
http://localhost:5500/admin.html
```

## Supabase cloud setup

GitHub Pages is static, so shared admin edits need a backend. This repo is wired for Supabase:

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL editor.
3. Create your admin user in Supabase Authentication.
4. Add that user to `portfolio_admins` using the SQL comment at the bottom of `supabase-schema.sql`.
5. Copy your Supabase project URL and anon/publishable key into `supabase-config.js`.
6. Start local admin, sign in under Cloud Sync, then choose `Push Local Data`.

The public GitHub Pages site will read projects/settings from Supabase. The request form will insert requests into Supabase when configured. Uploaded admin images go to the public `portfolio-media` storage bucket after you sign in.

Never put a Supabase service-role key in browser files or GitHub Pages.

## Important note about verification and email

The `Request Portfolio` flow is still a lightweight verification flow:

- It unlocks fields progressively
- It checks for a professional-style work email
- It stores requests in Supabase when configured
- It falls back to local browser storage and a prefilled email draft when Supabase is unavailable

True company verification, LinkedIn verification, and automatic email notifications require external verification/email APIs.
