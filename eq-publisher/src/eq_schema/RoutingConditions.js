const { flow, keyBy, map, flatMap, xor, concat } = require("lodash/fp");

const getAllOptions = condition => {
  if (condition.answer.other) {
    return concat(condition.answer.options, condition.answer.other.option);
  } else {
    return condition.answer.options;
  }
};

const createOptionByIdLookup = flow(
  flatMap(getAllOptions),
  keyBy("id")
);

class RoutingConditions {
  constructor(conditions) {
    this.when = this.buildRoutingConditions(conditions);
  }

  buildRoutingConditions(conditions) {
    const optionById = createOptionByIdLookup(conditions);

    return flatMap(condition => {
      const optionIds = map("id", getAllOptions(condition));
      const unselectedIds = xor(condition.routingValue.value, optionIds);

      return unselectedIds
        .map(id => ({
          id: `answer${condition.answer.id}`,
          condition: "not equals",
          value: optionById[id].label
        }))
        .concat({
          id: `answer${condition.answer.id}`,
          condition: "set"
        });
    }, conditions);
  }
}

module.exports = RoutingConditions;
