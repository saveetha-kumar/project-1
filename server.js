const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "june@123",
    database: "artacademy"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Error:", err);
        return;
    }
    console.log("Connected to MySQL");
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "saveethakumar216@gmail.com",
        pass: "mtcfbwvhoixgijbl"
    }
});

// Register API
app.post("/register", (req, res) => {

    console.log("DATA RECEIVED:", req.body);

    const { name, age, gender, email } = req.body;

    const sql = "INSERT INTO students (name, age, gender, email) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, age, gender, email], (err, result) => {

        if (err) {
            console.log("Database Error:", err);
            return res.send("Error inserting data");
        }

        // Email
        const mailOptions = {
            from: "saveethakumar216@gmail.com",
            to: email,
            subject: "Registration Successful - Art Illusion Academy",
            text:
`Hello ${name},

Thank you for registering with Art Illusion Academy.

Your registration has been successfully completed.

We are excited to have you with us!

Regards,
Art Illusion Academy`
        };

        transporter.sendMail(mailOptions, (error, info) => {

            if (error) {
                console.log("Email Error:", error);
                return res.send("Data saved, but email not sent.");
            }

            console.log("Email Sent:", info.response);
            res.send("Registration Successful! Confirmation email sent.");
        });

    });

});

// Server
app.listen(3000, () => {
    console.log("Server Running on http://localhost:3000");
});