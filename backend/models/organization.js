import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({

  name: {

    type: String,

    required: true,

    unique: true,

    trim: true,

    minlength: 2,

    maxlength: 100

  },

  createdBy: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User"

  }

},

{

  timestamps: true

});

export default mongoose.model(

  "Organization",

  organizationSchema

);