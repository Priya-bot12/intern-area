const express =require("express");
const router= express.Router();
const Application=require("./ApplicationRoute")
const intern=require("./internshipRoute")
const job=require("./jobRoute")
const admin=require("./admin")
const Chatbot = require("./ChatbotRoute");
const otpsent = require("./send-otp")





router.get("/",(req,res)=>{
    res.send("the is backend")
})
router.use('/application',Application);
router.use('/internship',intern);
router.use('/job',job);
router.use('/admin',admin);
router.use("/chatbot", Chatbot);
router.use("/send-otp",otpsent)


module.exports=router;