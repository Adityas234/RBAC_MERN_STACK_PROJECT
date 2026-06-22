import User from "../models/User.js";

export const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate({
        path: "roles",
        populate: {
          path: "permissions"
        }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Collect all permissions
      const userPermissions = user.roles.flatMap(role =>
        role.permissions.map(p => p.name)
      );

      // Debug (optional but useful)
      // console.log("User permissions:", userPermissions);

      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden: No permission" });
      }

      next();

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};