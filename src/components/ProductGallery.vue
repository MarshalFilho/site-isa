<template>
  <div>
    <div class="max-w-7xl mx-auto px-6 pt-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Navegue por Categoria</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="category in categories"
          :key="category._id"
          @click="selectCategory(category._id)" 
          class="group relative block h-48 rounded-lg overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          <img 
            :src="urlFor(category.image).width(400).height(400).url()" 
            :alt="category.title" 
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h3 class="text-white text-2xl font-bold">{{ category.title }}</h3>
          </div>
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold">Nossos Produtos:</h2>
      </div>

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
          @click="selectCategory(null)"
          :class="buttonClass(null)">
          Todos
        </button>
        <button
          v-for="category in categories"
          :key="category._id"
          @click="selectCategory(category._id)"
          :class="buttonClass(category._id)">
          {{ category.title }}
        </button>
      </div>

      <div v-if="filteredProducts.length > 0" class="product-gallery">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product._id"
          :product="product"
          @open-modal="openModal(product)"
        />
      </div>

      <div v-else class="text-center py-16">
        <p class="text-gray-500 text-lg">Nenhum produto encontrado com esses filtros.</p>
      </div>
    </div>

    <div v-if="isModalOpen && selectedProduct">
      </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductCard from './ProductCard.vue';
import { urlFor } from '../lib/sanityClient';

// Props
const props = defineProps({
  products: Array,
  categories: Array,
});

// State (Estado)
const selectedCategory = ref(null);
const searchQuery = ref('');
const isModalOpen = ref(false);
const selectedProduct = ref(null);

// Funções
function openModal(product) {
  selectedProduct.value = product;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedProduct.value = null;
}

function selectCategory(categoryId) {
  selectedCategory.value = categoryId;
}

// Lógica de Classes dos Botões
function buttonClass(categoryId) {
  const base = 'px-4 py-2 rounded-full text-sm font-semibold transition-colors';
  if (selectedCategory.value === categoryId) {
    return `${base} bg-orange-500 text-white`;
  }
  return `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`;
}

// Lógica de Filtro CORRIGIDA
const filteredProducts = computed(() => {
  let products = props.products;

  if (selectedCategory.value) {
    products = products.filter(product => product.category?._id === selectedCategory.value);
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
}
</style>