const Group = require("./Group");
const { getText } = require("../utils/HTMLUtils");

class Section {
  constructor(section, ctx) {
    this.id = `section${section.id}`;
    this.title = getText(section.title);
    this.groups = this.buildGroups(section.id, this.title, section, ctx);
  }

  buildGroups(id, title, { pages }, ctx) {
    // Sections always contain a single group currently
    return [new Group(id, title, pages, ctx)];
  }
}

module.exports = Section;
