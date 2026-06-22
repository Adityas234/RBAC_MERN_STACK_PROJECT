import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  },

  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
}, { timestamps: true });

export default mongoose.model("User", userSchema);