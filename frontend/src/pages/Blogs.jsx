import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { 
  PenTool, 
  Trash2, 
  Edit3, 
  User, 
  Calendar,
  X,
  FilePlus2,
  Sparkles,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import API from "../services/api";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (err) {
        console.error("Invalid token on blogs page", err);
      }
    }
    fetchBlogs();
  }, []);

  const createBlog = async (e) => {
    if (e) e.preventDefault();
    if (!title || !content) {
      return alert("Fill all fields");
    }

    setActionLoading(true);
    try {
      await API.post("/blogs", { title, content });
      setTitle("");
      setContent("");
      await fetchBlogs();
    } catch (err) {
      console.error("Failed to create blog", err);
      alert("Failed to create blog post");
    } finally {
      setActionLoading(false);
    }
  };

  const updateBlog = async (e) => {
    if (e) e.preventDefault();
    if (!title || !content) {
      return alert("Fill all fields");
    }

    setActionLoading(true);
    try {
      await API.put(`/blogs/${editingId}`, { title, content });
      setEditingId(null);
      setTitle("");
      setContent("");
      await fetchBlogs();
    } catch (err) {
      console.error("Failed to update blog", err);
      alert("Failed to update blog post");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await API.delete(`/blogs/${id}`);
      await fetchBlogs();
    } catch (err) {
      alert("Cannot delete");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Page Title Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Creator Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Write rich articles and read shared publications within your organization.
          </p>
        </div>

        {/* Workspace layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Notion/Medium style Editor (Left 2 cols on lg screens) */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden sticky top-6">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent to-primary" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-accent" />
                  <h3 className="font-bold text-slate-800">
                    {editingId ? "Edit Publication" : "Draft Editor"}
                  </h3>
                </div>
                {editingId && (
                  <button 
                    onClick={cancelEdit}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    title="Cancel Edit"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <form onSubmit={editingId ? updateBlog : createBlog} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-0.5 block mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Title your publication..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-0 py-2 border-b border-slate-150 text-xl font-bold text-slate-800 placeholder-slate-350 focus:outline-none focus:border-accent transition-colors bg-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-0.5 block mb-1">
                    Story Content
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Tell your story. Write something inspirational..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-0 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    variant={editingId ? "accent" : "primary"}
                    loading={actionLoading}
                    className="flex-1 py-2.5"
                  >
                    {editingId ? "Save Changes" : "Publish Article"}
                  </Button>
                  
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      className="py-2.5"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>

          {/* Publications Feed (Right 3 cols on lg screens) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-slate-400" />
                <span>Publications Feed</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {blogs.length} {blogs.length === 1 ? "article" : "articles"} published
              </span>
            </div>

            {loading ? (
              <div className="space-y-6">
                <Skeleton variant="card" count={3} />
              </div>
            ) : blogs.length === 0 ? (
              <EmptyState
                title="No articles published"
                description="Be the first to publish a post in this organization workspace."
                icon={FilePlus2}
              />
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {blogs.map((blog) => {
                    const isAuthor = currentUser?.id === blog.author?._id;
                    const canDelete = isAuthor || currentUser?.permissions?.includes("MANAGE_ROLES");

                    return (
                      <motion.div
                        key={blog._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Card animate className="relative overflow-hidden group">
                          {/* Top accent line if current user is author */}
                          {isAuthor && (
                            <div className="absolute top-0 left-0 h-1 w-full bg-accent/30" />
                          )}

                          <div className="flex flex-col gap-4">
                            {/* Author header */}
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                  {blog.author?.name?.charAt(0) || <User className="h-4 w-4" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-slate-700 truncate">{blog.author?.name || "Anonymous"}</p>
                                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                    <Calendar className="h-3 w-3 shrink-0" />
                                    <span>Organization Member</span>
                                  </p>
                                </div>
                              </div>

                              {isAuthor && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-accent/10 text-accent">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  Author
                                </span>
                              )}
                            </div>

                            {/* Blog Title & Content */}
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-lg group-hover:text-primary transition-colors duration-200">
                                {blog.title}
                              </h4>
                              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed whitespace-pre-wrap">
                                {blog.content}
                              </p>
                            </div>

                            {/* Actions footer */}
                            {(isAuthor || canDelete) && (
                              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50 mt-1">
                                {isAuthor && (
                                  <button
                                    onClick={() => {
                                      setEditingId(blog._id);
                                      setTitle(blog.title);
                                      setContent(blog.content);
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-100 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
                                    title="Edit story"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                    <span>Edit</span>
                                  </button>
                                )}

                                {canDelete && (
                                  <button
                                    onClick={() => deleteBlog(blog._id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-50 text-xs font-semibold text-danger hover:bg-red-50/50 transition-all"
                                    title="Delete story"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                  </button>
                                )}
                              </div>
                            )}

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

      </div>
    </Layout>
  );
}