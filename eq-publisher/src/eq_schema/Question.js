const Answer = require("./Answer");
const { getInnerHTML, parseGuidance } = require("../utils/HTMLUtils");
const { find, get, flow, flatten, isNil, assign } = require("lodash/fp");
const convertPipes = require("../utils/convertPipes");

const findDateRange = flow(
  get("answers"),
  find({ type: "DateRange" })
);

const processPipedText = ctx =>
  flow(
    convertPipes(ctx),
    getInnerHTML
  );
const processGuidance = ctx =>
  flow(
    convertPipes(ctx),
    parseGuidance
  );

class Question {
  constructor(question, ctx) {
    this.id = `question${question.id}`;
    this.title = processPipedText(ctx)(question.title);
    this.guidance = processGuidance(ctx)(question.guidance);
    this.description = processPipedText(ctx)(question.description);

    const dateRange = findDateRange(question);

    if (dateRange) {
      this.type = "DateRange";
      this.answers = this.buildDateRangeAnswers(dateRange);
    } else {
      this.type = "General";
      this.answers = this.buildAnswers(question.answers);
    }
  }

  buildAnswers(answers) {
    const answerArray = flatten(
      answers.map(answer => {
        if (!isNil(answer.other)) {
          return [
            answer,
            Answer.buildChildAnswer(answer.other.answer, answer.id)
          ];
        }
        return answer;
      })
    );
    return answerArray.map(answer => new Answer(answer));
  }

  buildDateRangeAnswers(answer) {
    return answer.childAnswers.map(
      childAnswer =>
        new Answer(
          assign(childAnswer, { type: "Date", properties: answer.properties })
        )
    );
  }
}

module.exports = Question;
