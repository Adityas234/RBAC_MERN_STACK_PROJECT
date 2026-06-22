import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Layout({ children }) {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let isAdmin = false;

  if (token) {

    try {

      const decoded = jwtDecode(token);

      isAdmin = decoded.permissions?.includes(
        "MANAGE_ROLES"
      );

    }

    catch {}

  }

  const logout = () => {

    localStorage.clear();

    navigate("/");

    window.location.reload();

  };

  return (

    <div className="app-container">

    <div className="sidebar">

    <h2 className="sidebar-title">

    RBAC System

    </h2>

    <div className="nav-links">

    <Link to="/dashboard">

    📊 Dashboard

    </Link>

    {isAdmin && (

    <Link to="/users">

    👥 Users

    </Link>

    )}

    {isAdmin && (

    <Link to="/logs">

    📜 Audit Logs

    </Link>

    )}

    <Link to="/blogs">

    📝 Blogs

    </Link>

    <button

    className="logout-btn"

    onClick={logout}

    >

    🚪 Logout

    </button>

    </div>

    </div>

    <div className="page-wrapper">

    {children}

    </div>

    </div>

    );

}