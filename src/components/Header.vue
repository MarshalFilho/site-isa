<template>
  <header class="bg-white border-b border-gray-200 relative">
    <div class="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
      
      <a href="/" class="flex items-center gap-3">
        <img src="/favicon.png" alt="Logo Biscuit da Isa" class="h-10 w-10">
        <span class="text-xl font-bold text-gray-800">
          Biscuit da Isa
        </span>
      </a>

      <nav class="hidden md:flex items-center space-x-6">
        <a href="/" class="text-gray-600 hover:text-black">Início</a>
        <a href="/sobre" class="text-gray-600 hover:text-black">Sobre</a>
        <a href="/contato" class="text-gray-600 hover:text-black">Contato</a>
      </nav>

      <div class="md:hidden">
        <button @click="isMenuOpen = !isMenuOpen" class="text-gray-800 focus:outline-none">
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>

    <div 
      :class="{ 'block': isMenuOpen, 'hidden': !isMenuOpen }"
      class="md:hidden bg-white border-t border-gray-200"
    >
      <a href="/" class="block py-2 px-6 text-gray-600 hover:bg-gray-100">Início</a>
      <a href="/sobre" class="block py-2 px-6 text-gray-600 hover:bg-gray-100">Sobre</a>
      <a href="/contato" class="block py-2 px-6 text-gray-600 hover:bg-gray-100">Contato</a>
    </div>

    <div class="bg-emerald-500 text-white text-center py-2 px-6">
      <p class="font-semibold">
        Faça seu pedido personalizado 
        <a href="https://wa.me/5562985298988" target="_blank" rel="noopener noreferrer" class="font-bold underline hover:text-emerald-100">
          aqui!
        </a>
      </p>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

// Variável reativa para controlar o estado do menu (aberto/fechado)
const isMenuOpen = ref(false);
</script>