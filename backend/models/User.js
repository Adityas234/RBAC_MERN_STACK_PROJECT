import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: {

    type: String,

    required: true,

    trim: true,

    minlength: 2,

    maxlength: 50

  },

  email: {

    type: String,

    required: true,

    unique: true,

    trim: true,

    lowercase: true,

    match: [

      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

      "Invalid email"

    ]

  },

  password: {

    type: String,

    default: null

  },
  authProvider: {

    type: String,

    enum: ["local", "google"],

    default: "local"

  },

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

},

{

  timestamps: true

});

export default mongoose.model(

  "User",

  userSchema

);