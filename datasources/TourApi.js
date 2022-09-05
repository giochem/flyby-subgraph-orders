const mongoose = require("mongoose");
const conn = mongoose.createConnection(process.env.TOURS_MONGO_URL);
const Tour = conn.model("Tour", require("../models/Tour"));

class TourApi {
  async getTourById({ id }) {
    try {
      return await Tour.findById(id);
    } catch (error) {
      console.log(error);
    }
  }
  async increaseOrdersOfTour({ id }) {
    try {
      return await Tour.findByIdAndUpdate(id, { $inc: { quantity: 1 } }, { new: true });
    } catch (error) {
      console.log(error);
    }
  }
  async decreaseOrdersOfTour({ id }) {
    try {
      return await Tour.findByIdAndUpdate(id, { $inc: { quantity: -1 } }, { new: true });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = TourApi;
