const { replaceAll } = require("./replaceAll");

function queryFormatter(query, provider) {
  const firstPattern = {
    " ": "%20",
    "'": "",
    "/": "",
  };
  const secondPattern = {
    " ": "-",
    "'": "%20",
    "/": "-",
  };
  const thirdPattern = {
    " ": "+",
    "'": "%27",
    "/": "%2F",
  };

  let keys;
  let values;
  if (provider === "seven" || provider === "torrentCsv") {
    keys = Object.keys(firstPattern);
    values = Object.values(firstPattern);
  } else if (provider === "limeTorrents") {
    keys = Object.keys(secondPattern);
    values = Object.values(secondPattern);
  } else if (provider === "torrentGalaxy" || provider === "solidTorrents") {
    keys = Object.keys(thirdPattern);
    values = Object.values(thirdPattern);
  }

  let itNeedsFormatter = false;
  for (let i = 0; i < keys.length; i++) {
    if (query.trim().includes(keys[i])) {
      itNeedsFormatter = true;
      break;
    }
  }
  if (!itNeedsFormatter) {
    return query.trim();
  }

  const replaces = [];
  for (let i = 0; i < keys.length; i++) {
    if (replaces.length > 0 && replaces[i - 1]) {
      replaces.push(replaceAll(replaces[i - 1].trim(), keys[i], values[i]));
    }

    if (replaces.length === 0 && query.trim().includes(keys[i])) {
      replaces.push(replaceAll(query.trim(), keys[i], values[i]));
    }
  }
  return replaces[replaces.length - 1];
}

module.exports = { queryFormatter };
