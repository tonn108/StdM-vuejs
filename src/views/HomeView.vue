<script setup>
import { ref, onMounted, computed } from 'vue'
import { studentAPI } from '../services/api'

// สร้างตัวแปรเก็บข้อมูลนักเรียน
const students = ref([])
const loading = ref(true)

// ดึงข้อมูลนักเรียน
const fetchStudents = async () => {
  try {
    loading.value = true
    const response = await studentAPI.getAll()
    students.value = response.data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

// คำนวณสถิติ
const stats = ref({
  total: 0,
  male: 0,
  female: 0
})

const fetchStats = async () => {
  try {
    const response = await studentAPI.getStats()
    stats.value = response.data
  } catch (error) {
    console.error('Error:', error)
  }
}

// เรียงข้อมูลและแสดงแค่ 10 แถวแรก
const topStudents = computed(() => {
  return [...students.value]
    .sort((a, b) => parseFloat(b.student_grade) - parseFloat(a.student_grade))
    .slice(0, 10)
})

// ฟังก์ชันสำหรับสีของเกรด
const getGradeClass = (grade) => {
  const numGrade = parseFloat(grade)
  if (numGrade >= 3.5) return 'text-green-600'
  if (numGrade >= 3.0) return 'text-blue-600'
  if (numGrade >= 2.0) return 'text-yellow-600'
  return 'text-red-600'
}

// ลบนักเรียน
const deleteStudent = async (id) => {
  if (confirm('คุณต้องการลบข้อมูลนักเรียนใช่หรือไม่?')) {
    try {
      await studentAPI.delete(id)
      await fetchStudents() // รีโหลดข้อมูลหลังลบ
    } catch (error) {
      console.error('Error:', error)
    }
  }
}

onMounted(() => {
  fetchStats()
  fetchStudents()
})
</script>

<template>
  <div class="welcome-container">
    <!-- ส่วนหัว -->
    <div class="header">
      <h1><i class="fas fa-graduation-cap"></i> ระบบจัดการข้อมูลนักเรียน</h1>
      <p>ยินดีต้อนรับสู่ระบบจัดการข้อมูลนักเรียน</p>
    </div>

    <!-- ส่วนแสดงสถิติ -->
    <div class="stats-container">
      <div class="stat-card">
        <i class="fas fa-users"></i>
        <h3>จำนวนนักเรียนทั้งหมด</h3>
        <p>{{ stats.total }} คน</p>
      </div>
      <div class="stat-card">
        <i class="fas fa-male"></i>
        <h3>นักเรียนชาย</h3>
        <p>{{ stats.male }} คน</p>
      </div>
      <div class="stat-card">
        <i class="fas fa-female"></i>
        <h3>นักเรียนหญิง</h3>
        <p>{{ stats.female }} คน</p>
      </div>
    </div>

    <!-- ตารางแสดงข้อมูลนักเรียน -->
    <div class="table-container">
      <div class="table-header">
        <h2>รายชื่อนักเรียน (10 อันดับแรก)</h2>
        <div class="header-buttons">
          <router-link to="/allStudent" class="view-all-btn">
            <i class="fas fa-list"></i> ดูทั้งหมด
          </router-link>
          <router-link to="/addStudent" class="add-btn">
            <i class="fas fa-plus"></i> เพิ่มนักเรียน
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>กำลังโหล��ข้อมูล...</p>
      </div>
      
      <table v-else>
        <thead>
          <tr>
            <th>รหัสนักเรียน</th>
            <th>ชื่อ-นามสกุล</th>
            <th>ชั้น/ห้อง</th>
            <th>เพศ</th>
            <th>เกรดเฉลี่ย</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in topStudents" :key="student.idstudent"
              class="hover:bg-gray-50 transition-colors">
            <td>{{ student.student_code }}</td>
            <td>{{ student.student_name }} {{ student.student_lastname }}</td>
            <td>{{ student.student_class }}/{{ student.student_room }}</td>
            <td>
              <span :class="student.student_gender === 'ชาย' ? 'male-badge' : 'female-badge'">
                {{ student.student_gender }}
              </span>
            </td>
            <td>
              <span :class="getGradeClass(student.student_grade)">
                {{ student.student_grade }}
              </span>
            </td>
            <td class="actions">
              <router-link :to="`/edit-student/${student.idstudent}`" class="edit-btn">
                <i class="fas fa-edit"></i>
              </router-link>
              <button class="delete-btn" @click="deleteStudent(student.idstudent)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card i {
  font-size: 2em;
  color: #4776E6;
  margin-bottom: 10px;
}

.table-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.view-all-btn {
  background: #2196f3;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background: #1976d2;
}

.male-badge, .female-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
}

.male-badge {
  background: #e3f2fd;
  color: #1976d2;
}

.female-badge {
  background: #fce4ec;
  color: #c2185b;
}

.loading-state {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4776E6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  background-color: #f8f9fa;
  color: #2c3e50;
}

.add-btn {
  background: #4776E6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-btn:hover {
  background: #3461c1;
}

.edit-btn, .delete-btn {
  padding: 5px 10px;
  margin: 0 5px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.edit-btn, .delete-btn {
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #4caf50;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.edit-btn:hover, .delete-btn:hover {
  transform: translateY(-1px);
  filter: brightness(110%);
}

/* สีของเกรด */
.text-green-600 {
  color: #059669;
  font-weight: bold;
}

.text-blue-600 {
  color: #2563eb;
  font-weight: bold;
}

.text-yellow-600 {
  color: #d97706;
  font-weight: bold;
}

.text-red-600 {
  color: #dc2626;
  font-weight: bold;
}

/* ปรับแต่งปุ่ม edit และ delete */
.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.edit-btn {
  background: #4caf50;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.edit-btn:hover, .delete-btn:hover {
  transform: translateY(-1px);
  filter: brightness(110%);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>