const Document = require("../models/Document");
const User = require("../models/User");

// Create Document
exports.createDocument = async (req, res) => {
  try {
    const { title, content, visibility } = req.body;

    // validate
    if (!title || !content || !visibility) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create doc
    const document = await Document.create({
      title,
      content,
      author: req.user._id,
      visibility,
    });

    return res.status(201).json({
      success: true,
      message: "Document created successfully",
      document,
    });
  } catch (error) {
    console.error("Error creating document:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create document",
    });
  }
};

// Get All Documents
exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user._id;

    // check Doc is present
    const documents = await Document.find({
      $or: [
        { author: userId },
        { "sharedWith.user": userId },
        { visibility: "public" },
      ],
    })
      .select("-versions")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "got the All Doc",
      documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(501).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};

// Get Document by ID
exports.getDocumentById = async (req, res) => {
  try {
    // check Doc is present or not
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const userId = req.user?._id;
    const isOwner = doc.author.equals(userId);
    const isShared = doc.sharedWith.find((entry) => entry.user.equals(userId));
    const isPublic = doc.visibility === "public";

    if (!isOwner && !isShared && !isPublic)
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });

    return res.status(200).json({
      success: true,
      message: "got the single Doc",
      doc,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return res.status(501).json({
      success: false,
      message: "something went wrong while Fetching single Doc",
    });
  }
};

// Update Document
exports.updateDocument = async (req, res) => {
  try {
    const { title, content, visibility } = req.body;
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const isOwner = doc.author.equals(req.user._id);
    const isEditor = doc.sharedWith.some(
      (entry) => entry.user.equals(req.user._id) && entry.permission === "edit"
    );

    if (!isOwner && !isEditor)
      return res.status(403).json({
        success: false,
        message: "Edit access denied",
      });

    // Save version before update
    doc.versions.push({
      content: doc.content,
      modifiedAt: new Date(),
      modifiedBy: req.user._id,
    });

    doc.title = title || doc.title;
    doc.content = content || doc.content;
    doc.visibility = visibility || doc.visibility;

    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      document: doc,
    });
  } catch (error) {
    console.error("Error updating document:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update document",
    });
  }
};

// Delete Document
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (!doc.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can delete the document",
      });
    }

    await doc.deleteOne({ _id: doc._id });;

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
    });
  }
};

exports.searchDocuments = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user._id;

    const docs = await Document.find({
      $and: [
        {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } },
          ],
        },
        {
          $or: [
            { author: userId },
            { "sharedWith.user": userId },
            { visibility: "public" },
          ],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      results: docs,
    });
  } catch (error) {
    console.error("Error searching documents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search documents",
    });
  }
};

// Share Document with User
exports.shareDocument = async (req, res) => {
  try {
    const { userEmail, permission } = req.body;
    const { id } = req.params;

    // Validate input
    if (!userEmail || !permission) {
      return res.status(400).json({
        success: false,
        message: "Email and permission are required",
      });
    }

    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Only owner can share
    if (!doc.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can share this document",
      });
    }

    const userToShare = await User.findOne({ email: userEmail });
    if (!userToShare) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided email",
      });
    }

    const existingShare = doc.sharedWith.find((s) =>
      s.user.equals(userToShare._id)
    );

    if (existingShare) {
      existingShare.permission = permission; // update permission
    } else {
      doc.sharedWith.push({ user: userToShare._id, permission });
    }

    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Document shared successfully",
      sharedWith: doc.sharedWith,
    });
  } catch (error) {
    console.error("Error sharing document:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to share document",
    });
  }
};

// Auto-share Document on @username Mention
exports.autoShareOnMention = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (!doc.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can trigger auto-share",
      });
    }

    const mentionedUsernames = Array.from(
      new Set(content.match(/@(\w+)/g)?.map((u) => u.slice(1)))
    );

    for (const username of mentionedUsernames) {
      const user = await User.findOne({ name: username });

      if (user && !doc.sharedWith.some((s) => s.user.equals(user._id))) {
        doc.sharedWith.push({ user: user._id, permission: "view" });
      }
    }

    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Auto-share complete",
      sharedWith: doc.sharedWith,
    });
  } catch (error) {
    console.error("Error in auto-share:", error);
    return res.status(500).json({
      success: false,
      message: "Auto-share failed",
    });
  }
};

// Get All Versions of a Document
exports.getVersions = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate(
      "versions.modifiedBy",
      "name email"
    );

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Access control: Only owner or shared user can view versions
    const hasAccess =
      doc.author.equals(req.user._id) ||
      doc.sharedWith.some((s) => s.user.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      versions: doc.versions,
    });
  } catch (error) {
    console.error("Error fetching versions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch versions",
    });
  }
};

// Restore a Previous Version
exports.restoreVersion = async (req, res) => {
  try {
    const { versionIndex } = req.body;

    if (typeof versionIndex !== "number") {
      return res.status(400).json({
        success: false,
        message: "versionIndex must be a valid number",
      });
    }

    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Only the author can restore versions
    if (!doc.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the author can restore versions",
      });
    }

    const version = doc.versions[versionIndex];
    if (!version) {
      return res.status(404).json({
        success: false,
        message: "Version not found",
      });
    }

    // Backup current content to version history
    doc.versions.push({
      content: doc.content,
      modifiedAt: new Date(),
      modifiedBy: req.user._id,
    });

    doc.content = version.content;
    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Version restored successfully",
      content: doc.content,
    });
  } catch (error) {
    console.error("Error restoring version:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to restore version",
    });
  }
};
