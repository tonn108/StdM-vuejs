<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const studentForm = ref({
  student_code: '',
  student_name: '',
  student_lastname: '',
  student_class: '',
  student_room: '',
  student_gender: '',
  student_grade: ''
})

const handleSubmit = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/students', studentForm.value)
    console.log('บันทึกข้อมูล:', response.data)
    alert('บันทึกข้อมูลสำเร็จ')
    router.push('/')
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error)
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง')
  }
}

const handleCancel = () => {
  router.push('/')
}
</script>
<template>
  <div class="add-student-container">
    <div class="form-header">
      <h2><i class="fas fa-user-plus"></i> เพิ่มข้อมูลนักเรียน</h2>
    </div>

    <form class="student-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>รหัสนักเรียน:</label>
        <input 
          type="text" 
          v-model="studentForm.student_code" 
          placeholder="กรอกรหัสนักเรียน"
          required
        >
      </div>

      <div class="form-group">
        <label>ชื่อ:</label>
        <input 
          type="text" 
          v-model="studentForm.student_name" 
          placeholder="กรอกชื่อ"
          required
        >
      </div>

      <div class="form-group">
        <label>นามสกุล:</label>
        <input 
          type="text" 
          v-model="studentForm.student_lastname" 
          placeholder="กรอกนามสกุล"
          required
        >
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>ชั้นเรียน:</label>
          <select v-model="studentForm.student_class" required>
            <option value="">เลือกชั้นเรียน</option>
            <option value="ม.1">ม.1</option>
            <option value="ม.2">ม.2</option>
            <option value="ม.3">ม.3</option>
            <option value="ม.4">ม.4</option>
            <option value="ม.5">ม.5</option>
            <option value="ม.6">ม.6</option>
          </select>
        </div>

        <div class="form-group">
          <label>ห้อง:</label>
          <select v-model="studentForm.student_room" required>
            <option value="">เลือกห้อง</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>เพศ:</label>
        <div class="radio-group">
          <label>
            <input type="radio" v-model="studentForm.student_gender" value="ชาย" required>
            ชาย
          </label>
          <label>
            <input type="radio" v-model="studentForm.student_gender" value="หญิง">
            หญิง
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>เกรดเฉลี่ย:</label>
        <input 
          type="number" 
          v-model="studentForm.student_grade" 
          step="0.01"
          min="0"
          max="4.00"
          placeholder="กรอกเกรดเฉลี่ยนักเรียน"
          required
        >
      </div>

      <div class="form-actions">
        <button type="button" class="cancel-btn" @click="handleCancel">
          <i class="fas fa-times"></i> ยกเลิก
        </button>
        <button type="submit" class="submit-btn">
          <i class="fas fa-save"></i> บันทึก
        </button>
      </div>
    </form>
  </div>
</template>
<style scoped>
.add-student-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
}

.form-header h2 {
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.student-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  font-weight: 500;
  color: #2c3e50;
}

input[type="text"],
input[type="date"],
select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input[type="text"]:focus,
input[type="date"]:focus,
select:focus {
  border-color: #4776E6;
  outline: none;
  box-shadow: 0 0 0 2px rgba(71, 118, 230, 0.2);
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.submit-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
}

.submit-btn {
  background: #4776E6;
  color: white;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}

.submit-btn:hover {
  background: #3461c1;
}

.cancel-btn:hover {
  background: #c82333;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* เพิ่มสไตล์สำหรับ input type number */
input[type="number"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
}

/* ซ่อนปุ่มเพิ่ม/ลดตัวเลขด้านข้าง */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"]:focus {
  border-color: #4776E6;
  outline: none;
  box-shadow: 0 0 0 2px rgba(71, 118, 230, 0.2);
}
</style>