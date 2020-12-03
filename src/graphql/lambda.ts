import { Context as LambdaContext } from "aws-lambda";
import { ApolloServer, GraphQLOptions } from "apollo-server-lambda";
import { APIGatewayProxyEvent } from "aws-lambda";
import resolvers, { Context } from "./resolvers";
import typeDefs from "./schema";
// export const context = ({ req }: { req: express.Request }): Context => ({
//   headers: req.headers,
// });

class ApolloServerH extends ApolloServer {
  async createGraphQLServerOptions(
    event: APIGatewayProxyEvent,
    context: LambdaContext
  ): Promise<GraphQLOptions> {
    const opts = await super.graphQLServerOptions({ event, context });
    return {
      ...opts,
      context: {
        ...opts.context,
        ip: event.requestContext.identity.sourceIp,
      },
    };
  }
}

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();

/*
var server = require('apollo-server-lambda'),
  myGraphQLSchema = require('./schema');

exports.graphqlHandler = server.graphqlLambda({ schema: myGraphQLSchema });


exports.graphqlHandler = server.graphqlLambda((event, context) => {
  const headers = event.headers,
    functionName = context.functionName;

  return {
    schema: myGraphQLSchema,
    context: {
      headers,
      functionName,
      event,
      context,
    },
  };
});
*/
