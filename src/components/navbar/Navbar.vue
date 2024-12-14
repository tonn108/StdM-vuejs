<script setup>
import { inject, ref, onMounted } from 'vue'
import axios from 'axios'

const isCollapsed = inject('sidebarState')
const user = ref(null)

const toggleSidebar = () => {
  console.log('Toggling sidebar:', !isCollapsed.value)
  isCollapsed.value = !isCollapsed.value
}

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    // ใส่ token ใน header
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }

    // ดึงข้อมูล user จาก API
    const response = await axios.get('/api/users/profile', config)
    user.value = response.data
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

onMounted(() => {
  fetchUserData()
})
</script>

<template>
  <nav class="navbar">
    <div class="toggle-btn" @click="toggleSidebar">
      <i class="fas fa-bars"></i>
    </div>

    <div class="logo">
      <i class="fas fa-user-graduate"></i>
      <span>Student Management</span>
    </div>

    <div class="user-info">
      <span v-if="user">{{ user.first_name }} {{ user.last_name }}</span>
      <span v-else>กำลังโหลด...</span>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  grid-area: navbar;
  background: linear-gradient(to right, #4776e6, #8e54e9);
  height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: bold;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-items i:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.menu {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.menu:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
