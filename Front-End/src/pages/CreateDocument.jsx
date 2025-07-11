import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLongArrowAltLeft } from "react-icons/fa";

const CreateDocument = () => {
  const [loading, setLoading] = useState(false);
  const [documentData, setDocumentData] = useState({
    title: "",
    content: "",
    visibility: "private",
  });

  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://teamdocs-backend.onrender.com/api/documents/create",
        documentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(res.data.message || "Document created successfully");
      // Optionally reset form
      setDocumentData({ title: "", content: "", visibility: "private" });
      setTimeout(() => {
        navigate("/document");
      }, 1000);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-[calc(100vh-3.5rem)] bg-amber-100">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-10 left-20 cursor-pointer flex items-center gap-x-1"
      >
        <FaLongArrowAltLeft />
        Back
      </button>
      <div className="flex flex-col items-center justify-center w-6/12 bg-amber-200 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Create Document</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-3 w-full">
          <input
            type="text"
            name="title"
            placeholder="Document Title"
            value={documentData.title}
            required
            onChange={handleChange}
            className="w-full p-2 border border-amber-300 outline-none rounded"
          />

          <select
            name="visibility"
            value={documentData.visibility}
            onChange={handleChange}
            className="p-2 border border-amber-300 rounded w-full"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>

          <textarea
            name="content"
            placeholder="Write your content here... Use @username to mention."
            value={documentData.content}
            onChange={handleChange}
            className="p-2 border border-amber-300 rounded h-60 resize-none"
            required
          />

          <button
            type="submit"
            className="bg-amber-300 text-black px-4 py-2 rounded hover:bg-amber-400 cursor-pointer disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Document"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDocument;
