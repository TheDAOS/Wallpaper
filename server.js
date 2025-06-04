const express = require("express");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static frontend files
app.use(express.static("public"));

// Route to download ZIP
app.get("/download-wallpapers", (req, res) => {
  const zipName = "wallpapers.zip";
  res.setHeader("Content-Disposition", `attachment; filename=${zipName}`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => res.status(500).send({ error: err.message }));

  archive.pipe(res);

  const wallpapersDir = path.join(__dirname, "wallpapers");
  archive.directory(wallpapersDir, false);

  archive.finalize();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
