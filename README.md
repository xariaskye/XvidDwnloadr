# XvidDwnloadr

Paste an X (Twitter) post link and download the video. Works in the browser on your phone, tablet, or computer. No app store install.

Built from the download flow in [TwitterXVideoDownloader/x-twitter-video-downloader-workflow](https://github.com/TwitterXVideoDownloader/x-twitter-video-downloader-workflow) (MIT). That repo is a GitHub Action, not something you can open on a phone, so this project wraps the same `api.x-downloader.com` steps in a web app.

## Use it

1. Open the deployed site (Vercel) or run it locally.
2. Paste a post URL such as `https://x.com/user/status/123`.
3. Hit Download. When the job finishes, play it or save the file.

On iPhone: Safari → Share → Add to Home Screen. On Android: Chrome menu → Install app / Add to Home screen.

You can also open `/?url=https://x.com/user/status/123`.

## How the download works

Same three calls as the original Action:

1. `POST https://api.x-downloader.com/validate` with `{ url }`
2. `POST https://api.x-downloader.com/request` with `{ url }` → job id
3. `GET https://api.x-downloader.com/download/{jobId}` until `status` is `finished`
4. File URL is `https://{host}/{filename}`

The browser talks to `/api/download` and `/api/status` on this app so the third-party API is not blocked by CORS.

## Run locally

```bash
npx vercel dev
```

Or, if you only want the CLI (Node 18+):

```bash
node scripts/download.mjs "https://x.com/user/status/123"
```

## Limits

- Depends on x-downloader.com. If that service is down or rate-limits you, this tool fails too.
- Only public posts that actually contain a video. Photos, private accounts, and deleted posts will not download.
- For personal use. Do not scrape accounts or republish other people's videos.

Powered by [x-downloader.com](https://x-downloader.com).
