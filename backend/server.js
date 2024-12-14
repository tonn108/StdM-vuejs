const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

// API สำหรับจัดการข้อมูลนักเรียน
app.get('/api/students', (req, res) => {
  connection.query('SELECT * FROM student', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(results)
  })
})

app.get('/api/students/stats', (req, res) => {
    connection.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN student_gender = 'ชาย' THEN 1 ELSE 0 END) as male,
        SUM(CASE WHEN student_gender = 'หญิง' THEN 1 ELSE 0 END) as female
      FROM student`,
      (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message })
          return
        }
        res.json(results[0])
      }
    )
  })

app.post('/api/students', (req, res) => {
  const { 
    student_code, 
    student_name, 
    student_lastname,
    student_class,
    student_room,
    student_gender,
    student_grade 
  } = req.body

  connection.query(
    `INSERT INTO student (
      student_code, student_name, student_lastname, 
      student_class, student_room, student_gender, student_grade
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      student_code, student_name, student_lastname,
      student_class, student_room, student_gender, student_grade
    ],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.status(201).json({ 
        idstudent: results.insertId,
        student_code,
        student_name,
        student_lastname,
        student_class,
        student_room,
        student_gender,
        student_grade
      })
    }
  )
})

app.put('/api/students/:id', (req, res) => {
  const { id } = req.params
  const { student_name, student_lastname, student_class, student_room, student_gender, student_grade } = req.body

  connection.query(
    `UPDATE student SET 
      student_name = ?, student_lastname = ?, student_class = ?, 
      student_room = ?, student_gender = ?, student_grade = ? 
    WHERE idstudent = ?`,
    [student_name, student_lastname, student_class, student_room, student_gender, student_grade, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.json({ 
        idstudent: results.updateId,
        student_name,
        student_lastname,
        student_class,
        student_room,
        student_gender,
        student_grade
      })
    }
  )
})

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params
  connection.query('DELETE FROM student WHERE idstudent = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Student deleted successfully' })
  })
})

// API สำหรับ login
app.post('/api/login', (req, res) => {
  const { user_name, user_password } = req.body
  
  connection.query(
    'SELECT * FROM users WHERE user_name = ? AND user_password = ?',
    [user_name, user_password],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      if (results.length > 0) {
        const user = results[0]
        res.json({
          idusers: user.idusers,
          user_name: user.user_name,
          user_role: user.user_role,
          users_token: user.users_token
        })
      } else {
        res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
      }
    }
  )
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 