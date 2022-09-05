const { GraphQLScalarType, Kind } = require("graphql");
const mongoose = require("mongoose");
const resolvers = {
  Query: {
    order: async (_, { id }, { dataSources }) => {
      return await dataSources.orderAPI.getOrderById({ id });
    },
    orders: async (_, __, { dataSources, user }) => {
      if (user.data.roles.includes("admin")) {
        return await dataSources.orderAPI.getOrders();
      }
      return await dataSources.ordersAPI.getOrdersByAccountId({ accountId: user.sub });
    },
  },
  Order: {
    __resolveReference: ({ id }, { dataSources }) => {
      return dataSources.orderAPI.getOrderById(id);
    },
    account: ({ accountId }) => {
      return { id: accountId };
    },
    tour: ({ tourId }) => {
      return { id: tourId };
    },
  },
  Account: {
    __resolveReference: (account) => {
      return account;
    },
  },
  Tour: {
    __resolveReference: (tour) => {
      return tour;
    },
  },
  Mutation: {
    createOrder: async (_, { order }, { dataSources, user }) => {
      const newOrder = await dataSources.orderAPI.createOrder({ tourId: order.tourId, accountId: user.sub });
      if (newOrder) {
        await dataSources.tourAPI.increaseOrdersOfTour({ id: order.tourId });
        return {
          code: 201,
          success: true,
          message: "Create order successfully",
          order: newOrder,
        };
      }
      return { code: 400, success: false, message: "Create order failed", order: null };
    },
    updateOrder: async (_, { id, order }, { dataSources }) => {
      const updatedOrder = await dataSources.orderAPI.updateOrder({ id, order });
      if (updatedOrder) {
        return {
          code: 200,
          success: true,
          message: "Order updated successfully",
          order: updatedOrder,
        };
      }

      return { code: 400, success: false, message: "Order updated failed", order: null };
    },
    deleteOrder: async (_, { id }, { dataSources }) => {
      const deleteOrder = await dataSources.orderAPI.deleteOrder({ id });
      if (deleteOrder) {
        await dataSources.tourAPI.decreaseOrdersOfTour({ id: deleteOrder.tourId });
        return { code: 200, success: true, message: "Delete order successfully", order: deleteOrder };
      }
      return { code: 400, success: false, message: "Delete order failed", order: null };
    },
  },
};

module.exports = resolvers;
