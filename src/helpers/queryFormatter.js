const { replaceAll } = require("./replaceAll");

function queryFormatter(query, provider) {
  const sevenPattern = {
    " ": "%20",
    "'": "",
    "/": "",
  };
  const limePattern = {
    " ": "-",
    "'": "%20",
    "/": "-",
  };
  const torrentGalaxyPattern = {
    " ": "+",
    "'": "%27",
    "/": "%2F",
  };

  let keys;
  let values;
  if (provider === "sevenPattern" || provider === "torrentCsvPattern") {
    keys = Object.keys(sevenPattern);
    values = Object.values(sevenPattern);
  } else if (provider === "limePattern") {
    keys = Object.keys(limePattern);
    values = Object.values(limePattern);
  } else if (provider === "torrentGalaxyPattern") {
    keys = Object.keys(torrentGalaxyPattern);
    values = Object.values(torrentGalaxyPattern);
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
