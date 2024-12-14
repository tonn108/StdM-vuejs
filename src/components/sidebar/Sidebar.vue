<script setup>
import { inject, ref, onMounted } from 'vue'

const isCollapsed = inject('sidebarState')
const userRole = ref(null)

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  userRole.value = user?.role
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/landing.html'
}
</script>

<template>
  <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <router-link to="/" class="menu-item">
      <i class="fas fa-home"></i>
      <span>หน้าหลัก</span>
    </router-link>
    <router-link to="/Allstudent" class="menu-item">
      <i class="fa-solid fa-users"></i>
      <span>ข้อมูลนักเรียนทั้งหมด</span>
    </router-link>
    <router-link to="/addStudent" class="menu-item">
      <i class="fas fa-plus"></i>
      <span>เพิ่มข้อมูลนักเรียน</span>
    </router-link>
    <router-link to="" class="menu-item">
      <i class="fas fa-book"></i>
      <span>วิชาเรียน</span>
    </router-link>
    <router-link to="" class="menu-item">
      <i class="fas fa-calendar-alt"></i>
      <span>ตารางเรียน</span>
    </router-link>
    <router-link to="" class="menu-item">
      <i class="fas fa-chart-bar"></i>
      <span>ผลการเรียน</span>
    </router-link>
    <router-link to="" class="menu-item">
      <i class="fas fa-tasks"></i>
      <span>การบ้าน</span>
    </router-link>
    <router-link 
      v-if="userRole === 'admin'" 
      to="/userManagement" 
      class="menu-item"
    >
      <i class="fas fa-user"></i>
      <span>จัดการผู้ใช้งาน</span>
    </router-link>

    <div @click="handleLogout" class="side-footer" style="cursor: pointer;">
      <i class="fas fa-sign-out-alt"></i>
      <span>ออกจากระบบ</span>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  grid-area: sidebar;
  width: 250px;
  background-color: #f8f9fa;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
}

.menu-item {
  padding: 15px 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #555;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #e9ecef;
  color: #4776e6;
  padding-left: 30px;
}

.menu-item i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }

  .menu-item span {
    display: none;
  }

  .menu-item {
    justify-content: center;
    padding: 15px 0;
  }
}

.side-footer {
  position: absolute;
  bottom: 0;
  width: 197px;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #555;
  cursor: pointer;
  transition: all 0.3s ease;
}

.side-footer:hover {
  background-color: #e9ecef;
  color: #4776e6;
  padding-left: 30px;
}

.collapsed {
  width: 60px !important;
}

.collapsed .menu-item {
  padding: 15px 0;
  justify-content: center;
}

.collapsed span {
  display: none;
}

.collapsed .side-footer {
  width: 60px;
  padding: 15px 0;
  justify-content: center;
}

.collapsed .side-footer span {
  display: none;
}
</style>
