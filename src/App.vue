<script setup>
import { provide, ref } from 'vue'
import Navbar from './components/navbar/Navbar.vue'
import Sidebar from './components/sidebar/Sidebar.vue'
import './assets/layout.css'

const isCollapsed = ref(false)
provide('sidebarState', isCollapsed)
</script>

<template>
  <div class="grid-container" :class="{ 'sidebar-collapsed': isCollapsed }">
    <navbar/>
  <sidebar/>
  <div class="content">
    <router-view />
  </div>
  </div>
  
</template>

