import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Organization from "../models/organization.js";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
export const signup = async (req, res) => {
  try {
    const {

    name,

    email,

    password,

    organizationName

    } = req.body;

    const cleanName = name?.trim();

    const cleanEmail = email?.trim().toLowerCase();

    const cleanOrg =

    organizationName?.trim()

    ||

    `${cleanName}'s Organization`;

    // Validate password
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character" });
    }

    const existingUser =

    await User.findOne({

    email: cleanEmail

    });

    const existingOrg =

    await Organization.findOne({

    name: cleanOrg

    });

    if(existingOrg){

    return res.status(400).json({

    message:

    "Organization already exists"

    });

    }
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

    name: cleanName,

    email: cleanEmail,

    password: hashedPassword,
    authProvider: "local",

    });
    // Step 2: Create organization
    const organization = await Organization.create({
      name: cleanOrg,
      createdBy: user._id
    });

// Link organization to user
    user.organizationId = organization._id;

    await user.save();

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      organization
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const {

    email,

    password

    } = req.body;

    const cleanEmail =

    email.trim().toLowerCase();

    // find user
    const user = await User.findOne({

    email: cleanEmail

    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.authProvider === "google") {

    return res.status(400).json({

      message: "Use Google Sign In"

    });

    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔥 IMPORTANT: populate roles + permissions
    const fullUser = await User.findById(user._id)
    .populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "Permission"
      }
    });

    console.log(JSON.stringify(fullUser, null, 2));

    // extract permission names
    const permissions = (fullUser.roles || []).flatMap(role =>
      (role.permissions || [])
      .filter(Boolean)
      .map(p => p.name)
    );  

    // create token with permissions
    const token = jwt.sign(

      {

        id: fullUser._id,

        name: fullUser.name,

        email: fullUser.email,

        organizationId: fullUser.organizationId,

        permissions

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "1d"

      }

    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};