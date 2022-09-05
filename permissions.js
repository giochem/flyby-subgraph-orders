const { and, or, allow, rule, shield } = require("graphql-shield");

function getPermissions(user) {
  if (user && user.data) {
    return user.data.permissions;
  }
  return [];
}
function getRoles(user) {
  if (user && user.data) {
    return user.data.roles;
  }
  return [];
}

// Admin
const canReadAny = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("read:any");
});

const canCreateAny = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("create:any");
});
const canUpdateAny = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("update:any");
});
const canDeleteAny = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("delete:any");
});

// tourist
const canReadOwnOrder = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("read:own_order");
});

const canCreateOwnOrder = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("create:own_order");
});
const canUpdateOwnOrder = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("update:own_order");
});
const canDeleteOwnOrder = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("delete:own_order");
});
// Authentication and authorization
const isOwnOrder = rule()(async (_, { id }, { user, dataSources }) => {
  return (await dataSources.orderAPI.getOrderByIdAndAccountId({ id, accountId: user.sub })) && true;
});

const existTour = rule()(async (_, { order }, { user, dataSources }) => {
  const tour = await dataSources.tourAPI.getTourById({ id: order.tourId });
  return tour ? true : false;
});
const notExistOrder = rule()(async (_, { order }, { user, dataSources }) => {
  const existOrder = await dataSources.orderAPI.getOrderByAccountIdAndTourId({
    tourId: order.tourId,
    accountId: user.sub,
  });
  return existOrder?.length > 0 ? false : true;
});
const permissions = shield(
  {
    Query: {
      order: or(and(canReadOwnOrder, isOwnOrder), canReadAny),
      orders: or(canReadOwnOrder, canReadAny),
    },
    Mutation: {
      createOrder: and(existTour, notExistOrder, or(canCreateOwnOrder, canCreateAny)),
      updateOrder: canUpdateAny,
      deleteOrder: or(and(canDeleteOwnOrder, isOwnOrder), canDeleteAny),
    },
  },
  {
    debug: process.env.NODE_ENV === "developer" ? true : false,
    allowExternalErrors: process.env.NODE_ENV === "developer" ? true : false,
  }
);
module.exports = { permissions };
