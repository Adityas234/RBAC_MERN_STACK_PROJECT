import {jwtDecode} from "jwt-decode";

import { useEffect, useState } from "react";

import API from "../services/api";

import Layout from "../components/Layout";

export default function Blogs() {

  const [blogs, setBlogs] = useState([]);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);

  const fetchBlogs = async () => {

    try {

      const res = await API.get("/blogs");

      setBlogs(res.data);

    }

    catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      const decoded = jwtDecode(token);

      setCurrentUser(decoded);

    }

    fetchBlogs();

  }, []);

  const createBlog = async () => {

    if (!title || !content) {

      return alert("Fill all fields");

    }

    try {

      await API.post("/blogs", {

        title,

        content

      });

      setTitle("");

      setContent("");

      fetchBlogs();

    }

    catch (err) {

      console.log(err);

    }

  };

  const updateBlog = async () => {

    try {

      await API.put(`/blogs/${editingId}`, {

        title,

        content

      });

      setEditingId(null);

      setTitle("");

      setContent("");

      fetchBlogs();

    }

    catch (err) {

      console.log(err);

    }

  };

  const deleteBlog = async (id) => {

    try {

      await API.delete(`/blogs/${id}`);

      fetchBlogs();

    }

    catch (err) {

      alert("Cannot delete");

    }

  };

  return (

    <Layout>

      <h1 className="page-title">

        📝 Blogs

        </h1>

        <p className="page-subtitle">

        Create, edit and manage blogs

        </p>

      <div className="card">

        <div className="form-row">

        <input

        placeholder="Title"

        value={title}

        onChange={(e) =>

        setTitle(e.target.value)

        }

        />

        </div>

        <div className="form-row">

        <textarea

        rows="5"

        placeholder="Write blog"

        value={content}

        onChange={(e) =>

        setContent(e.target.value)

        }

        />

        </div>

        {editingId ? (

        <button

        onClick={updateBlog}

        >

        Update Blog

        </button>

        ) : (

        <button

        onClick={createBlog}

        >

        Create Blog

        </button>

        )}

        </div>

        <br />

      {blogs.map((blog) => (

        <div

            key={blog._id}

            className="card"

            style={{

            marginBottom:"20px"

            }}

        >

          <h3>{blog.title}</h3>

          <p>{blog.content}</p>

          <small>

            {blog.author?.name}

          </small>

          <br /><br />


          {currentUser && currentUser.id === blog.author?._id && (
            <button

                onClick={() => {

                setEditingId(blog._id);

                setTitle(blog.title);

                setContent(blog.content);

                }}

            >

                Edit

            </button>

        )}
        {" "}
          {(

                currentUser?.id === blog.author?._id ||

                currentUser?.permissions?.includes("MANAGE_ROLES")

                ) && (

                <button

                onClick={() => deleteBlog(blog._id)}

                >

                Delete

                </button>

            )}

        </div>

      ))}

    </Layout>

  );

}