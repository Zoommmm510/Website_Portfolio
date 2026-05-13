# Website Portfolio Repository

This repo is organized around the GitHub Pages personal website.

## Folder Map

- `personal-website/` contains the public website pages, shared JavaScript, CSS, Supabase public client config, and deployment-facing files.
- `.github/workflows/deploy-pages.yml` publishes only selected public files from `personal-website/` to GitHub Pages.
- Admin tools such as `admin.html`, `admin.js`, and `supabase-schema.sql` are local-only and ignored by Git.

## Run Locally

Recommended local run command:

```powershell
cd personal-website
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

If you start the server from the repo root instead, the public pages still work through lightweight forwarding pages:

```powershell
python -m http.server 5500
```

```text
http://localhost:5500/index.html
```

## Local Admin

Admin remains local/private and is not pushed to GitHub or published to GitHub Pages. If the local admin files are present in your working copy, use:

```text
http://localhost:5500/admin.html
```

The public website reads project data from `personal-website/data.js` and optional Supabase cloud data.

## GitHub Pages

The GitHub Actions workflow deploys from `personal-website/` and publishes only:

- `index.html`
- `request.html`
- `portfolio.html`
- `favicon.svg`
- shared CSS/JS/data files

It excludes:

- `personal-website/admin.html`
- `personal-website/admin.js`
- `personal-website/supabase-schema.sql`
- repo documentation

That keeps the public site focused on the user-facing pages while local admin and project source materials stay out of the published artifact.

To use GitHub Pages, open the repository on GitHub, go to `Settings -> Pages`, and set `Build and deployment` to `GitHub Actions`.
