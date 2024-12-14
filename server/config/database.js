import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

console.log('Database Config:', {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE
})

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully')
    connection.release()
  })
  .catch(err => {
    console.error('Error connecting to the database:', err)
  })

export default pool 