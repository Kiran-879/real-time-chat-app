const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecretkey";

// REGISTER
router.post("/register", async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send("User registered");
        }
    );
});


// LOGIN API
router.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Database Error");
        }

        // User not found
        if (result.length === 0) {
            return res.status(400).send("User not found");
        }

        const user = result[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Wrong password");
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login Successful",
            token: token
        });

    });
});




module.exports = router;