import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Users from "./pages/Users";
import Logs from "./pages/Logs";
import Blogs from "./pages/Blogs";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";


function App() {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const hasAdmin = decoded.permissions?.includes("MANAGE_ROLES");
      setIsAdmin(hasAdmin);
    } catch {
      setIsAdmin(false);
    }
  }, []);

  // ⛔ prevent wrong render before state loads
  if (isAdmin === null) return <p>Loading...</p>;

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route

        path="/dashboard"

        element={

        <ProtectedRoute>

        {isAdmin

        ? <AdminDashboard />

        : <UserDashboard />

        }

        </ProtectedRoute>

        }

      />

      <Route

        path="/users"

        element={

        <AdminRoute>

        <Users />

        </AdminRoute>

        }

      />

      <Route

      path="/logs"

      element={

      <AdminRoute>

      <Logs />

      </AdminRoute>

      }

      />

      <Route

        path="/blogs"

        element={

        <ProtectedRoute>

        <Blogs />

        </ProtectedRoute>

        }

      />
    </Routes>
  );
}

export default App;