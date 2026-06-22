import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users as UsersIcon,
  Activity,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Building,
  User,
  ShieldCheck
} from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        const hasAdmin = decoded.permissions?.includes("MANAGE_ROLES");
        setIsAdmin(hasAdmin);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: "any"
    },
    {
      name: "Users",
      path: "/users",
      icon: UsersIcon,
      roles: "admin"
    },
    {
      name: "Audit Logs",
      path: "/logs",
      icon: Activity,
      roles: "admin"
    },
    {
      name: "Blogs",
      path: "/blogs",
      icon: FileText,
      roles: "any"
    }
  ];

  const filteredNavItems = navItems.filter(
    (item) => item.roles === "any" || (item.roles === "admin" && isAdmin)
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50 text-slate-900 font-sans">
      {/* Mobile Header Nav */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 px-4 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/20">
            R
          </div>
          <span className="font-bold text-slate-800 tracking-tight">RBAC Admin</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Drawer (Side Menu Overlay) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-[280px] bg-white border-r border-slate-100 z-50 flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/20">
                    R
                  </div>
                  <span className="font-bold text-slate-800 tracking-tight">RBAC Admin</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tenant Org badge */}
              {user?.organizationId && (
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl mb-6 border border-slate-100">
                  <Building className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600 truncate">
                    Org ID: {user.organizationId}
                  </span>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 flex flex-col gap-1.5">
                {filteredNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User profile & Logout */}
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-100 text-danger hover:bg-red-50/50 font-medium transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="hidden md:flex flex-col border-r border-slate-100 bg-white h-screen sticky top-0 shrink-0 z-20 shadow-sm"
      >
        {/* Header Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white font-extrabold shadow-md shadow-primary/25 shrink-0">
              R
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-slate-800 tracking-tight whitespace-nowrap"
              >
                RBAC Admin
              </motion.span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors border border-slate-100"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Tenant Org badge */}
        {!isCollapsed && user?.organizationId && (
          <div className="mx-6 mt-6 flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
            <Building className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 truncate" title={user.organizationId}>
              Org ID: {user.organizationId}
            </span>
          </div>
        )}

        {/* Links Navigation */}
        <nav className="flex-1 flex flex-col gap-1.5 px-4 mt-6">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center rounded-xl py-3 transition-all font-medium relative ${isCollapsed ? "justify-center px-0" : "px-4 gap-3.5"
                  } ${isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-500 hover:bg-slate-50/80 hover:text-slate-900"
                  }`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={`h-5 w-5 shrink-0 transition-transform ${isActive ? "" : "group-hover:scale-105"}`} />
                {!isCollapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
                    {item.name}
                  </motion.span>
                )}
                {/* Visual Active Indicator Dot for Collapsed Mode */}
                {isCollapsed && isActive && (
                  <span className="absolute left-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info / Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {!isCollapsed ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold relative shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                  {isAdmin && (
                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-success rounded-full text-white" title="Admin Access">
                      <ShieldCheck className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-200/60 bg-white text-danger hover:bg-red-50 text-sm font-medium shadow-sm transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold relative">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                {isAdmin && (
                  <span className="absolute -bottom-1 -right-1 p-0.5 bg-success rounded-full text-white">
                    <ShieldCheck className="h-3 w-3" />
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-danger hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}