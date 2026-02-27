// src/routes/imageRoutes.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("../lib/cloudinary");
const { authenticate, authorize } = require("../middleware/auth"); // you’ll need to implement or reuse JWT auth

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp local storage

router.post(
  "/upload",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "properties",
      });
      res.json({ url: result.secure_url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Image upload failed" });
    }
  }
);

module.exports = router;