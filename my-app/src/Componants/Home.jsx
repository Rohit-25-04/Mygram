 import axios from "axios";
import React, { useState, useEffect } from "react";

function Home() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState([]);
  const token=localStorage.getItem("token")

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      setPosts(res.data.posts);
    };
    fetchPosts();
  }, []);

  const handleSubmit = async () => {
    if (!image) {
      alert("Select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/post`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPosts([res.data.post, ...posts]);
      setCaption("");
      setImage(null);
      alert("Post uploaded ✅");
    } catch (err) {
      alert(err.response?.data?.Message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-2xl p-6">

        {/* Create Post Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create Post</h2>

          <input
            type="file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full mb-3 border p-2 rounded-lg"
          />

          <input
            type="text"
            name="caption"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
          >
            Post
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {post.username[0].toUpperCase()}
                </div>
                <p className="font-semibold">{post.username}</p>
              </div>

              {/* Image */}
              <img
                src={`data:image/jpeg;base64,${post.image}`}
                alt="post"
                className="w-full object-cover max-h-[500px]"
              />

              {/* Caption */}
              <div className="p-4">
                <p>
                  <span className="font-semibold">{post.username}</span>
                  <span className="ml-2 text-gray-700">
                    {post.caption}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home;