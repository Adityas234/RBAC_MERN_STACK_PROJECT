import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import API from "../services/api";

import { jwtDecode } from "jwt-decode";

import { Link } from "react-router-dom";

export default function UserDashboard() {

  const [myBlogCount, setMyBlogCount] = useState(0);

  const [userName, setUserName] = useState("User");

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) return;

      const decoded = jwtDecode(token);

      setUserName(

        decoded.name || "User"

      );

      setPermissions(

        decoded.permissions || []

      );

      const blogsRes = await API.get("/blogs/my");

      setMyBlogCount(

        blogsRes.data.length

      );

    }

    catch (err) {

      console.log(err);

    }

  };

  return (

    <Layout>

      <h1 className="page-title">

        👋 Welcome {userName}

      </h1>

      <p className="page-subtitle">

        Manage your blogs

      </p>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <h3>

            📝 My Blogs

          </h3>

          <h1>

            {myBlogCount}

          </h1>

        </div>

        <div className="dashboard-card">

          <h3>

            🔑 Permissions

          </h3>

          <small>

            {permissions.length

            ? permissions.join(", ")

            : "No permissions"}

          </small>

        </div>

      </div>

      <div style={{ marginTop: "40px" }}>

        <h2>

          📌 Quick Actions

        </h2>

        <br />

        <Link to="/blogs">

          📝 Go To Blogs

        </Link>

      </div>

    </Layout>

  );

}