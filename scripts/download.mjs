const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/download.mjs <x-or-twitter-status-url>");
  process.exit(1);
}

const validate = await fetch("https://api.x-downloader.com/validate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url })
});
const validated = await validate.json();
if (validated.status === "error") {
  console.error("Invalid X video URL");
  process.exit(1);
}

const request = await fetch("https://api.x-downloader.com/request", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url })
});
const job = await request.json();
if (!job._id) {
  console.error("No job id", job);
  process.exit(1);
}

const started = Date.now();
while (Date.now() - started < 90000) {
  const status = await fetch("https://api.x-downloader.com/download/" + job._id);
  const data = await status.json();
  if (data.status === "error") {
    console.error("Job failed", data);
    process.exit(1);
  }
  if (data.status === "finished") {
    console.log("https://" + data.host + "/" + data.filename);
    process.exit(0);
  }
  await new Promise((r) => setTimeout(r, 2000));
}
console.error("Timed out waiting for " + job._id);
process.exit(1);
