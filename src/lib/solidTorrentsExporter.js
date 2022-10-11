async function solidTorrentsExporter(page) {
  const torrents = await page.evaluate(() => {
    const notNull = document.querySelector(".card.search-result.my-2");
    if (!notNull) {
      return [];
    }

    function seedFormatter(seed) {
      if (!seed || !seed.includes("K")) return seed;
      if (seed.includes(".")) {
        return seed.replace(".", ",").replace("K", "00");
      }
      return seed.replace("K", "000");
    }

    const tableColumns = Array.from(
      document.querySelectorAll(".card.search-result.my-2")
    );

    const formatted = tableColumns.map((item) => ({
      name: item.querySelector("h5.title").innerText,
      link: item.querySelector("div.links a:last-child")?.href,
      size: item.querySelector("div.stats div:nth-child(2)")?.innerText,
      seed: seedFormatter(
        item.querySelector("div.stats div:nth-child(3)")?.innerText
      ),
    }));

    return formatted.filter((item) => item.link).splice(0, 10);
  });
  return torrents;
}

module.exports = { solidTorrentsExporter };
