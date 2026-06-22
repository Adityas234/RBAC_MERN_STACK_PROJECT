import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { jwtDecode } from "jwt-decode";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        console.log("Invalid token");
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
      console.log(err);
    }
  };

  // Fetch roles
  useEffect(() => {
    API.get("/roles")
      .then((res) => setRoles(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Create user
  const createUser = async () => {
    try {
      await API.post("/users", {
        name,
        email,
        password
      });

      await fetchUsers();

      setName("");
      setEmail("");
      setPassword("");

      alert("User created");

    } catch {
      alert("Failed to create user");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {

      await API.delete(`/users/${id}`);

      await fetchUsers();

    } catch {

      alert("Delete failed");

    }
  };

  // Assign role
  const assignRole = async (userId, roleId) => {
    try {

      if (!roleId) return;

      await API.post("/users/assign-role", {
        userId,
        roleId
      });

      await fetchUsers();

      alert("Role assigned");

    } catch (err) {

      if (err.response?.data?.message) {

        alert(err.response.data.message);

      } else {

        alert("Failed to assign role");

      }

    }
  };

  return (
    <Layout>

      <h1 className="page-title">

      👥 User Management

      </h1>

      <p className="page-subtitle">

      Manage users and assign roles

      </p>

      {/* Create User Card */}

      {canCreate && (

        <div className="card">

          <h3>Create User</h3>
          <div className="form-row">

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              style={{
                padding: "10px 20px"
              }}
              onClick={createUser}
            >
          

            Create User

            </button>
          </div>

        </div>

      )}

      {/* Users Table */}

      <table className="table">

        <thead>

          <tr>

            <th>Name</th>

            <th>Email</th>

            <th>Current Role</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {users.map((u) => (

            <tr key={u._id}>

              <td>{u.name}</td>

              <td>{u.email}</td>

              <td>

                {u.roles?.length

                  ? u.roles.map(role => role.name).join(", ")

                  : "No Role"

                }

              </td>

              <td>

                {canDelete && (

                  <button
                    onClick={() => deleteUser(u._id)}
                  >

                    Delete

                  </button>

                )}
                {" "}
                {canManageRoles && (

                  <select
                    onChange={(e) =>
                      assignRole(
                        u._id,
                        e.target.value
                      )
                    }
                  >

                    <option value="">

                      Assign Role

                    </option>

                    {roles.map((role) => (

                      <option
                        key={role._id}
                        value={role._id}
                      >

                        {role.name}

                      </option>

                    ))}

                  </select>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </Layout>
  );
}