import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Log from "../models/log.js";

const passwordRegex =

/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// CREATE USER (Admin)
export const createUser = async (req, res) => {
  try {
    const {

    name,

    email,

    password

    } = req.body;

    const cleanName =

    name.trim();

    const cleanEmail =

    email.trim().toLowerCase();

    if(

    !passwordRegex.test(

    password

    )

    ){

    return res.status(400).json({

    message:

    "Weak password"

    });

    } 

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashed,
      organizationId: req.user.organizationId
    });

    const userObj = user.toObject();
    delete userObj.password;

    await Log.create({
  userId: req.user.id,
  organizationId: req.user.organizationId,
  action: "CREATE_USER",
  target: user._id.toString(),
  metadata: {
    email: user.email
  }
});

    res.status(201).json(userObj);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET USERS (same org only)
export const getUsers = async (req, res) => {
  try {

    const users = await User.find({

      organizationId: req.user.organizationId

    })

    .populate("roles")

    .select("-password");

    res.json(users);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};


// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Log.create({
  userId: req.user.id,
  organizationId: req.user.organizationId,
  action: "DELETE_USER",
  target: id
});
    await user.deleteOne();

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};