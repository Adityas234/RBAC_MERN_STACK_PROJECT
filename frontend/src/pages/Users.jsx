import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { 
  UserPlus, 
  Search, 
  Trash2, 
  Shield, 
  Mail, 
  User, 
  Lock,
  Plus,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import API from "../services/api";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Permissions
  const [permissions, setPermissions] = useState([]);

  // Decode JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setPermissions(decoded.permissions || []);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // Permission flags
  const canCreate = permissions.includes("CREATE_USER");
  const canDelete = permissions.includes("DELETE_USER");
  const canManageRoles = permissions.includes("MANAGE_ROLES");

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  useEffect(() => {
    API.get("/roles")
      .then((res) => setRoles(res.data))
      .catch((err) => console.error("Error fetching roles", err));
  }, []);

  // Create user
  const createUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    
    setFormLoading(true);
    try {
      await API.post("/users", { name, email, password });
      await fetchUsers();
      setName("");
      setEmail("");
      setPassword("");
      alert("User created successfully!");
    } catch (err) {
      alert("Failed to create user");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      await fetchUsers();
    } catch {
      alert("Delete failed");
    }
  };

  // Assign role
  const assignRole = async (userId, roleId) => {
    if (!roleId) return;
    try {
      await API.post("/users/assign-role", { userId, roleId });
      await fetchUsers();
      alert("Role assigned successfully!");
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to assign role");
      }
    }
  };

  // Filter users client-side
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              User Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Provision workspace accounts, assign organization roles and configure authorization levels.
            </p>
          </div>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* Main User List Section (Left/Middle 2 cols) */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Search filter controls */}
            <Card className="p-4 flex items-center gap-3">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </Card>

            {/* Table Card container */}
            <Card className="overflow-hidden p-0 border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User Profile</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Security Roles</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <Skeleton variant="table-row" count={4} />
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-8">
                          <EmptyState
                            title="No users found"
                            description={searchQuery ? "No records match your search filter." : "Create user accounts to display records here."}
                            icon={User}
                          />
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const rolesText = u.roles?.length
                          ? u.roles.map((r) => r.name).join(", ")
                          : "No Role";
                        
                        return (
                          <motion.tr 
                            key={u._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-slate-50/40 transition-colors"
                          >
                            {/* Profile details */}
                            <td className="px-6 py-4.5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                                  {u.name?.slice(0, 2)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                                  <p className="text-xs text-slate-400 truncate mt-0.5">{u.email}</p>
                                </div>
                              </div>
                            </td>

                            {/* Roles Badge listing */}
                            <td className="px-6 py-4.5">
                              <div className="flex flex-wrap gap-1.5">
                                {u.roles?.length ? (
                                  u.roles.map((role) => (
                                    <span 
                                      key={role._id}
                                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        role.name?.toLowerCase().includes("admin")
                                          ? "bg-purple-50 text-purple-600 border border-purple-100"
                                          : "bg-blue-50 text-blue-600 border border-blue-100"
                                      }`}
                                    >
                                      <Shield className="h-3 w-3" />
                                      {role.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                                    No Role Assigned
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Actions column */}
                            <td className="px-6 py-4.5">
                              <div className="flex items-center justify-end gap-3.5">
                                
                                {/* Assign Role dropdown */}
                                {canManageRoles && (
                                  <div className="relative">
                                    <select
                                      onChange={(e) => assignRole(u._id, e.target.value)}
                                      defaultValue=""
                                      className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl py-1.5 pl-3 pr-8 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                                    >
                                      <option value="" disabled>Assign Role</option>
                                      {roles.map((role) => (
                                        <option key={role._id} value={role._id}>
                                          {role.name}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                )}

                                {/* Delete user button */}
                                {canDelete && (
                                  <button
                                    onClick={() => deleteUser(u._id)}
                                    className="p-2 text-slate-400 hover:text-danger hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete User"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Create User Form Section (Right 1 col) */}
          <div className="space-y-6">
            {canCreate ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 w-full bg-primary" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Add Workspace Member</h3>
                      <p className="text-xs text-slate-400">Create login credentials</p>
                    </div>
                  </div>

                  <form onSubmit={createUser} className="space-y-5">
                    <Input
                      label="Full Name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      icon={User}
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={Mail}
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={Lock}
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      loading={formLoading}
                      className="w-full py-2.5"
                    >
                      Create User Account
                    </Button>
                  </form>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-slate-50 border-dashed border-2 border-slate-200 p-6 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-3">
                  <Lock className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Account Creation Locked</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                  You do not possess the `CREATE_USER` permission.
                </p>
              </Card>
            )}
          </div>

        </div>

      </div>
    </Layout>
  );
}