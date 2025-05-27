const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Terlalu banyak permintaan, coba lagi nanti." },
    keyGenerator: (req) => {
        return req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use(cors());

const routes = [
    "ytdl", "twitterdl", "igdl", "fbdl", "ttdl", "gitclone", "spotifydl", "aptoide",
    "githubstalk", "searchgroups", "randommeme", "ttsearch", "ytsearch", "npmsearch", "googlesearch", "duckduckgo",
    "pinterest", "spotifysearch", "gistalk", "llama-3.3-70b-versatile", "blackboxai", "gemini",
    "txt2img", "genshinbuild", "tweet", "getpastebin", "ssweb", "translate", "nulis", "cuaca", "qrcodegenerator", "readqr", "emojimix", "removebg",
    "vcc", "cekkhodam", "tahukahkamu", "brat", "qc", "detiknews", "kompasnews"
];

routes.forEach(route => {
    app.use(`/api/${route}`, limiter, require(`./api/${route}`));
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/docs", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "documentation.html"));
});

app.use("/api/*", (req, res) => {
    res.status(404).json({ 
        error: true,
        message: "Endpoint API tidak ditemukan",
        documentation: "/docs"
    });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

module.exports = app;