import { useEffect, useState } from "react";
import { 
  Activity, 
  Search, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Building,
  Filter,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import API from "../services/api";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Determine appropriate action icon
  const getLogIcon = (action) => {
    const act = action?.toLowerCase() || "";
    if (act.includes("create user")) return { icon: UserPlus, color: "text-blue-500 bg-blue-50 border-blue-100" };
    if (act.includes("delete user")) return { icon: Trash2, color: "text-red-500 bg-red-50 border-red-100" };
    if (act.includes("assign role")) return { icon: ShieldCheck, color: "text-purple-500 bg-purple-50 border-purple-100" };
    if (act.includes("create blog")) return { icon: FileText, color: "text-emerald-500 bg-emerald-50 border-emerald-100" };
    if (act.includes("delete blog")) return { icon: Trash2, color: "text-rose-500 bg-rose-50 border-rose-100" };
    return { icon: Activity, color: "text-slate-500 bg-slate-50 border-slate-100" };
  };

  // Determine action tag colors
  const getBadgeStyle = (action) => {
    const act = action?.toLowerCase() || "";
    if (act.includes("delete")) return "bg-red-50 text-red-700 border-red-100";
    if (act.includes("assign") || act.includes("role")) return "bg-purple-50 text-purple-700 border-purple-100";
    if (act.includes("create")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    return "bg-slate-50 text-slate-700 border-slate-150";
  };

  // Unique actions list for filter options
  const actionOptions = ["all", ...new Set(logs.map(log => log.action))];

  // Filter logs client-side
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.organizationId?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = actionFilter === "all" || log.action === actionFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
              <span>Security Audit Trail</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Cryptographically verified, immutable record of organization operations and system logs.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchLogs}
            className="self-start sm:self-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Feed</span>
          </Button>
        </div>

        {/* Filter Toolbar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input Card */}
          <Card className="p-3 md:col-span-2 flex items-center gap-3">
            <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by action description, target ID, or tenant organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </Card>

          {/* Action Type Select Dropdown */}
          <Card className="p-3 flex items-center gap-3">
            <Filter className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-600 focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">Filter: All Actions</option>
              {actionOptions.filter(opt => opt !== "all").map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </Card>
        </div>

        {/* Timeline security logs list */}
        <div className="space-y-4">
          {loading ? (
            <Skeleton variant="log-item" count={4} />
          ) : filteredLogs.length === 0 ? (
            <EmptyState
              title="No security logs registered"
              description={searchQuery || actionFilter !== "all" ? "No audit records match your query." : "Workspace operations will automatically stream here."}
              icon={ShieldAlert}
            />
          ) : (
            <div className="relative border-l border-slate-100 ml-6 pl-6 space-y-6">
              <AnimatePresence>
                {filteredLogs.map((log, index) => {
                  const itemConfig = getLogIcon(log.action);
                  const IconComp = itemConfig.icon;
                  
                  return (
                    <motion.div
                      key={log._id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35 }}
                      className="relative"
                    >
                      {/* Timeline point indicator */}
                      <span className={`absolute -left-[38px] top-1.5 w-6 h-6 rounded-lg flex items-center justify-center border shadow-sm ${itemConfig.color}`}>
                        <IconComp className="h-3.5 w-3.5" />
                      </span>

                      <Card animate className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex px-2 py-0.5 border rounded-md text-[10px] font-bold uppercase tracking-wider ${getBadgeStyle(log.action)}`}>
                              {log.action}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              <Building className="h-3 w-3 shrink-0" />
                              <span>Tenant Org: {log.organizationId}</span>
                            </span>
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-semibold text-slate-700">
                              Target Resource ID
                            </p>
                            <code className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-1.5 py-0.5 mt-1 select-all break-all self-start">
                              {log.target}
                            </code>
                          </div>
                        </div>

                        {/* Timestamp card alignment */}
                        <div className="flex items-center gap-2 text-slate-400 shrink-0 border-t md:border-t-0 border-slate-50 pt-2.5 md:pt-0">
                          <Clock className="h-4 w-4 shrink-0 text-slate-300" />
                          <div className="text-right">
                            <p className="text-xs font-medium text-slate-500">
                              {new Date(log.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}