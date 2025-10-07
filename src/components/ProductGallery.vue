<template>
  <div>
    <div class="mb-8 max-w-md mx-auto">
      <input 
        type="text"
        v-model="searchQuery"
        placeholder="Buscar por nome..."
        class="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-orange-500 focus:border-orange-500"
      />
    </div>

    <div class="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
      <button
        @click="selectedCategory = null"
        :class="[
          'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
          selectedCategory === null ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]">
        Todos
      </button>
      <button
        v-for="category in categories"
        :key="category._id"
        @click="selectedCategory = category._id"
        :class="[
          'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
          selectedCategory === category._id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]">
        {{ category.title }}
      </button>
    </div>

    <div class="product-gallery">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product._id"
        :product="product"
        @open-modal="openModal(product)"
      />
    </div>
    
    <div v-if="filteredProducts.length === 0" class="text-center py-16">
      <p class="text-gray-500 text-lg">Nenhum produto encontrado com esses filtros.</p>
    </div>

    <div v-if="isModalOpen && selectedProduct">
      </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductCard from './ProductCard.vue';
import { urlFor } from '../lib/sanityClient';

const isModalOpen = ref(false);
const selectedProduct = ref(null);
function openModal(product) {
  selectedProduct.value = product;
  isModalOpen.value = true;
}
function closeModal() {
  isModalOpen.value = false;
  selectedProduct.value = null;
}

const props = defineProps({
  products: Array,
  categories: Array,
});

const selectedCategory = ref(null);
const searchQuery = ref(''); 

const filteredProducts = computed(() => {
  let products = props.products;

  if (selectedCategory.value) {
    products = products.filter(product => product.category._ref === selectedCategory.value);
  }

  if (searchQuery.value) {
    products = products.filter(product => 
      product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return products;
});
</script>

<style>
.product-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>