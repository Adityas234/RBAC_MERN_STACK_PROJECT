import Role from "../models/Role.js";
import Log from "../models/log.js";


// ✅ CREATE ROLE
export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    // 🔴 FIX: check duplicate BEFORE creating
    const existing = await Role.findOne({
      name,
      organizationId: req.user.organizationId
    });

    if (existing) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({
      name,
      organizationId: req.user.organizationId,
      permissions
    });

    // ✅ AUDIT LOG
    await Log.create({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "CREATE_ROLE",
      target: role._id.toString(),
      metadata: { name }
    });

    res.status(201).json(role);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ UPDATE ROLE
export const updateRole = async (req, res) => {
  try {
    const { roleId, permissions } = req.body;

    if (!roleId || !permissions) {
      return res.status(400).json({ message: "roleId and permissions required" });
    }

    const role = await Role.findById(roleId);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Multi-tenant protection
    if (role.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    role.permissions = permissions;
    await role.save();

    // ✅ AUDIT LOG
    await Log.create({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "UPDATE_ROLE",
      target: roleId,
      metadata: { permissions }
    });

    res.json({ message: "Role updated", role });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ DELETE ROLE
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (role.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await role.deleteOne();

    // ✅ AUDIT LOG
    await Log.create({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "DELETE_ROLE",
      target: id,
      metadata: { name: role.name }
    });

    res.json({ message: "Role deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRoles = async (req, res) => {
  try {

    console.log("==============");

    console.log("REQ USER");

    console.log(req.user);

    console.log("ORG FROM TOKEN");

    console.log(req.user.organizationId);

    const roles = await Role.find();

    console.log("ALL ROLES");

    console.log(roles);

    const filteredRoles = await Role.find({
      organizationId: req.user.organizationId
    });

    console.log("FILTERED ROLES");

    console.log(filteredRoles);

    res.json(filteredRoles);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};