const express =require("express")
const router= express.Router();
const Application=require("../Model/Application")
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/resumes/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  const upload = multer({ storage });

  router.post('/', upload.single('resume'), async (req, res) => {
    try {
      const userData = JSON.parse(req.body.user);
      
      const application = new Application({
        company: req.body.company,
        category: req.body.category,
        coverLetter: req.body.coverLetter,
        applicationId: req.body.applicationId,
        availability: req.body.availability,
        resumePath: req.file?.path,
        user: {
          _id: userData.uid,
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          resume: userData.resume
        }
      });
  
      await application.save();
      res.status(201).send(application);
    } catch (error) {
      console.error("Detailed error:", error);
      res.status(400).json({
        error: "Application submission failed",
        message: error.message
      });
    }
  });
  

router.get("/", async (req,res)=>{
    try {
        const data=await Application.find();
        res.json(data) .status(200)
    } catch (error) {
        res.status(404).json({error:"Internal server error "})
    }
})
router.get("/:id", async (req,res)=>{
    const {id}=req.params;
    try {
        const data=await Application.findById(id);
        if (!data) {

             res.status(404).json({error:"Application is not found "})
        }
        res.json(data) .status(200)
    } catch (error) {
        console.log(error);
        res.status(404).json({error:"Internal server error "})
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;

    let status;

    if (action === "accepted") {
        status = "accepted";
    } else if (action === "rejected") {
        status = "rejected";
    } else {
        res.status(400).json({ error: "Invalid action" });
        return; 
    }

    try {
        const updateApplication = await Application.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        );

        if (!updateApplication) {
            res.status(404).json({ error: "Not able to update the application" });
            return; 
        }

        res.status(200).json({ success: true, data: updateApplication });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports=router