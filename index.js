const { readFileSync } = require("fs");
const express = require("express");
const { ApolloServer, gql } = require("apollo-server");
const { applyMiddleware } = require("graphql-middleware");
const { buildSubgraphSchema } = require("@apollo/subgraph");
require("dotenv").config();
// Connection mongoose
const { permissions } = require("./permissions");
const typeDefs = gql(readFileSync("./orders.graphql", { encoding: "utf-8" }));
const resolvers = require("./resolvers");
// Api
const OrderAPI = require("./datasources/OrderApi");
const TourAPI = require("./datasources/TourApi");

const server = new ApolloServer({
  schema: applyMiddleware(buildSubgraphSchema({ typeDefs, resolvers }), permissions),
  context: ({ req }) => {
    const user = req.headers.auth ? JSON.parse(req.headers.auth) : null;
    const dataSources = {
      orderAPI: new OrderAPI(),
      tourAPI: new TourAPI(),
    };
    return { user, dataSources };
  },
});

const subgraphName = "orders";

server
  .listen({ port: process.env.PORT || 4003 })
  .then(({ url }) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });
