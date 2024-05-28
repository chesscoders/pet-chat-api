const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const { slugify } = require("../functions");

async function getPageHTML(url) {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  const html = await page.content();

  await browser.close();

  return html;
}

async function scrapeProductDetails(url, category) {
  const html = await getPageHTML(url);
  const $ = cheerio.load(html);

  const subCategory = $(".breadcrumbs li").first().find("a span").text();
  const name = $(".product-name h1").text();
  const shortDescription = $(".short-description-wrapper")
    .text()
    .replace(/\s+/g, " ")
    .trim();
  const image = $(".main-image").attr("src");
  const description = $("#product_tabs_description_contents")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const slugifiedName = slugify(name);

  fs.writeFileSync(
    `data/${category}/${slugifiedName}.json`,
    JSON.stringify(
      { name, subCategory, shortDescription, image, description, url },
      null,
      2
    ),
    "utf-8"
  );
  return { name, subCategory, shortDescription, image, description, url };
}

async function getCategoryURLs(categoryURL) {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  await page.goto(categoryURL, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector(".item-inner");
  const html = await page.content();

  await browser.close();
  const $ = cheerio.load(html);

  const hrefs = [];

  const data = $(".item-inner a").each((index, element) => {
    hrefs.push($(element).attr("href"));
  });

  return hrefs;
}

function removeDuplicatesAndHashes(arr) {
  // Step 1: Filter out strings containing '#'
  const filteredArr = arr.filter((str) => !str.includes("#"));

  // Step 2: Remove duplicates
  const uniqueArr = [...new Set(filteredArr)];

  return uniqueArr;
}

async function getCategoryProducts() {
  const category = {
    name: "Produse igiena ochi si urechi pisici",
    url: "https://www.petmart.ro/pisici/igiena-pisici/pisici-igiena-igiena-ochi-urechi-pisica.html",
  };
  category.name = slugify(category.name);

  fs.mkdir(`data/${category.name}`, { recursive: true }, (err) => {
    if (err) {
      return console.error(`Failed to create directory: ${err.message}`);
    }
    console.log("Directory created successfully!");
  });
  const productsURL = removeDuplicatesAndHashes(
    await getCategoryURLs(category.url)
  );

  for (let url of productsURL) {
    if (url) {
      console.log(url);
      await scrapeProductDetails(url, category.name);
    }
  }
}

(async () => {
  await getCategoryProducts();
})();
