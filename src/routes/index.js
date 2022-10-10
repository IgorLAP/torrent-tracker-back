const { Router } = require("express");

const { getBrowserInstance } = require("../config/getBrowserInstance");
const { queryFormatter } = require("../helpers/queryFormatter");
const { limeExporter } = require("../lib/limeExporter");
const { sevenExporter } = require("../lib/sevenExporter");
const { torrentCsvExporter } = require("../lib/torrentCsvExporter");
const { torrentGalaxyExporter } = require("../lib/torrentGalaxyExporter");
const { getNewMovies } = require("../lib/getNewMovies");

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

    const providers = [
      {
        pattern: "sevenPattern",
        url() {
          return `https://www.1337xx.to/search/${this.correctQuery}/1/`;
        },
        exporter: sevenExporter,
      },
      {
        pattern: "limePattern",
        url() {
          return `https://www.limetorrents.lol/search/all/${this.correctQuery}/seeds/1/`;
        },
        exporter: limeExporter,
      },
      {
        pattern: "torrentCsvPattern",
        url() {
          return `https://torrents-csv.ml/#/search/torrent/${this.correctQuery}/1`;
        },
        exporter: torrentCsvExporter,
      },
      {
        pattern: "torrentGalaxyPattern",
        url() {
          return `https://torrentgalaxy.to/torrents.php?search=${this.correctQuery}&lang=0&nox=2&sort=seeders&order=desc`;
        },
        exporter: torrentGalaxyExporter,
      },
    ];

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

    torrents.sort(
      (a, b) =>
        Number(b.seed.replace(",", "")) - Number(a.seed.replace(",", ""))
    );

    await browser.close();
    res.json({ torrents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router };
