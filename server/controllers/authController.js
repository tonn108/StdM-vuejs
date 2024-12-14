import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/database.js'

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    
    // ตรวจสอบ username
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if (users.length === 0) {
      return res.status(401).json({ message: 'ไม่พบผู้ใช้งาน' })
    }

    // ตรวจสอบ password
    const user = users[0]
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' })
    }

    // สร้าง token
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' })
  }
}

export const register = async (req, res) => {
  try {
    const { username, password, first_name, last_name, email } = req.body
    const role = 'teacher'
    
    console.log('Received data:', req.body)
    
    // ตรวจสอบว่ามี username ซ้ำหรือไม่
    const [existingUser] = await pool.query(
      'SELECT username FROM users WHERE username = ?',
      [username]
    )
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username นี้มีผู้ใช้งานแล้ว' })
    }

    // เข้ารหัส password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // เพิ่มผู้ใช้ใหม่
    const [result] = await pool.query(
      'INSERT INTO users (username, password, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, first_name, last_name, email, role]
    )

    res.status(201).json({
      user_id: result.insertId,
      username,
      role,
      first_name,
      last_name,
      email
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก', 
      error: error.message 
    })
  }
}