const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  searchDocuments,
  shareDocument,
  autoShareOnMention,
  getVersions,
  restoreVersion,
} = require("../controllers/documentController");

router.post("/", protect, createDocument);
router.get("/", protect, getDocuments);
router.get("/search", protect, searchDocuments);
router.get("/:id", protect, getDocumentById);
router.put("/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);
router.put("/:id/share", protect, shareDocument);
router.put("/:id/mention-auto-share", protect, autoShareOnMention);
router.get("/:id/versions", protect, getVersions);
router.put("/:id/versions/restore", protect, restoreVersion);

module.exports = router;
