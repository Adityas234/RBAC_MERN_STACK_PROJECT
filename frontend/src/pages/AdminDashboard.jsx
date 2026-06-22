import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import { jwtDecode } from "jwt-decode";
import { 
  Users as UsersIcon, 
  FileText, 
  ShieldAlert, 
  Activity, 
  Building,
  ArrowRight,
  TrendingUp,
  Cpu,
  Server,
  CloudLightning,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

import Layout from "../components/Layout";
import API from "../services/api";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import FloatingOrb from "../components/three/FloatingOrb";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [organizationId, setOrganizationId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setOrganizationId(decoded.organizationId || "");
      } catch (err) {
        console.error("JWT Decode error", err);
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, logsRes, blogsRes, rolesRes] = await Promise.all([
        API.get("/users"),
        API.get("/logs"),
        API.get("/blogs"),
        API.get("/roles")
      ]);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
      setBlogs(blogsRes.data);
      setRoles(rolesRes.data);
    } catch (err) {
      console.error("Error fetching admin dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
  };

  return (
    <Layout>
      <div className="relative">
        {/* Glow backdrop decorative */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

        {/* Dashboard Header Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Admin Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time telemetry and management controls for your workspace.
            </p>
          </div>
          {organizationId && (
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm self-start">
              <Building className="h-4.5 w-4.5 text-primary" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tenant Organization</p>
                <p className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">{organizationId}</p>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Skeleton variant="card" count={4} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Skeleton variant="card" />
              </div>
              <div>
                <Skeleton variant="card" />
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Users */}
              <motion.div variants={itemVariants}>
                <Card animate className="relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</p>
                      <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
                        <AnimatedCounter end={users.length} duration={1.5} />
                      </h2>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                      <UsersIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Workspace members</span>
                  </div>
                </Card>
              </motion.div>

              {/* Card 2: Blogs */}
              <motion.div variants={itemVariants}>
                <Card animate className="relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Blogs</p>
                      <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
                        <AnimatedCounter end={blogs.length} duration={1.5} />
                      </h2>
                    </div>
                    <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:scale-110 transition-transform">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-violet-600 font-medium">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Published articles</span>
                  </div>
                </Card>
              </motion.div>

              {/* Card 3: Roles */}
              <motion.div variants={itemVariants}>
                <Card animate className="relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Roles</p>
                      <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
                        <AnimatedCounter end={roles.length} duration={1.5} />
                      </h2>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <Activity className="h-3.5 w-3.5" />
                    <span>Dynamic access models</span>
                  </div>
                </Card>
              </motion.div>

              {/* Card 4: Audit Logs */}
              <motion.div variants={itemVariants}>
                <Card animate className="relative overflow-hidden group">
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audit Logs</p>
                      <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
                        <AnimatedCounter end={logs.length} duration={1.5} />
                      </h2>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Activity className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Logged operations</span>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Split section: Telemetry Visualizations & Activity Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left & Middle: Premium Analytics Mockup & Orb Panel */}
              <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-6">
                <Card className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="space-y-4 max-w-sm">
                    <span className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg">
                      3D Rendering Node
                    </span>
                    <h3 className="text-xl font-bold text-slate-800">
                      Decentralized Workspace Engine
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Your session is protected with asymmetric JWT authentication. Real-time updates and log sync are fully enabled for security verification.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <Link to="/users" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-light transition-colors">
                        <span>Manage Users</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link to="/logs" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
                        <span>Audit Records</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex justify-center shrink-0">
                    <FloatingOrb className="h-44 w-44" />
                  </div>
                </Card>

                {/* Grid of Micro stats - SaaS Latency metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="p-4 flex items-center gap-4 bg-slate-50/50">
                    <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600">
                      <Cpu className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Gateway API</p>
                      <p className="text-xs font-bold text-slate-700">Healthy (24ms)</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4 flex items-center gap-4 bg-slate-50/50">
                    <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600">
                      <Server className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">MongoDB</p>
                      <p className="text-xs font-bold text-slate-700">Connected</p>
                    </div>
                  </Card>

                  <Card className="p-4 flex items-center gap-4 bg-slate-50/50">
                    <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600">
                      <CloudLightning className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Vercel Build</p>
                      <p className="text-xs font-bold text-success">Optimized</p>
                    </div>
                  </Card>
                </div>
              </motion.div>

              {/* Right panel: Recent Audit Logs timeline preview */}
              <motion.div variants={itemVariants} className="flex">
                <Card className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-800">Recent Security Feed</h3>
                      <Link to="/logs" className="text-xs font-bold text-primary hover:underline">
                        View All
                      </Link>
                    </div>

                    {logs.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No activities logged yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {logs.slice(0, 4).map((log, index) => (
                          <div key={log._id || index} className="flex gap-3 text-xs">
                            <div className="relative flex flex-col items-center">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-50" />
                              {index !== logs.slice(0, 4).length - 1 && (
                                <span className="w-0.5 flex-grow bg-slate-100 my-1" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-700 truncate">{log.action}</p>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">{log.target}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Commands</p>
                    <div className="flex gap-2">
                      <Link to="/blogs" className="flex-1 text-center py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-xs font-medium transition-colors">
                        Create Post
                      </Link>
                      <Link to="/users" className="flex-1 text-center py-2 bg-primary text-white hover:bg-primary-light rounded-xl text-xs font-medium transition-colors shadow-sm">
                        New User
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>

            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}