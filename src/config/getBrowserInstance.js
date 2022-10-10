let puppeteer;
let chrome;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

async function getBrowserInstance() {
  const browser = await puppeteer.launch(
    process.env.AWS_LAMBDA_FUNCTION_VERSION
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {}
  );
  return browser;
}

module.exports = { getBrowserInstance };
