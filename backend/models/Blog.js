import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(

{

  title: {

    type: String,

    required: true,

    trim: true,

    minlength: 5,

    maxlength: 100

  },

  content: {

    type: String,

    required: true,

    trim: true,

    minlength: 20,

    maxlength: 5000

  },

  author: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true

  },

  organizationId: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "Organization",

    required: true

  }

},

{

  timestamps: true

}

);

export default mongoose.model(

"Blog",

blogSchema

);