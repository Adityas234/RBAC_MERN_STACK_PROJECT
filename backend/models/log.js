import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    action: {
      type: String,
      required: true
    },
    target: {
      type: String
    },
    metadata: {
      type: Object
    }
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);