const { limeExporter } = require("../lib/limeExporter");
const { sevenExporter } = require("../lib/sevenExporter");
const { solidTorrentsExporter } = require("../lib/solidTorrentsExporter");
const { torrentCsvExporter } = require("../lib/torrentCsvExporter");
const { torrentGalaxyExporter } = require("../lib/torrentGalaxyExporter");

const providers = [
  {
    pattern: "seven",
    url() {
      return `https://www.1337xx.to/search/${this.correctQuery}/1/`;
    },
    exporter: sevenExporter,
  },
  {
    pattern: "limeTorrents",
    url() {
      return `https://www.limetorrents.lol/search/all/${this.correctQuery}/seeds/1/`;
    },
    exporter: limeExporter,
  },
  {
    pattern: "torrentCsv",
    url() {
      return `https://torrents-csv.ml/#/search/torrent/${this.correctQuery}/1`;
    },
    exporter: torrentCsvExporter,
  },
  {
    pattern: "torrentGalaxy",
    url() {
      return `https://torrentgalaxy.to/torrents.php?search=${this.correctQuery}&lang=0&nox=2&sort=seeders&order=desc`;
    },
    exporter: torrentGalaxyExporter,
  },
  {
    pattern: "solidTorrents",
    url() {
      return `https://solidtorrents.to/search?q=${this.correctQuery}`;
    },
    exporter: solidTorrentsExporter,
  },
];

module.exports = { providers };
