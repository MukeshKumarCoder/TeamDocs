import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [searchInput, setSearchInput] = useState("");
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.user);

  const getDocuments = async () => {
    try {
      const res = await axios.get("https://teamdocs-backend.onrender.com/api/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setDocuments(res.data.documents);
      toast.success("Got all documents");
    } catch (error) {
      console.log("err", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  const deleteDocument = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      await axios.delete(`https://teamdocs-backend.onrender.com/api/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      toast.success("Document deleted successfully");
      setDocuments(documents.filter((doc) => doc._id !== id)); // update UI
    } catch (error) {
      console.log("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="w-full bg-amber-100 min-h-[calc(100vh-3.5rem)] pb-10">
      <div className="w-11/12 h-full m-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-x-1 cursor-pointer"
        >
          <FaLongArrowAltLeft />
          Back
        </button>
        <div className="flex justify-between items-center mt-10 border-b border-amber-300 p-3">
          <h2 className="text-2xl font-bold">Your Document</h2>
          <div className="flex justify-center items-center gap-x-5">
            <form className="flex justify-center items-center gap-x-2">
              <input
                type="text"
                value={searchInput}
                placeholder="search Documents..."
                onChange={(e) => setSearchInput(e.target.value)}
                className=" py-2 px-5 border border-amber-500 outline-none rounded"
              />
              <button
                type="submit"
                className="bg-amber-300 py-2 px-3 rounded-md"
              >
                search
              </button>
            </form>
            <Link
              to={"/document/create"}
              className="bg-green-400 flex justify-center items-center gap-x-1 w-fit py-2 px-3 rounded-md font-bold text-gray-100 text-xl"
            >
              <FaRegPenToSquare /> Create
            </Link>
          </div>
        </div>

        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="border p-4 rounded shadow hover:shadow-md transition"
              >
                <Link to={`/documents/${doc._id}`}>
                  <h2 className="text-xl font-semibold text-blue-700 hover:underline">
                    {doc.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-500">
                  Author: {doc.author?.name || "Unknown"} | Last updated:{" "}
                  {new Date(doc.updatedAt).toLocaleString()} |{" "}
                  {doc.visibility === "public" ? "🌐 Public" : "🔒 Private"}
                </p>
                <div className="mt-2">
                  <Link
                    to={`/edit/${doc._id}`}
                    className="text-sm text-blue-500 hover:underline mr-4"
                  >
                    ✏️ Edit
                  </Link>
                  <Link
                    to={`/documents/${doc._id}`}
                    className="text-sm text-green-600 hover:underline"
                  >
                    👁️ View
                  </Link>
                  <button
                    onClick={() => deleteDocument(doc._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
