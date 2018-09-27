/* eslint-disable camelcase */
const Group = require("./Group");
const Block = require("./Block");
const ctx = {};

describe("Group", () => {
  const createGroupJSON = options =>
    Object.assign(
      {
        id: "1",
        title: "Section 1",
        pages: [
          {
            id: "2",
            answers: []
          }
        ]
      },
      options
    );

  it("should build valid runner Group from Author section", () => {
    let groupJSON = createGroupJSON();
    const group = new Group(
      groupJSON.id,
      groupJSON.title,
      groupJSON.pages,
      ctx
    );

    expect(group).toMatchObject({
      id: "group1",
      title: "Section 1",
      blocks: [expect.any(Block)]
    });
  });

  it("should handle HTML values", () => {
    let groupJSON = createGroupJSON({ title: "<p>Section <em>1</em></p>" });
    const group = new Group(
      groupJSON.id,
      groupJSON.title,
      groupJSON.pages,
      ctx
    );

    expect(group).toMatchObject({
      title: "Section <em>1</em>"
    });
  });

  describe("skip conditions", () => {
    const createGroupsJSON = () => [
      {
        id: 1,
        title: "Group 1",
        pages: []
      },
      {
        id: 2,
        title: "Group 2",
        pages: []
      },
      {
        id: 3,
        title: "Group 3",
        pages: []
      }
    ];

    it("should add skip conditions to the required groups", () => {
      const groupsJson = createGroupsJSON();

      const ctx = {
        routingGotos: [
          {
            group: "confirmation-group",
            when: {
              id: "answer1",
              condition: "equals",
              value: "Goto End"
            },
            groupId: "group1"
          }
        ]
      };

      const runnerJson = groupsJson.map(
        group => new Group(group.id, group.title, group.pages, ctx)
      );

      const expectedrunnerJson = [
        { id: "group1", title: "Group 1", blocks: [] },
        {
          id: "group2",
          title: "Group 2",
          blocks: [],
          skip_conditions: [
            { when: { id: "answer1", condition: "equals", value: "Goto End" } }
          ]
        },
        {
          id: "group3",
          title: "Group 3",
          blocks: [],
          skip_conditions: [
            { when: { id: "answer1", condition: "equals", value: "Goto End" } }
          ]
        }
      ];

      expect(runnerJson[0]).not.toHaveProperty("skip_conditions");

      expect(runnerJson).toMatchObject(expectedrunnerJson);
    });

    it("can handle multiple skip conditions for each group", () => {
      const groupsJson = createGroupsJSON();

      const ctx = {
        routingGotos: [
          {
            group: "confirmation-group",
            when: {
              id: "answer1",
              condition: "equals",
              value: "Goto End"
            },
            groupId: "group1"
          },
          {
            group: "group3",
            when: {
              id: "answer1",
              condition: "equals",
              value: "Goto group3"
            },
            groupId: "group1"
          }
        ]
      };

      const runnerJson = groupsJson.map(
        group => new Group(group.id, group.title, group.pages, ctx)
      );

      const expectedrunnerJson = [
        { id: "group1", title: "Group 1", blocks: [] },
        {
          id: "group2",
          title: "Group 2",
          blocks: [],
          skip_conditions: [
            { when: { id: "answer1", condition: "equals", value: "Goto End" } },
            {
              when: { id: "answer1", condition: "equals", value: "Goto group3" }
            }
          ]
        },
        {
          id: "group3",
          title: "Group 3",
          blocks: [],
          skip_conditions: [
            { when: { id: "answer1", condition: "equals", value: "Goto End" } }
          ]
        }
      ];

      expect(runnerJson).toMatchObject(expectedrunnerJson);
    });
  });
});
