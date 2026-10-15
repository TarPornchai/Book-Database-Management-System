const express = require('express');
const sql = require('mssql');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware สำหรับรับ JSON
app.use(express.json());

// เชื่อมต่อฐานข้อมูล
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  server: process.env.DB_SERVER,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

sql.connect(config)
  .then(() => console.log("✅ SQL Server Connected"))
  .catch(err => {
    console.error("❌ SQL Connection Error:", err.message);
    process.exit(1);
  });

/* 📚 ROUTES */

// GET: ดูหนังสือทั้งหมด
app.get('/books', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Books`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("❌ " + err.message);
  }
});

// POST: เพิ่มหนังสือ
app.post('/books', async (req, res) => {
  const { title, quantity } = req.body;
  try {
    await sql.query`INSERT INTO Books (Title, Quantity) VALUES (${title}, ${quantity})`;
    res.status(201).send("✅ Book inserted");
  } catch (err) {
    res.status(500).send("❌ " + err.message);
  }
});

// PUT: แก้ไขหนังสือ
app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, quantity } = req.body;
  try {
    await sql.query`UPDATE Books SET Title=${title}, Quantity=${quantity} WHERE BookID=${id}`;
    res.send("✅ Book updated");
  } catch (err) {
    res.status(500).send("❌ " + err.message);
  }
});

// DELETE: ลบหนังสือ
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query`DELETE FROM Books WHERE BookID=${id}`;
    res.send("✅ Book deleted");
  } catch (err) {
    res.status(500).send("❌ " + err.message);
  }
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`🚀 API Server is running at http://localhost:${port}`);
});