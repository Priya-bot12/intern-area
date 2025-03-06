const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const adminUsername = "admin";
const adminPasswordHash = bcrypt.hashSync("admin", 10); // Hashing the password

// Admin login
router.post("/adminLogin", (req, res) => {
    const { username, password } = req.body;

    if (username === adminUsername && bcrypt.compareSync(password, adminPasswordHash)) {
        res.send("Admin is here");
    } else {
        res.status(401).send("Unauthorized");
    }
});

module.exports = router;
