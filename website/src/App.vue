<template>
  <div class="bg-main-color w-full h-screen">
    <NavbarComponent />
    <RouterView />
  </div>
</template>

<script>
import NavbarComponent from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
    NavbarComponent,
  }
}
</script>

<style>
.bg-main-color {
  background-color: #020202;
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #020202;
}
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #808080;
}
::-webkit-scrollbar-thumb:hover {
  background: #808080;
}
</style>
