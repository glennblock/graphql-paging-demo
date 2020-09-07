const { ApolloServer, gql } = require('apollo-server');
const { readFileSync } = require('fs');
const { getPageResult } = require('./paging');

const schema = readFileSync('schema.graphql');
const typeDefs = gql `${schema}`;

// From https://gist.githubusercontent.com/nanotaboada/6396437/raw/82dca67cc3b6a5ccfcf8af012664cdaa0025d999/books.json
const books = JSON.parse(readFileSync('books.json')).books;

const booksByTitle = [...books.sort((a,b)=> {
  return a.title.localeCompare(b.title);
})];

const booksByAuthor = [...books.sort((a,b)=> {
  return a.author.localeCompare(b.author);
})];

var util = require('util');

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: (parent, args, context, info) => {
      const first = args.first;
      const last = args.last;
      var after = null;
      var before = null;
      var list = null;
      const orderBy = args.orderBy;      
      const sort = args.sort;

      if ((args.last == undefined || args.last < 1) && (args.first == undefined || args.first < 1)) {
        throw new Error("last or first must be set");
      }

      after = args.after != undefined ? JSON.parse(args.after).value : undefined;
      before = args.before != undefined ? JSON.parse(args.before).value : undefined;

      if (orderBy === "AUTHOR") {
        list = booksByAuthor
        if (sort === "DESCENDING") {
          list = [...list].reverse();
        }
        orderByField = "author";
      }
      else {
        list = booksByTitle;
        if (sort === "DESCENDING") {
          list = [...list].reverse();
        }
        orderByField = "title";      
      }

      return getPageResult(list, before, after, first, last, orderByField, sort);
    }
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

