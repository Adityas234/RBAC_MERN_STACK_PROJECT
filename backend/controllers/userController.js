import User from "../models/User.js";
import Log from "../models/log.js";


export const assignRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    // Validate input
    if (!userId || !roleId) {
      return res.status(400).json({ message: "userId and roleId are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure organizationId exists
    if (!user.organizationId) {
      return res.status(400).json({ message: "User has no organization" });
    }

    if (!req.user.organizationId) {
      return res.status(401).json({ message: "Invalid token (no organization)" });
    }

    // Prevent cross-organization assignment
    if (
      user.organizationId.toString() !==
      req.user.organizationId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }    

    user.roles = [roleId];

    await user.save();

    await Log.create({

      userId: req.user.id,

      organizationId: req.user.organizationId,

      action: "ASSIGN_ROLE",

      target: user._id.toString(),

      metadata: {
        roleId
      }

    });

    // Remove password before sending response
    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: "Role assigned successfully",
      user: userObj
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};