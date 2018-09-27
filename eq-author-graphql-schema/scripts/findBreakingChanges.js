const {
  buildSchema,
  findBreakingChanges,
  isObjectType,
  isInterfaceType,
  BreakingChangeType
} = require("graphql");

const tail = ([, ...rest]) => rest;
const re = re => data => re.exec(data);
const flow = (...fns) => arg => fns.reduce((acc, fn) => fn(acc), arg);
const get = prop => obj => obj[prop];
const startsWith = needle => haystack => haystack.indexOf(needle) === 0;

const isIntrospectionType = flow(
  get("name"),
  startsWith("__")
);
const parseBreakage = flow(
  get("description"),
  re(/^(.*?)\.(.*?) /),
  tail
);

const findDeprecatedFields = schema => {
  const deprecatedFields = [];
  const typeMap = schema.getTypeMap();

  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];

    if (
      !(isObjectType(type) || isInterfaceType(type)) ||
      isIntrospectionType(type)
    ) {
      return;
    }

    const fields = type.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];

      if (field.isDeprecated) {
        deprecatedFields.push({
          field: fieldName,
          type: typeName
        });
      }
    });
  });

  return deprecatedFields;
};

const filterOutDeprecatedFields = (breakages, deprecated) => {
  return breakages.filter(breakage => {
    if (breakage.type !== BreakingChangeType.FIELD_REMOVED) {
      return true;
    }

    const [type, field] = parseBreakage(breakage);
    const isDeprecatedField = deprecated.some(
      x => x.type === type && x.field === field
    );

    return !isDeprecatedField;
  });
};

module.exports = (oldSchema, newSchema) =>
  filterOutDeprecatedFields(
    findBreakingChanges(oldSchema, newSchema),
    findDeprecatedFields(oldSchema)
  );
