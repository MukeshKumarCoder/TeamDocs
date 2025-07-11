import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [documentData, setDocumentData] = useState({
    title: "",
    content: "",
    visibility: "private",
  });

  const { token } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumentData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchDocument = async () => {
    try {
      const res = await axios.get(`https://teamdocs-backend.onrender.com/api/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setDocumentData(res.data.doc);
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://teamdocs-backend.onrender.com/api/documents/edit/${id}`,
        documentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success("Document updated successfully!");
      setTimeout(() => {
        navigate("/document");
      }, 1000);
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to update document.");
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
        <h2 className="text-xl font-semibold mb-4">Edit Document</h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-y-3 w-full">
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
            {loading ? "Updating..." : "Update Document"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocumentEditor;
