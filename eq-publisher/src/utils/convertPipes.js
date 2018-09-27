const cheerio = require("cheerio");

const getMetadata = (ctx, metadataId) =>
  ctx.questionnaireJson.metadata.find(({ id }) => id === metadataId);

const FILTER_MAP = {
  Number: "|format_number",
  Currency: "|format_currency",
  Date: "|format_date",
  DateRange: "|format_date"
};

const PIPE_TYPES = {
  answers: {
    retrieve: element => element,
    render: ({ id }) => `answers.answer${id}`,
    getType: ({ type }) => type
  },
  metadata: {
    retrieve: ({ id }, ctx) => getMetadata(ctx, id.toString()),
    render: ({ key }) => `metadata.${key}`,
    getType: ({ type }) => type
  }
};

const convertElementToPipe = ($elem, ctx) => {
  const { piped, ...elementData } = $elem.data();
  const pipeConfig = PIPE_TYPES[piped];
  if (!pipeConfig) {
    return "";
  }

  const entity = pipeConfig.retrieve(elementData, ctx);
  if (!entity) {
    return "";
  }
  const output = pipeConfig.render(entity);
  const dataType = pipeConfig.getType(entity);

  const filter = FILTER_MAP[dataType] || "";
  return `{{${output}${filter}}}`;
};

const parseHTML = html => {
  return cheerio.load(html)("body");
};

const convertPipes = ctx => html => {
  if (!html) {
    return html;
  }

  const $ = parseHTML(html);

  $.find("[data-piped]").each((i, elem) => {
    const $elem = cheerio(elem);
    $elem.replaceWith(convertElementToPipe($elem, ctx));
  });

  return $.html();
};

module.exports = convertPipes;
