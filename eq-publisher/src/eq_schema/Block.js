const Question = require("./Question");
const RoutingRule = require("./RoutingRule");
const RoutingDestination = require("./RoutingDestination");
const { get, isNil, remove, isEmpty } = require("lodash");
const { flow, getOr, last, map, some } = require("lodash/fp");

const pageTypeMappings = {
  QuestionPage: "Question",
  InterstitialPage: "Interstitial"
};

const getLastPage = flow(
  getOr([], "pages"),
  last
);

const isLastPageInSection = (page, ctx) =>
  flow(
    getOr([], "sections"),
    map(getLastPage),
    some({ id: page.id })
  )(ctx);

class Block {
  constructor(page, groupId, ctx) {
    this.id = `block${page.id}`;
    this.type = this.convertPageType(page.pageType);
    this.questions = this.buildQuestions(page, ctx);

    if (!isLastPageInSection(page, ctx) && !isNil(page.routingRuleSet)) {
      // eslint-disable-next-line camelcase
      this.routing_rules = this.buildRoutingRules(
        page.routingRuleSet,
        page.id,
        groupId,
        ctx
      );
    }
  }

  buildQuestions(page, ctx) {
    return [new Question(page, ctx)];
  }

  buildRoutingRules({ routingRules, else: elseDest }, pageId, groupId, ctx) {
    routingRules.forEach(rule => {
      remove(rule.conditions, condition => isNil(condition.answer));
    });

    const rules = routingRules
      .filter(rule => !isEmpty(rule.conditions))
      .map(rule => new RoutingRule(rule, pageId, groupId, ctx));

    const elseRule = {
      goto: new RoutingDestination(elseDest, pageId, ctx)
    };

    return rules.concat(elseRule);
  }

  convertPageType(type) {
    return get(pageTypeMappings, type, type);
  }
}

module.exports = Block;
module.exports.isLastPageInSection = isLastPageInSection;
