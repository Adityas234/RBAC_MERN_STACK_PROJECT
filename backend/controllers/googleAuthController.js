import { OAuth2Client } from "google-auth-library";

import jwt from "jsonwebtoken";

import User from "../models/User.js";

import Role from "../models/Role.js";
import Log from "../models/log.js";
import Organization from "../models/organization.js";

const client = new OAuth2Client(

process.env.GOOGLE_CLIENT_ID

);

export const googleLogin = async (

req,

res

) => {

try {

const { credential } = req.body;

if (!credential) {

return res.status(400).json({

message:"Credential missing"

});

}

const ticket =

await client.verifyIdToken({

idToken: credential,

audience:

process.env.GOOGLE_CLIENT_ID

});

const payload =

ticket.getPayload();

const email =

payload.email.toLowerCase();

let user =

await User.findOne({

email

}).populate({

path:"roles",

populate:{

path:"permissions"

}

});

if(!user){

const organization =

await Organization.findOne();

if(!organization){

return res.status(500).json({

message:

"No organization found"

});

}

user = await User.create({

name: payload.name,

email,

password: null,

authProvider: "google",

organizationId:

organization._id

});

const userRole =

await Role.findOne({

name:"User"

});

if(!userRole){

return res.status(500).json({

message:

"User role missing"

});

}

user.roles = [

userRole._id

];

await user.save();

await Log.create({

userId: user._id,

organizationId:

organization._id,

action:

"GOOGLE_SIGNUP",

target:

user._id.toString(),

metadata:{

email

}

});

user = await User.findById(

user._id

)

.populate({

path:"roles",

populate:{

path:"permissions"

}

});

}

const permissions =

(user.roles || [])

.flatMap(role =>

(role.permissions || [])

.map(

p=>p.name

)

);

const token = jwt.sign(

{

id:user._id,

name:user.name,

email:user.email,

organizationId:

user.organizationId,

permissions

},

process.env.JWT_SECRET,

{

expiresIn:"1d"

}

);

res.json({

token

});

}

catch(err){

res.status(500).json({

message:

err.message

});

}

};