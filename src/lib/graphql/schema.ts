export const typeDefs = `#graphql
  type Recognition {
    id: ID!
    sender: Employee
    recipient: Employee!
    message: String!
    emojis: [String]
    privacy: Visibility!
    timestamp: String!
    likes: Int!
    comments: [Comment!]!
  }

  type Employee {
    id: ID!
    name: String!
    team: String!
    role: Role!
    avatarUrl: String
  }

  type Comment {
    id: ID!
    author: Employee
    message: String!
    timestamp: String!
  }

  enum Visibility {
    PUBLIC
    PRIVATE
    ANONYMOUS
  }

  enum Role {
    EMPLOYEE
    MANAGER
    HR
    ADMIN
  }

  type Query {
    recognitions(filter: RecognitionFilter): [Recognition!]!
    analytics(filter: AnalyticsFilter!): AnalyticsResult!
  }

  type Mutation {
    sendRecognition(input: RecognitionInput!): Recognition!
    likeRecognition(id: ID!): Recognition!
    addComment(recognitionId: ID!, message: String!): Comment!
  }

  input RecognitionInput {
    recipientId: ID!
    message: String!
    privacy: Visibility!
  }

  input RecognitionFilter {
    team: String
    keyword: String
    visibility: Visibility
  }

  input AnalyticsFilter {
    team: String
    keyword: String
    startDate: String
    endDate: String
  }

  type AnalyticsResult {
    totalRecognitions: Int!
    topKeywords: [String!]!
    recognitionsByTeam: [TeamAnalytics!]!
    engagementOverTime: [MonthlyEngagement!]!
  }

  type TeamAnalytics {
    team: String!
    count: Int!
  }

  type MonthlyEngagement {
    month: String!
    count: Int!
  }
`;
