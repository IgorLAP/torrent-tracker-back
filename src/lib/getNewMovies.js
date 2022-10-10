const { autoScroll } = require("../helpers/autoScroll");

async function getNewMovies(page, queryParam) {
  await page.goto(
    `https://torrentgalaxy.to/torrents-hotpicks.php?cat=${queryParam}`,
    {
      waitUntil: "load",
      timeout: 0,
    }
  );
  await autoScroll(page);
  const movies = await page.evaluate(() => {
    const hotPicks = Array.from(document.querySelectorAll(".hotpicks"));
    const formatted = hotPicks.map((item) => ({
      link: item.querySelector("a").href,
      name: item.querySelector("img").alt,
      poster: item.querySelector("img").src,
    }));
    return formatted;
  });
  return movies;
}

module.exports = { getNewMovies };
