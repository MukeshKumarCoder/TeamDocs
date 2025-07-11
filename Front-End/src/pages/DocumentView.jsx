import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const DocumentView = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.user);

  const fetchDocument = async () => {
    try {
      const res = await axios.get(`https://teamdocs-backend.onrender.com/api/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setDoc(res.data);
    } catch (error) {
      toast.error("something went wrong");
      console.error("Error fetching document", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!doc) return <p className="p-4 text-red-500">Document not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{doc.doc.title}</h1>

      <div
        className="whitespace-pre-wrap leading-relaxed text-gray-800 border rounded p-4 bg-white"
        // render raw HTML if content includes tags
        dangerouslySetInnerHTML={{ __html: doc.doc.content }}
      ></div>

      <p className="text-sm text-gray-500 mt-4">
        Last updated: {new Date(doc.doc.updatedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default DocumentView;
