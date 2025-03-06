const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    duration: String,
    category: String,
    aboutCompany: String,
    aboutInternship: String,
    Whocanapply: String,
    perks: [String],
    AdditionalInfo: String,
    stipend: String,
    StartDate: String,
    numberOfOpening: Number,
    logo: String,
    createAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Internship", InternshipSchema);