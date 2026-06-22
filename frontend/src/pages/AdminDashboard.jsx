import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import API from "../services/api";

import { jwtDecode } from "jwt-decode";

export default function AdminDashboard() {

  const [users, setUsers] = useState([]);

  const [logs, setLogs] = useState([]);

  const [blogs, setBlogs] = useState([]);

  const [roles, setRoles] = useState([]);

  const [organizationId, setOrganizationId] = useState("");

  useEffect(() => {

    fetchData();

    const token = localStorage.getItem("token");

    if (token) {

      const decoded = jwtDecode(token);

      setOrganizationId(
        decoded.organizationId
      );

    }

  }, []);

  const fetchData = async () => {

    try {

      const [

        usersRes,

        logsRes,

        blogsRes,

        rolesRes

      ] = await Promise.all([

        API.get("/users"),

        API.get("/logs"),

        API.get("/blogs"),

        API.get("/roles")

      ]);

      setUsers(usersRes.data);

      setLogs(logsRes.data);

      setBlogs(blogsRes.data);

      setRoles(rolesRes.data);

    }

    catch (err) {

      console.log(err);

    }

  };

  return (

    <Layout>

      <h1 className="page-title">

        📊 Admin Dashboard

      </h1>

      <p className="page-subtitle">

        Manage your organization

      </p>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <h3>

            👥 Total Users

          </h3>

          <h1>

            {users.length}

          </h1>

        </div>

        <div className="dashboard-card">

          <h3>

            📝 Total Blogs

          </h3>

          <h1>

            {blogs.length}

          </h1>

        </div>

        <div className="dashboard-card">

          <h3>

            🛡️ Total Roles

          </h3>

          <h1>

            {roles.length}

          </h1>

        </div>

        <div className="dashboard-card">

          <h3>

            📜 Audit Logs

          </h3>

          <h1>

            {logs.length}

          </h1>

        </div>

        <div className="dashboard-card">

          <h3>

            🏢 Organization

          </h3>

          <small>

            {organizationId}

          </small>

        </div>

      </div>

    </Layout>

  );

}