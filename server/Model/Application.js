const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    company: String,
    category: String,
    coverLetter: String,
    body: String,
    applicationId: String,
    resumePath: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        _id: String,
        fullName: String,
        email: String,
        phoneNumber: String,
        resume: Object // Add this to store profile resume data
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
});

module.exports = mongoose.model("Application", applicationSchema);
