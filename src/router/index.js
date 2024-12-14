import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddStudentView from '../views/student/AddStudentView.vue'
import AllStudentView from '../views/student/AllStudentView.vue'
import UserManagementView from '../views/users/UserManagementView.vue'
import UserEditView from '../views/users/UserEditView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/addStudent',
      name: 'addStudent',
      
      component: AddStudentView,
    },
    
    {
      path: '/Allstudent',
      name: 'Allstudent',
      component: AllStudentView,
    },
    {
      path: '/userManagement',
      name: 'userManagement',
      component: UserManagementView,
    },

    {
      path: '/userEdit/:id/edit',
      name: 'userEdit',
      component: UserEditView,
    },
  ],
})

export default router