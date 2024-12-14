<script setup>
import { ref, onMounted, computed } from 'vue'
import { studentAPI } from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const students = ref([])
const loading = ref(true)
const searchTerm = ref('')
const selectedClass = ref('')
const selectedGender = ref('')
const selectedRoom = ref('')

// สำหรับ pagination
const currentPage = ref(1)
const itemsPerPage = 10

// ดึงข้อมูลนักเรียน
const fetchStudents = async () => {
  try {
    loading.value = true
    const response = await studentAPI.getAll()
    students.value = response.data
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error)
  } finally {
    loading.value = false
  }
}

// กรองข้อมูล
const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const matchSearch = student.student_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                       student.student_lastname.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                       student.student_code.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchClass = !selectedClass.value || student.student_class === selectedClass.value
    const matchRoom = !selectedRoom.value || student.student_room === selectedRoom.value
    const matchGender = !selectedGender.value || student.student_gender === selectedGender.value
    return matchSearch && matchClass && matchRoom && matchGender
  })
})

// คำนวณข้อมูลสำหรับหน้าปัจจุบัน
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredStudents.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / itemsPerPage)
})

// จัดการการลบนักเรียน
const handleDelete = async (studentId) => {
  if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนักเรียนคนนี้?')) {
    try {
      await studentAPI.delete(studentId)
      await fetchStudents()
      alert('ลบข้อมูลสำเร็จ')
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล')
    }
  }
}

const getGradeClass = (grade) => {
  const numGrade = parseFloat(grade)
  if (numGrade >= 3.5) return 'text-green-600'
  if (numGrade >= 3.0) return 'text-blue-600'
  if (numGrade >= 2.0) return 'text-yellow-600'
  return 'text-red-600'
}

onMounted(fetchStudents)
</script>

<template>
  <div class="students-container">
    <!-- Header Section -->
    <div class="header-section">
      <h1 class="text-3xl font-bold">
        <i class="fas fa-users"></i> ข้อมูลนักเรียนทั้งหมด
      </h1>
      <button @click="router.push('/AddStudent')" class="add-btn">
        <i class="fas fa-plus"></i> เพิ่มนักเรียน
      </button>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchTerm"
          type="text"
          placeholder="ค้นหานักเรียน..."
        >
      </div>

      <div class="filter-group">
        <select v-model="selectedClass">
          <option value="">ทุกชั้นเรียน</option>
          <option value="ม.1">ม.1</option>
          <option value="ม.2">ม.2</option>
          <option value="ม.3">ม.3</option>
          <option value="ม.4">ม.4</option>
          <option value="ม.5">ม.5</option>
          <option value="ม.6">ม.6</option>
        </select>

        <select v-model="selectedRoom">
          <option value="">ทุกห้อง</option>
          <option value="1">ห้อง 1</option>
          <option value="2">ห้อง 2</option>
          <option value="3">ห้อง 3</option>
          <option value="4">ห้อง 4</option>
        </select>

        <select v-model="selectedGender">
          <option value="">ทุกเพศ</option>
          <option value="ชาย">ชาย</option>
          <option value="หญิง">หญิง</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Students Table -->
    <div v-else class="table-container">
      <table v-if="paginatedStudents.length > 0">
        <thead>
          <tr>
            <th>รหัสนักเรียน</th>
            <th>ชื่อ-นามสกุล</th>
            <th>ชั้น/ห้อง</th>
            <th>เพศ</th>
            <th>เกรดเฉลี่ย</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in paginatedStudents" :key="student.idstudent"
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
              <button @click="router.push(`/edit-student/${student.idstudent}`)" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="handleDelete(student.idstudent)" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- No Results -->
      <div v-else class="no-results">
        <i class="fas fa-search"></i>
        <p>ไม่พบข้อมูลนักเรียน</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="page-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <span class="page-info">หน้า {{ currentPage }} จาก {{ totalPages }}</span>
        
        <button 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="page-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.students-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-btn {
  background: #4776E6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: none;
}

.add-btn:hover {
  background: #3461c1;
  transform: translateY(-1px);
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-box input {
  width: 93%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-width: 150px;
}

.table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
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

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  border: none;
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

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ddd;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-group select {
    flex: 1;
  }
  
  th, td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
}
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
</style>
