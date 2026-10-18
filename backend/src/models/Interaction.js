import mongoose from "mongoose";

const INTERACTION_TYPES = ["VIEW", "SAVE", "CONTACT"];

const interactionSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, ref: "User" },
    listingId: { type: String, required: true, ref: "Listing" },
    type: { type: String, required: true, enum: INTERACTION_TYPES },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

interactionSchema.index({ userId: 1, listingId: 1, type: 1 }, { unique: true });
interactionSchema.index({ userId: 1 });

const Interaction = mongoose.model("Interaction", interactionSchema);

export { INTERACTION_TYPES };
export default Interaction;
