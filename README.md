# XvidDwnloadr

Save videos from public X posts. One product, one link.

**Live:** https://xviddwnloadr-xariaskyes-projects.vercel.app

Paste a post URL. XvidDwnloadr pulls the video, plays it, and gives you the file. Phone, tablet, or computer. The site is the product. iOS, Android, and browser extensions ship from this same repo.

## Use it

1. Open the live link.
2. Paste a public post, like `https://x.com/user/status/123`.
3. Hit Download. Play it, or save the file.

A direct link works too. Put the post URL after `?url=`.

Example: https://xviddwnloadr-xariaskyes-projects.vercel.app/?url=https://x.com/user/status/123

Swap `https://x.com/user/status/123` for the real post. Opening that link fills the box for you.

## Where it runs

| Surface | Status |
| --- | --- |
| Web | Live on Vercel |
| iPhone app | Planned. App Store build from this repo |
| Android app | Planned. Play Store build from this repo |
| Desktop | Planned as browser extensions, not a separate app |

GitHub Pages is off on purpose. Do not publish a second URL.

## Project layout

- `public/` is the web app.
- `api/` is the optional Vercel proxy.
- `scripts/download.mjs` is the terminal version.
- `action.yml` is the workflow form of the same download.

Local web preview:

```bash
npx vercel dev
```

Terminal download:

```bash
node scripts/download.mjs "https://x.com/user/status/123"
```

## Notes

Public video posts only. Photos, private accounts, and deleted posts will not download. The downloader depends on x-downloader.com, so if that service is down, this is down.

Personal use. Do not scrape accounts or repost other people's videos.

Download flow adapted from [TwitterXVideoDownloader/x-twitter-video-downloader-workflow](https://github.com/TwitterXVideoDownloader/x-twitter-video-downloader-workflow), MIT.
