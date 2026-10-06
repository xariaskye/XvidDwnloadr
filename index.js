const core = require("@actions/core");

async function run() {
  try {
    const videoUrl = core.getInput("video_url");
    let response = await fetch("https://api.x-downloader.com/validate", {
      method: "POST",
      body: JSON.stringify({ url: videoUrl }),
      headers: { "Content-Type": "application/json" }
    });
    let data = await response.json();
    if (data.status === "error") throw new Error("Invalid X video URL");

    response = await fetch("https://api.x-downloader.com/request", {
      method: "POST",
      body: JSON.stringify({ url: videoUrl }),
      headers: { "Content-Type": "application/json" }
    });
    data = await response.json();
    const jobId = data._id;
    if (!jobId) throw new Error("Downloader did not return a job id");

    let downloadUrl = null;
    const started = Date.now();
    while (Date.now() - started < 90000) {
      response = await fetch("https://api.x-downloader.com/download/" + jobId);
      data = await response.json();
      if (data.status === "error") throw new Error("Download job failed");
      if (data.status === "finished") {
        downloadUrl = "https://" + data.host + "/" + data.filename;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    if (!downloadUrl) throw new Error("Timed out waiting for download");

    core.setOutput("download_url", downloadUrl);
    console.log("Video ready: " + downloadUrl);
  } catch (error) {
    core.setFailed("Action failed: " + error.message);
  }
}

run();
