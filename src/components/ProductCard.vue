<template>
  <button @click="$emit('openModal')" 
          class="group block w-full text-left overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md">

    <div class="w-full h-48 overflow-hidden">
      <img :src="urlFor(product.image).width(400).url()" 
           :alt="product.title" 
           class="h-full w-full object-cover transition-transform group-hover:scale-105" />
    </div>

    <div class="bg-white p-4">
      <h3 class="font-semibold text-gray-800">{{ product.title }}</h3>
      <p class="mt-1 font-bold text-lg text-gray-900">R$ {{ product.price }}</p>
    </div>
  </button>
</template>

<script setup>
import { urlFor } from '../lib/sanityClient';

// 1. Define as props que o componente recebe
defineProps({
  product: Object
});

// 2. Define os eventos que o componente pode emitir
defineEmits(['openModal']);
</script>