/* eslint-disable camelcase */
const Block = require("./Block");
const { getInnerHTML } = require("../utils/HTMLUtils");
const { isEmpty, reject } = require("lodash");

class Group {
  constructor(id, title, pages, ctx) {
    this.id = `group${id}`;
    this.title = getInnerHTML(title);
    this.blocks = this.buildBlocks(pages, id, ctx);

    if (!isEmpty(ctx.routingGotos)) {
      this.filterContext(this.id, ctx);
      const skipConditions = this.buildSkipConditions(this.id, ctx);

      if (!isEmpty(skipConditions)) {
        this.skip_conditions = skipConditions;
      }
    }
  }

  filterContext(currentId, ctx) {
    ctx.routingGotos = reject(
      ctx.routingGotos,
      rule => rule.group === currentId
    );
  }

  buildSkipConditions(currentId, ctx) {
    return reject(ctx.routingGotos, goto => goto.groupId === currentId).map(
      ({ when }) => ({
        when
      })
    );
  }

  buildBlocks(pages, groupId, ctx) {
    return pages.map(page => new Block(page, groupId, ctx));
  }
}

module.exports = Group;
