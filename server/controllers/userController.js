import pool from '../config/database.js'
import bcrypt from 'bcrypt'

// ดึงข้อมูลผู้ใช้ทั้งหมด
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT user_id, username, first_name, last_name, email, role FROM users'
    )
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' })
  }
}
// ดึงข้อมูล user รายบุคคล
const getUserById = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT user_id, username, email, first_name, last_name, role FROM users WHERE user_id = ?', 
      [req.params.id]
    )
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' })
    }

    res.json(users[0])
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' })
  }
}
// เพิ่มผู้ใช้ใหม่
const createUser = async (req, res) => {
  try {
    const { username, password, first_name, last_name, email } = req.body
    const role = 'teacher'
    
    // เช็คว่า username ซ้ำหรือไม่
    const [existingUser] = await pool.query(
      'SELECT username FROM users WHERE username = ?',
      [username]
    )
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username นี้มีผู้ใช้งานแล้ว' })
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10)

    // เพิ่มผู้ใช้ใหม่
    const [result] = await pool.query(
      'INSERT INTO users (username, password, role, first_name, last_name, email) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, role, first_name, last_name, email]
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
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้' })
  }
}

// แก้ไขข้อมูลผู้ใช้
const updateUser = async (req, res) => {
  try {
    const { username, password, role, first_name, last_name, email } = req.body
    const userId = req.params.id

    // เช็คว่ามีการเปลี่ยน username และซ้ำกับคนอื่นหรือไม่
    if (username) {
      const [existingUser] = await pool.query(
        'SELECT username FROM users WHERE username = ? AND user_id != ?',
        [username, userId]
      )
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'Username นี้มีผู้ใช้งานแล้ว' })
      }
    }

    let updateQuery = 'UPDATE users SET '
    const updateValues = []
    const updates = []

    if (username) {
      updates.push('username = ?')
      updateValues.push(username)
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updates.push('password = ?')
      updateValues.push(hashedPassword)
    }
    if (role) {
      updates.push('role = ?')
      updateValues.push(role)
    }
    if (first_name) {
      updates.push('first_name = ?')
      updateValues.push(first_name)
    }
    if (last_name) {
      updates.push('last_name = ?')
      updateValues.push(last_name)
    }
    if (email) {
      updates.push('email = ?')
      updateValues.push(email)
    }

    updateQuery += updates.join(', ') + ' WHERE user_id = ?'
    updateValues.push(userId)

    const [result] = await pool.query(updateQuery, updateValues)
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' })
    }

    res.json({ message: 'อัพเดทข้อมูลสำเร็จ' })
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้' })
  }
}

// ลบผู้ใช้
const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM users WHERE user_id = ?',
      [req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' })
    }
    res.json({ message: 'ลบผู้ใช้สำเร็จ' })
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบผู้ใช้' })
  }
}

const getUserProfile = async (req, res) => {
  try {
    console.log('User from token:', req.user)
    
    const [users] = await pool.query(
      'SELECT user_id, username, email, first_name, last_name, role FROM users WHERE user_id = ?', 
      [req.user.user_id]
    )
    
    console.log('Query result:', users)
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' })
    }

    res.json(users[0])
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' })
  }
}

// export ทั้งหมดรวมกันที่ท้ายไฟล์
export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile
} 