import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["vehicle", "property"],
    },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    attributes: {
      make: { type: String },
      model: { type: String },
      year: { type: Number },
      propertyType: { type: String },
      bedrooms: { type: Number },
      landSize: { type: String },
    },
    imageKey: { type: String, default: null },
  },
  { _id: false }
);

listingSchema.index({ category: 1 });
listingSchema.index({ location: 1 });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
