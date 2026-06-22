import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Organization from "../models/organization.js";


export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      organizationName = `${name}'s Organization`
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });
    // Step 2: Create organization
    const organization = await Organization.create({
      name: organizationName,
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
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
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