const express = require("express");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

let status = "Idle";

// SSE route for progress updates
app.get("/progress", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const send = (msg) => res.write(`data: ${msg}\n\n`);

    send(status);

    const interval = setInterval(() => {
        send(status);
    }, 1000);

    req.on("close", () => {
        clearInterval(interval);
    });
});

// Get total file size
app.get("/zip-size", async (req, res) => {
    const dirPath = path.join(__dirname, "wallpapers");
    let totalSize = 0;

    const files = await fs.promises.readdir(dirPath);
    for (const file of files) {
        const stat = await fs.promises.stat(path.join(dirPath, file));
        totalSize += stat.size;
    }

    res.json({ size: totalSize });
});

// Download ZIP
app.get("/download", (req, res) => {
    status = "Starting ZIP process...";
    const zipName = "wallpapers.zip";
    res.setHeader("Content-Disposition", `attachment; filename=${zipName}`);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("progress", (p) => {
        status = `Zipping files... ${(p.fs.processedBytes / 1024 / 1024).toFixed(2)} MB processed`;
    });

    archive.on("error", (err) => {
        status = `Error: ${err.message}`;
        res.status(500).end();
    });

    archive.on("end", () => {
        status = "Done!";
        setTimeout(() => (status = "Idle"), 2000);
    });

    archive.pipe(res);
    archive.directory(path.join(__dirname, "wallpapers"), false);
    archive.finalize();
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
