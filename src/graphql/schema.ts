import { gql } from "apollo-server-lambda";

const typeDefs = gql`
  schema {
    query: Query
    mutation: Mutation
  }
  type Query {
    v: String!
  }
  type Mutation {
    createBatchToken(
      batchCertificate: String!
      phone: String
    ): BatchTokenReturn!
    activatePassport(token: ID!, passportId: ID!): ActivatePassportReturn!
    completeActivation(activationId: ID): ActivationCompletionReturn!
  }

  type ActivationCompletionReturn {
    result: String!
  }

  type BatchTokenReturn {
    result: String!
    token: ID
    batchInfo: BatchInfo
  }
  type ActivatePassportReturn {
    result: String!
    batchInfo: BatchInfo
    headshotURL: String
    infoURL: String
    activationId: ID
    version: String
  }
  type BatchInfo {
    uid: ID!
    vaccine: String!
    batchId: String!
    dosesRemaining: Int!
  }
  type BatchInfoIn {
    vaccine: String!
    batchId: String!
    doses: Int!
  }
`;

export default typeDefs;
