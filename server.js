const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = 3000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML, CSS and JavaScript
// from the public folder
app.use(express.static(path.join(__dirname, "public")));


// ===============================
// MYSQL DATABASE CONNECTION
// ===============================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",

    // CHANGE THIS TO YOUR MYSQL PASSWORD
    password: "root",

    database: "student_db"
});


// Connect to MySQL
db.connect((err) => {

    if (err) {
        console.log("❌ MySQL connection failed!");
        console.log(err.message);
        return;
    }

    console.log("✅ Connected to MySQL database");
});


// ===============================
// GET - VIEW ALL STUDENTS
// ===============================

app.get("/api/students", (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch students"
            });
        }

        res.json(results);
    });
});


// ===============================
// POST - ADD STUDENT
// ===============================

app.post("/api/students", (req, res) => {

    const { name, email, course } = req.body;

    if (!name || !email || !course) {

        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO students (name, email, course)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, course],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Failed to add student"
                });
            }

            res.json({
                message: "Student added successfully",
                id: result.insertId
            });
        }
    );
});


// ===============================
// PUT - UPDATE STUDENT
// ===============================

app.put("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const { name, email, course } = req.body;

    if (!name || !email || !course) {

        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const sql = `
        UPDATE students
        SET name = ?, email = ?, course = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, course, id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Failed to update student"
                });
            }

            res.json({
                message: "Student updated successfully"
            });
        }
    );
});


// ===============================
// DELETE - DELETE STUDENT
// ===============================

app.delete("/api/students/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to delete student"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    });
});
app.listen(PORT, () => {

    console.log("");
    console.log("=================================");
    console.log(" Student CRUD Application");
    console.log("=================================");
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("");
});