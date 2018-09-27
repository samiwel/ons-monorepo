/* eslint-disable camelcase */
const { isNil } = require("lodash/fp");
const { get, has, merge } = require("lodash");

class Answer {
  constructor(answer) {
    this.id = `answer${answer.id}`;
    this.mandatory = answer.properties.required;
    this.type = answer.type;
    this.label = answer.label;
    this.description = answer.description;

    if (!isNil(answer.validation)) {
      if (["Number", "Currency"].includes(answer.type)) {
        const { minValue, maxValue } = answer.validation;
        this.buildNumberValidation(minValue, "min_value");
        this.buildNumberValidation(maxValue, "max_value");
      } else if (answer.type === "Date") {
        const { earliestDate, latestDate } = answer.validation;
        this.buildDateValidation(earliestDate, "minimum");
        this.buildDateValidation(latestDate, "maximum");
      }
    }

    if (has(answer, "properties.decimals")) {
      this.decimal_places = answer.properties.decimals;
    }

    if (!isNil(answer.parentAnswerId)) {
      this.parent_answer_id = `answer${answer.parentAnswerId}`;
    }

    if (answer.type === "Currency") {
      this.currency = "GBP";
    }

    if (answer.type === "Date") {
      const format = get(answer, "properties.format");

      if (format === "yyyy") {
        this.type = "YearDate";
      }

      if (format === "mm/yyyy") {
        this.type = "MonthYearDate";
      }
    }

    if (!isNil(answer.options)) {
      this.options = answer.options.map(this.buildOption);
    }

    if (!isNil(answer.other)) {
      this.options = this.options.concat(this.buildOtherOption(answer.other));
    }

    if (!isNil(answer.mutuallyExclusiveOption)) {
      this.type = "MutuallyExclusiveCheckbox";
      this.options = this.options.concat(
        this.buildOption(answer.mutuallyExclusiveOption)
      );
    }
  }

  static buildChildAnswer(
    { id, properties, type, label, description },
    parentAnswerId
  ) {
    return {
      id,
      properties,
      type,
      label,
      description,
      parentAnswerId
    };
  }

  buildNumberValidation(validationRule, validationType) {
    const { enabled, custom } = validationRule;
    if (!enabled || isNil(custom)) {
      return;
    }

    Object.assign(this, {
      [validationType]: {
        value: custom,
        exclusive: !validationRule.inclusive
      }
    });
  }

  buildDateValidation(validationRule, validationType) {
    const { enabled, custom } = validationRule;
    if (!enabled || isNil(custom)) {
      return;
    }

    const { offset, relativePosition } = validationRule;
    const multiplier = relativePosition === "Before" ? -1 : 1;
    const offsetValue = offset.value * multiplier;
    const offsetUnit = offset.unit.toLowerCase();

    Object.assign(this, {
      [validationType]: {
        value: custom,
        offset_by: {
          [offsetUnit]: offsetValue
        }
      }
    });
  }

  buildOption({ label, description }) {
    const option = {
      label,
      value: label
    };

    if (description) {
      option.description = description;
    }
    return option;
  }

  buildOtherOption(other) {
    return merge({}, this.buildOption(other.option), {
      child_answer_id: `answer${other.answer.id}`
    });
  }
}

module.exports = Answer;
