import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {

    return <Navigate to="/" />;

  }

  try {

    const decoded = jwtDecode(token);

    const isAdmin = decoded.permissions?.includes(
      "MANAGE_ROLES"
    );

    if (!isAdmin) {

      return <Navigate to="/dashboard" />;

    }

    return children;

  }

  catch {

    return <Navigate to="/" />;

  }

}