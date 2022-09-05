const mongoose = require("mongoose");
const conn = mongoose.createConnection(process.env.ORDERS_MONGO_URL);
const Order = conn.model("Order", require("../models/Order"));

class OrderApi {
  async getOrderById({ id }) {
    try {
      return await Order.findById(id);
    } catch (error) {
      console.log(error);
    }
  }
  async getOrdersByAccountId({ accountId }) {
    try {
      return await Order.find({ accountId });
    } catch (error) {
      console.log(error);
    }
  }
  async getOrderByIdAndAccountId({ id, accountId }) {
    try {
      return await Order.find({ id, accountId });
    } catch (error) {
      console.log(error);
    }
  }
  async getOrderByAccountIdAndTourId({ tourId, accountId }) {
    try {
      return await Order.find({ tourId, accountId });
    } catch (error) {
      console.log(error);
    }
  }
  async getOrders() {
    try {
      return await Order.find();
    } catch (error) {
      console.log(error);
    }
  }
  async createOrder({ tourId, accountId }) {
    try {
      return await Order.create({ tourId, accountId });
    } catch (error) {
      console.log(error);
    }
  }
  async updateOrder({ id, order }) {
    try {
      return await Order.findByIdAndUpdate(id, order, { new: true });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteOrder({ id }) {
    try {
      return await Order.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = OrderApi;
