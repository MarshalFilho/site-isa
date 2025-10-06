<template>
  <div>
    <div class="flex justify-center space-x-2 md:space-x-4 mb-8">
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
    <div v-if="isModalOpen && selectedProduct" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4">

        <div class="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm" @click="closeModal"></div>   
         <div class="relative w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh]" @click.stop>
            <button @click="closeModal" class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-gray-800">
            <span class="sr-only">Fechar modal</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">

            <div class="aspect-square w-full">
                <img :src="urlFor(selectedProduct.image).width(600).url()" :alt="selectedProduct.title" class="h-full w-full rounded-lg object-cover shadow-lg"/>
            </div>

            <div class="flex h-full flex-col">
                <h1 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">{{ selectedProduct.title }}</h1>

                <article class="prose mt-4 text-gray-600">
                {{ selectedProduct.description }}
                </article>

                <div class="mt-auto pt-8">
                <p class="text-3xl font-extrabold text-gray-900">R$ {{ selectedProduct.price }}</p>
                <a :href="selectedProduct.shopeeUrl" target="_blank" class="mt-6 flex w-full items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-lg font-bold text-white shadow-sm transition hover:bg-orange-600">
                    Comprar na Shopee
                </a>
                </div>
            </div>
            </div>
        </div>
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

const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return props.products;
  }
  return props.products.filter(product => product.category._ref === selectedCategory.value);
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