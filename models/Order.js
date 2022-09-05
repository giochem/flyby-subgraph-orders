const { Schema, model } = require("mongoose");

const Order = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, required: true },
    tourId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);
module.exports = Order;
