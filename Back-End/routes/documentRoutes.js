const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
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

router.post("/create", protect, createDocument);
router.get("/", protect, getDocuments);
router.get("/:id", protect, getDocumentById);
router.put("/edit/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);
router.get("/search", protect, searchDocuments);
router.put("/:id/share", protect, shareDocument);
router.put("/:id/mention-auto-share", protect, autoShareOnMention);
router.get("/:id/versions", protect, getVersions);
router.put("/:id/versions/restore", protect, restoreVersion);

module.exports = router;
