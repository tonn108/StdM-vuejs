<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const users = ref([])
const loading = ref(true)
const showAddModal = ref(false)
const router = useRouter()

// ข้อมูลสำหรับฟอร์มเพิ่ม/แก้ไขผู้ใช้
const formData = ref({
  username: '',
  password: '',
  role: '',
  first_name: '',
  last_name: '',
  email: ''
})

// ดึงข้อมูลผู้ใช้ทั้งหมด
const fetchUsers = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    
    const response = await axios.get('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    error.value = 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้'
  } finally {
    loading.value = false
  }
}

// เพิ่มผู้ใช้ใหม่
const addUser = async () => {
  try {
    await axios.post('http://localhost:3000/api/users', formData.value)
    await fetchUsers()
    showAddModal.value = false
    resetForm()
  } catch (error) {
    console.error('Error adding user:', error)
  }
}

const editUser = (user) => {
    console.log('Editing user:', user)
    router.push(`/userEdit/${user.user_id}/edit`)
}
// ลบผู้ใช้
const deleteUser = async (userId) => {
  if (confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`)
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

// รีเซ็ตฟอร์ม
const resetForm = () => {
  formData.value = {
    username: '',
    password: '',
    role: '',
    first_name: '',
    last_name: '',
    email: ''
  }
}

const getRoleText = (role) => {
  const roleMap = {
    'admin': 'ผู้ดูแลระบบ',
    'teacher': 'ครู'
  }
  return roleMap[role] || role
}

const getRoleClass = (role) => {
  return `role-badge role-${role}`
}

onMounted(fetchUsers)
</script>

<template>
  <div class="user-management">
    <div class="header-section">
      <h1 class="text-3xl font-bold">
        <i class="fas fa-users"></i> จัดการผู้ใช้งาน
      </h1>
      <button @click="showAddModal = true" class="add-btn">
        <i class="fas fa-plus"></i> เพิ่มผู้ใช้
      </button>
    </div>

    <!-- ตารางแสดงผู้ใช้ -->
    <div class="table-container" v-if="!loading">
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>ชื่อ</th>
            <th>นามสกุล</th>
            <th>อีเมล</th>
            <th>บทบาท</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.user_id">
            <td>{{ user.username }}</td>
            <td>{{ user.first_name }}</td>
            <td>{{ user.last_name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="getRoleClass(user.role)">{{ getRoleText(user.role) }}</span>
            </td>
            <td class="actions">
              <button @click="editUser(user)" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteUser(user.user_id)" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal เพิ่มผู้ใช้ -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>เพิ่มผู้ใช้ใหม่</h2>
        <form @submit.prevent="addUser">
          <div class="form-group">
            <label>Username:</label>
            <input v-model="formData.username" required>
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input type="password" v-model="formData.password" required>
          </div>
          <div class="form-group">
            <label>บทบาท:</label>
            <select v-model="formData.role" required>
              <option value="admin">ผู้ดูแลระบบ</option>
              <option value="teacher">ครู</option>
            </select>
          </div>
          <div class="form-group">
            <label>ชื่อ:</label>
            <input v-model="formData.first_name" required>
          </div>
          <div class="form-group">
            <label>นามสกุล:</label>
            <input v-model="formData.last_name" required>
          </div>
          <div class="form-group">
            <label>อีเมล:</label>
            <input type="email" v-model="formData.email" required>
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-btn">บันทึก</button>
            <button type="button" @click="showAddModal = false" class="cancel-btn">ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-management {
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-btn {
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn, .delete-btn {
  padding: 6px;
  border-radius: 4px;
}

.edit-btn {
  background: #2196F3;
  color: white;
}

.delete-btn {
  background: #F44336;
  color: white;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}

.cancel-btn {
  background: #9e9e9e;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}

/* Role badges */
.role-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.role-admin {
  background: #e3f2fd;
  color: #1976d2;
}

.role-teacher {
  background: #e8f5e9;
  color: #388e3c;
}
</style>
