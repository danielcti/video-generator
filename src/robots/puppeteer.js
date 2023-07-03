const puppeteer = require("puppeteer");

// TODO: Make puppeteer scrap content from different news sources
const getNewsContent = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url);
  const paragraphs = await page.$$eval(".article-content > p", (anchors) => {
    return anchors.map((anchor) => anchor.textContent);
  });
  await page.close();
  await browser.close();

  return paragraphs;
};

module.exports = { getNewsContent };
