<!-- src/views/UserEditView.vue -->
<template>
  <div class="content-container">
    <div class="content-card">
      <h2 class="page-title">แก้ไขข้อมูลผู้ใช้</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <!-- Username -->
          <div class="form-group">
            <label>ชื่อผู้ใช้</label>
            <input 
              type="text"
              v-model="form.username"
              required
            >
          </div>

          <!-- Password -->
          <div class="form-group">
            <label>รหัสผ่าน</label>
            <input 
              type="password"
              v-model="form.password"
              required
            >
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label>ยืนยันรหัสผ่าน</label>
            <input 
              type="password"
              v-model="form.confirmPassword"
              required
            >
          </div>

          <!-- Role -->
          <div class="form-group">
            <label>สิทธิเข้าถึง</label>
            <select v-model="form.role">
              <option value="teacher">คุณครู</option>
              <option value="admin">ผู้ดูแลระบบ</option>
            </select>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>อีเมล</label>
            <input 
              type="email"
              v-model="form.email"
              required
            >
          </div>

          <!-- First Name -->
          <div class="form-group">
            <label>ชื่อ</label>
            <input 
              type="text"
              v-model="form.first_name"
              required
            >
          </div>

          <!-- Last Name -->
          <div class="form-group">
            <label>นามสกุล</label>
            <input 
              type="text"
              v-model="form.last_name"
              required
            >
          </div>
        </div>

        <!-- Buttons -->
        <div class="button-group">
          <button
            type="button"
            @click="$router.push('/userManagement')"
            class="cancel-btn"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            class="submit-btn"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const userId = route.params.id

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  role: '',
  email: '',
  first_name: '',
  last_name: ''
})

// โหลดข้อมูลผู้ใช้
const loadUser = async () => {
  try {
    const token = localStorage.getItem('token')
    console.log('Loading user with token:', token) // debug log
    
    if (!token) {
      throw new Error('ไม่พบ Token กรุณาเข้าสู่ระบบใหม่')
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    console.log('Request config:', config) // debug log

    const response = await axios.get(`/api/users/${userId}`, config)
    console.log('Response:', response.data) // debug log
    
    form.value = response.data
  } catch (error) {
    console.error('Error loading user:', error)
    
    // เพิ่มการจัดการ error 401
    if (error.response?.status === 401) {
      console.log('Token invalid or expired') // debug log
      alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/landing.html'
    } else if (error.response?.status === 403) {
      alert('คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้')
    } else {
      alert('ไม่สามารถโหลดข้อมูลผู้ใช้ได้')
    }
  }
}

// บันทึกข้อมูล
const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token')
    console.log('Token for PUT:', token) // debug
    
    if (!token) {
      throw new Error('ไม่พบ Token กรุณาเข้าสู่ระบบใหม่')
    }

    const response = await axios.put(`/api/users/${userId}`, form.value, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.status === 200) {
      alert('อัพเดทข้อมูลสำเร็จ')
      router.push('/userManagement')
    }
  } catch (error) {
    console.error('Error updating user:', error)
    
    if (error.response?.status === 401) {
      alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/landing.html'
    } else if (error.response?.status === 403) {
      alert('คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้')
    } else {
      alert('ไม่สามารถอัพเดทข้อมูลได้')
    }
  }
}

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.content-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4a90e2;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  padding: 8px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #5a6268;
}

.submit-btn:hover {
  background: #357abd;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>