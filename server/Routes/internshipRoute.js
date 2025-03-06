const express = require("express");
const router = express.Router();
const Internship = require("../Model/Internship"); // Fix capitalization
const multer = require("multer");
const path = require("path");

// Configure Multer for file upload
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

// **Create the Multer instance here**
const upload = multer({ storage: storage });

// ✅ POST Internship with file upload
router.post("/", upload.single("logo"), async (req, res) => {
    try {
        const internshipData = {
            ...req.body,
            StartDate: req.body.startDate,
            logo: req.file ? req.file.path : null,
            numberOfOpening: parseInt(req.body.numberOfOpening)
        };

        const savedInternship = await Internship.create(internshipData);
        res.status(201).json(savedInternship);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to post internship" });
    }
});

// ✅ GET All Internships
router.get("/", async (req, res) => {
    try {
        const data = await Internship.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ GET Internship by ID
router.get("/:id", async (req, res) => {
    try {
        const data = await Internship.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ error: "Internship not found" });
        }
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
