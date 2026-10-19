const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const fields = [
  "name",
  "category",
  "description",
  "meeting_day",
  "president",
  "contact_email"
];

function validClub(body) {
  return fields.every(
    f => typeof body[f] === "string" && body[f].trim() !== ""
  );
}

// API health check
app.get("/api", (req, res) => {
  res.json({ message: "Campus Club API is running" });
});

// GET all clubs
app.get("/api/clubs", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clubs ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch clubs" });
  }
});

// GET one club
app.get("/api/clubs/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM clubs WHERE id = ?", [
      req.params.id
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Club not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch club" });
  }
});

// POST create a club
app.post("/api/clubs", async (req, res) => {
  if (!validClub(req.body)) {
    return res.status(400).json({ error: "All club fields are required" });
  }
  try {
    const values = fields.map(f => req.body[f].trim());
    const [result] = await pool.execute(
      `INSERT INTO clubs (${fields.join(", ")}) VALUES (?, ?, ?, ?, ?, ?)`,
      values
    );
    const [rows] = await pool.execute("SELECT * FROM clubs WHERE id = ?", [
      result.insertId
    ]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create club" });
  }
});

// PUT update a club
app.put("/api/clubs/:id", async (req, res) => {
  if (!validClub(req.body)) {
    return res.status(400).json({ error: "All club fields are required" });
  }
  try {
    const values = fields.map(f => req.body[f].trim());
    await pool.execute(
      `UPDATE clubs SET ${fields.map(f => `${f} = ?`).join(", ")} WHERE id = ?`,
      [...values, req.params.id]
    );
    const [rows] = await pool.execute("SELECT * FROM clubs WHERE id = ?", [
      req.params.id
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Club not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update club" });
  }
});

// DELETE a club
app.delete("/api/clubs/:id", async (req, res) => {
  try {
    const [result] = await pool.execute("DELETE FROM clubs WHERE id = ?", [
      req.params.id
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Club not found" });
    }
    res.json({
      message: "Club deleted successfully",
      id: Number(req.params.id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete club" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});