const { Schema, model } = require("mongoose");

const Tour = new Schema(
  {
    name: { type: String, require: true },
    decs: { type: String, require: true },
    image: { type: String, require: true },
    quantity: { type: Number, default: 0 },
  },
  {
    collection: "tours",
    timestamps: true,
  }
);

module.exports = Tour;
