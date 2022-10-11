const { Router } = require("express");

const { getBrowserInstance } = require("../config/getBrowserInstance");
const { queryFormatter } = require("../helpers/queryFormatter");
const { getNewMovies } = require("../lib/getNewMovies");
const { providers } = require("../helpers/providers");

const router = Router();

router.get("/ping", (req, res) => {
  res.json({ pong: true });
});

router.get("/new-movies", async (req, res) => {
  const { cat } = req.query;
  try {
    const browser = await getBrowserInstance();
    const page = await browser.newPage();

    if (cat) {
      const refreshedMovies = await getNewMovies(page, cat);
      res.json({ refresh: true, movies: refreshedMovies });
      return;
    }

    const movies = await getNewMovies(page, "1");
    const fourKMovies = await getNewMovies(page, "2");
    await browser.close();
    res.json({ movies, fourKMovies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/get-link", async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      res.status(400).json({ message: "missing link" });
      return;
    }

    const browser = await getBrowserInstance();
    const page = await browser.newPage();
    await page.goto(link, {
      waitUntil: "load",
      timeout: 0,
    });

    let magnetLink;
    if (link.includes("1337xx.to")) {
      magnetLink = await page.evaluate(
        () => document.querySelector("a#down_magnet").href
      );
    }

    if (link.includes("torrentgalaxy.to")) {
      magnetLink = await page.evaluate(
        () => document.querySelector("a.btn.btn-danger").href
      );
    }

    if (link.includes("limetorrents")) {
      magnetLink = await page.evaluate(() => {
        const torrentTitle = document.querySelector("#content h1").innerHTML;
        return document.querySelector(
          `.downloadarea .dltorrent a[title='Download ${torrentTitle} Magnet']`
        ).href;
      });
    }

    await browser.close();
    res.json({ magnetLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/search-torrents", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ message: "missing query" });
      return;
    }

    const browser = await getBrowserInstance();
    const page = await browser.newPage();

    const torrents = [];
    for (let i = 0; i < providers.length; i++) {
      const middleware = {
        correctQuery: queryFormatter(query, providers[i].pattern),
      };
      await page.goto(providers[i].url.call(middleware), {
        waitUntil: "load",
        timeout: 0,
      });
      torrents.push(...(await providers[i].exporter(page)));
    }

    const formattedTorrents = torrents
      .map((item) => ({ ...item, seed: item.seed.trim().replace(",", "") }))
      .sort((a, b) => Number(b.seed) - Number(a.seed));

    await browser.close();
    res.json({ torrents: formattedTorrents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router };
