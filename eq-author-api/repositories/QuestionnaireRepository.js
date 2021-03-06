const { head } = require("lodash/fp");
const Questionnaire = require("../db/Questionnaire");

module.exports.getById = function(id) {
  return Questionnaire.findById(id).where({ isDeleted: false });
};

module.exports.findAll = function findAll(
  where = {},
  orderBy = "createdAt",
  direction = "desc"
) {
  return Questionnaire.findAll()
    .where({ isDeleted: false })
    .where(where)
    .orderBy(orderBy, direction);
};

module.exports.insert = function({
  title,
  description,
  theme,
  legalBasis,
  navigation,
  surveyId,
  summary,
  createdBy
}) {
  return Questionnaire.create({
    title,
    description,
    theme,
    legalBasis,
    navigation,
    surveyId,
    summary,
    createdBy
  }).then(head);
};

module.exports.update = function({
  id,
  title,
  description,
  theme,
  legalBasis,
  navigation,
  surveyId,
  isDeleted,
  summary
}) {
  return Questionnaire.update(id, {
    title,
    surveyId,
    description,
    theme,
    legalBasis,
    navigation,
    isDeleted,
    summary
  }).then(head);
};

module.exports.remove = function(id) {
  return Questionnaire.update(id, { isDeleted: true }).then(head);
};

module.exports.undelete = function(id) {
  return Questionnaire.update(id, { isDeleted: false }).then(head);
};
