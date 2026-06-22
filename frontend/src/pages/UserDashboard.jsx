import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import { jwtDecode } from "jwt-decode";
import { 
  FileText, 
  Key, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  FilePlus,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";

import Layout from "../components/Layout";
import API from "../services/api";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";

export default function UserDashboard() {
  const [myBlogCount, setMyBlogCount] = useState(0);
  const [userName, setUserName] = useState("User");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      setUserName(decoded.name || "User");
      setPermissions(decoded.permissions || []);

      const blogsRes = await API.get("/blogs/my");
      setMyBlogCount(blogsRes.data.length);
    } catch (err) {
      console.error("Error fetching user dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        {/* Neon decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

        {/* Dashboard Header */}
        <div className="flex flex-col gap-1.5 mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Welcome back, {userName}
            </h1>
            <motion.div
              animate={{ rotate: [0, 15, -10, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 4 }}
              className="text-3xl"
            >
              👋
            </motion.div>
          </div>
          <p className="text-sm text-slate-500">
            Create drafts, manage your publications, and check permissions.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton variant="card" count={2} />
            </div>
            <Skeleton variant="card" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blog Count Card */}
              <motion.div variants={itemVariants}>
                <Card animate className="relative overflow-hidden group h-full flex flex-col justify-between">
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-blue-400" />
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Articles</p>
                        <h2 className="text-4xl font-extrabold text-slate-800 mt-3">
                          <AnimatedCounter end={myBlogCount} duration={1.2} />
                        </h2>
                      </div>
                      <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                        <FileText className="h-5.5 w-5.5" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 max-w-xs">
                      Your total published blogs inside this organization.
                    </p>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-50">
                    <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light group/link">
                      <span>Go to Blogs editor</span>
                      <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Card>
              </motion.div>

              {/* Permissions Card */}
              <motion.div variants={itemVariants}>
                <Card animate className="relative overflow-hidden group h-full flex flex-col justify-between">
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent to-purple-400" />
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Permissions</p>
                        <h4 className="text-slate-800 font-bold text-lg mt-1">Authorized Actions</h4>
                      </div>
                      <div className="p-3 bg-accent/10 text-accent rounded-xl">
                        <Key className="h-5.5 w-5.5" />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {permissions.length > 0 ? (
                        permissions.map((perm) => (
                          <span 
                            key={perm}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600 shadow-sm"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
                            {perm}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No permissions assigned.</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-4 border-t border-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-accent" />
                    <span>RBAC protection active</span>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions Panel */}
            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 text-lg">Creator Workspace Shortcuts</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link 
                    to="/blogs" 
                    className="group p-5 rounded-2xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex items-start gap-4 transition-all"
                  >
                    <div className="p-3 bg-white text-slate-700 rounded-xl group-hover:scale-105 transition-transform shadow-sm">
                      <FilePlus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">Write New Post</h4>
                      <p className="text-xs text-slate-400 mt-1">Compose thoughts and distribute internally within your team.</p>
                    </div>
                  </Link>

                  <Link 
                    to="/blogs" 
                    className="group p-5 rounded-2xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 flex items-start gap-4 transition-all"
                  >
                    <div className="p-3 bg-white text-slate-700 rounded-xl group-hover:scale-105 transition-transform shadow-sm">
                      <BookOpen className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-accent transition-colors">Browse Publications</h4>
                      <p className="text-xs text-slate-400 mt-1">Read blogs written by admins and colleagues in your space.</p>
                    </div>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}