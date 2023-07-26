import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fetch from 'node-fetch';

const typeDefs = `
  type Query {
    hello(name: String): String!
    getPerson(id: Int!): Ticket
  }


  type Ticket {
    section: String
    row: Int
    seatNumber: Int
    price: Int
  }
`;

const resolveFilms = (parent: any) => {
  const promises = parent.films.map(async (url: string) => {
    const response = await fetch(url);
    return response.json();
  });

  return Promise.all(promises);
};

const resolvers = {

  Query: {
    getPerson: async (parent: any, args: any) => {
      try {
        console.log(args)
        const response = await fetch(`https://my.laphil.com/en/rest-proxy/TXN/Packages/${args.id}`);
        console.log(response.toString());
        return response.toString();
      } catch (error) {
        console.log(error)
      }

    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server,
  { listen: { port: 4000 } })

console.log(`🚀 Server ready at ${url}`)