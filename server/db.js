const mongoose = require("mongoose");
require("dotenv").config();

const DATABASE = process.env.DATABASEURL;
const url = DATABASE;

module.exports.connect = () => {
    mongoose
        .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("✅ Database is connected"))
        .catch((err) => console.error("❌ Database connection error:", err));
};
