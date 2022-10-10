async function sevenExporter(page) {
  const torrents = await page.evaluate(() => {
    const notNull = document.querySelector("tbody tr");
    if (!notNull) {
      return [];
    }
    const tableColumns = Array.from(document.querySelectorAll("tbody tr"));
    const formatted = tableColumns.map((item) => ({
      name: item.querySelector("td:nth-child(1) a:last-child").innerHTML,
      link: item.querySelector("td:nth-child(1) a:last-child").href,
      seed: item.querySelector("td:nth-child(2)").innerHTML,
      size: item.querySelector("td:nth-child(5)").innerHTML,
    }));
    return formatted.splice(0, 10);
  });
  return torrents;
}

module.exports = { sevenExporter };
