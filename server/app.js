import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import userRoutes from './routes/userRoutes.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { login, register } from './controllers/authController.js'



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

// Log middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`)
  next()
})

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/landing.html'))
})

// Database connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

// Student Routes
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

// User Routes
app.use('/api/users', userRoutes)

// Auth Routes
app.post('/api/login', login)
app.post('/api/register', register)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app