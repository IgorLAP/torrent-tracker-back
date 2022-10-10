async function limeExporter(page) {
  const torrents = await page.evaluate(() => {
    const notNull = document.querySelector("table.table2 tr td");
    if (!notNull) {
      return [];
    }
    const tableColumns = Array.from(
      document.querySelectorAll("table.table2 tr")
    ).filter((_, index) => index !== 0);

    const formatted = tableColumns.map((item) => ({
      name: item.querySelector("td.tdleft .tt-name a:last-child").innerHTML,
      link: item.querySelector("td.tdleft .tt-name a:last-child").href,
      size: item.querySelector("td.tdnormal:nth-child(3)").innerHTML,
      seed: item.querySelector("td.tdseed").innerHTML,
    }));

    return formatted.splice(0, 10);
  });
  return torrents;
}

module.exports = { limeExporter };
