const cheerio = require("cheerio");

const isPlainText = elem => typeof elem === "string" && !elem.startsWith("<");

const getInnerHTML = elem => (isPlainText(elem) ? elem : cheerio(elem).html());

const getText = elem => (isPlainText(elem) ? elem : cheerio(elem).text());

const description = elem => ({ description: getInnerHTML(elem) });

const title = elem => ({ title: getInnerHTML(elem) });

const list = elem => ({
  list: cheerio(elem).find("li").map((i, li) => getInnerHTML(li)).toArray()
});

const mapElementToObject = elem => {
  switch (elem.name) {
    case "p":
      return description(elem);
    case "h2":
      return title(elem);
    case "ul":
      return list(elem);
  }
};

const parseGuidance = html => {
  const content = cheerio(html)
    .filter((i, elem) => getInnerHTML(elem) !== "")
    .map((i, elem) => mapElementToObject(elem))
    .toArray();

  if (content.length === 0) {
    return;
  }

  return { content };
};

module.exports = {
  getInnerHTML,
  getText,
  parseGuidance
};
