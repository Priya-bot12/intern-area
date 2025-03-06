const express = require("express");
const router = express.Router();
const Job = require("../Model/Jobs");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/logos");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

// Updated POST route with file upload
router.post("/", upload.single("logo"), async (req, res) => {
  try {
      const jobData = {
          ...req.body,
          Experience: req.body.experience,
          StartDate: req.body.startDate,
          logo: req.file ? req.file.path : null,
          perks: req.body.perks.split(','), // Convert to array
          Whocanapply: req.body.whoCanApply // Match model field name
      };

      const savedJob = await Job.create(jobData);
      res.status(201).json(savedJob);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to post Job" });
  }
});

// GET: Retrieve all jobs
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET: Retrieve a single job by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json(job);
    } catch (error) {
        console.error("Error fetching job by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
