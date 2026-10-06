function isXUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const okHost = host === "x.com" || host === "twitter.com" || host === "mobile.x.com" || host === "mobile.twitter.com";
    return okHost && /\/status\/\d+/.test(u.pathname);
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });

  const url = String((req.body && req.body.url) || "").trim();
  if (!isXUrl(url)) {
    return res.status(400).json({
      error: "Paste a full post link, like https://x.com/user/status/123"
    });
  }

  const validate = await fetch("https://api.x-downloader.com/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ url })
  });
  const validated = await validate.json().catch(() => ({}));
  if (validated.status === "error") {
    return res.status(400).json({ error: "That link was rejected as an invalid X video URL." });
  }

  const request = await fetch("https://api.x-downloader.com/request", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ url })
  });
  const job = await request.json().catch(() => ({}));
  if (!job._id) {
    return res.status(502).json({
      error: "Downloader did not start a job. The post may have no video, or the service is busy.",
      detail: job
    });
  }

  return res.status(200).json({ job_id: job._id, status: "queued" });
};
