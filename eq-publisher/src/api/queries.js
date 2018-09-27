exports.getQuestionnaire = `
  fragment answerFragment on Answer {
    id
    type
    label
    description
    guidance
    properties
    qCode
    ...on BasicAnswer{
      validation{
        ...on NumberValidation{
          minValue{
            id
            inclusive
            enabled
            custom
          }
          maxValue{
            id
            inclusive
            enabled
            custom
          }
        }
        ...on DateValidation{
          earliestDate{
            id
            enabled
            custom
            offset {
              value
              unit
            }
            relativePosition
          }
          latestDate{
            id
            enabled
            custom
            offset {
              value
              unit
            }
            relativePosition
          }
        }
      }
    }
    ...on CompositeAnswer{
      childAnswers{
        id
        label
      }
    }
  }

  fragment optionFragment on Option {
    id
    label
    description
    value
    qCode
  }

  fragment destinationFragment on RoutingDestination {
    ... on LogicalDestination {
      __typename
      logicalDestination
    }
    ... on AbsoluteDestination {
      __typename
      absoluteDestination {
        ... on QuestionPage {
          id
          __typename
        }
        ... on Section {
          id
          __typename
        }
      }
    }
  }

  fragment metadataFragment on Metadata {
    id
    key
    type
  }

  query GetQuestionnaire($questionnaireId: ID!) {
    questionnaire(id: $questionnaireId) {
      id
      title
      description
      theme
      legalBasis
      navigation
      surveyId
      summary
      metadata {
        ...metadataFragment
      }
      sections {
        id
        title
        description
        pages {
          ... on QuestionPage {
            id
            title
            description
            guidance
            pageType
            routingRuleSet {
              id
              else {
                ...destinationFragment
              }
              routingRules {
                id
                operation
                goto {
                  ...destinationFragment
                }
                conditions {
                  id
                  comparator
                  answer {
                    id
                    type
                    ... on MultipleChoiceAnswer {
                      options {
                        id
                        label
                      }
                      other {
                        option {
                          id
                          label
                        }
                      }
                    }
                  }
                  routingValue {
                    ... on IDArrayValue {
                      value
                    }
                  }
                }
              }
            }
            answers {
              ...answerFragment
              ... on MultipleChoiceAnswer {
                options {
                  ...optionFragment
                }
                mutuallyExclusiveOption {
                  ...optionFragment
                }
                other {
                  option {
                    ...optionFragment
                  }
                  answer {
                    ...answerFragment
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
