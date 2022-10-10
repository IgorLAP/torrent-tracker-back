async function torrentCsvExporter(page) {
  const torrents = await page.evaluate(() => {
    const notNull = document.querySelectorAll("tbody");
    if (!notNull) {
      return [];
    }
    const tableColumns = Array.from(document.querySelectorAll("tbody tr"));

    const formatted = tableColumns.map((item) => ({
      name: item.querySelector("td.search-name-cell a").innerHTML,
      link: item.querySelector("td.search-name-cell a").href,
      size: item.querySelector("td.text-right.text-muted:nth-child(2)")
        .innerHTML,
      seed: item.querySelector("td.text-right.text-success span").innerHTML,
    }));

    return formatted.splice(0, 10);
  });
  return torrents;
}

module.exports = { torrentCsvExporter };
