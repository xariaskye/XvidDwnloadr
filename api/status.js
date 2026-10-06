module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });

  const id = String(req.query.id || "").trim();
  if (!/^[a-zA-Z0-9_-]{6,}$/.test(id)) {
    return res.status(400).json({ error: "Missing job id." });
  }

  const response = await fetch("https://api.x-downloader.com/download/" + id);
  const data = await response.json().catch(() => ({}));
  if (data.status === "error") {
    return res.status(502).json({ error: "Download job failed.", detail: data });
  }
  if (data.status === "finished" && data.host && data.filename) {
    return res.status(200).json({
      status: "finished",
      download_url: "https://" + data.host + "/" + data.filename,
      filename: data.filename
    });
  }
  return res.status(200).json({ status: data.status || "pending" });
};
