async function torrentGalaxyExporter(page) {
  const torrents = await page.evaluate(() => {
    const notNull = document.querySelector("div.tgxtable");
    if (!notNull) {
      return [];
    }
    const tableColumns = Array.from(
      document.querySelectorAll("div.tgxtable div.tgxtablerow")
    );

    const formatted = tableColumns.map((item) => ({
      name: item
        .querySelector("div.tgxtablecell.clickable-row a:nth-child(1)")
        .innerHTML.replace("<b>", "")
        .replace("</b>", ""),
      link: item.querySelector("div.tgxtablecell.clickable-row a:nth-child(1)")
        .href,
      size: item.querySelector(
        "div.tgxtablecell.collapsehide span.badge.badge-secondary"
      ).innerHTML,
      seed: item
        .querySelector(
          "div.tgxtablecell.collapsehide span[title='Seeders/Leechers'] font[color='green']"
        )
        .innerHTML.replace("<b>", "")
        .replace("</b>", ""),
    }));

    return formatted.splice(0, 10);
  });
  return torrents;
}

module.exports = { torrentGalaxyExporter };
