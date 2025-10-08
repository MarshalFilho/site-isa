<template>
  <div ref="galleryRoot">
    <div class="max-w-7xl mx-auto px-6 pt-8">
      <h2 class="text-3xl font-bold text-center text-black mb-8">Navegue por Categoria</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="category in categories"
          :key="category._id"
          @click="selectCategory(category._id)" 
          class="group relative block h-48 rounded-lg overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
          
          <img 
            v-if="category.image"
            :src="urlFor(category.image).width(400).url()" 
            :alt="category.title" 
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
            <h3 class="text-white text-2xl font-bold text-center drop-shadow-lg">{{ category.title }}</h3>
          </div>
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-black-300">Nossos Produtos:</h2>
      </div>
      
      <div class="mb-8 max-w-md mx-auto">
        <input v-model="searchQuery" type="text" placeholder="Buscar por nome..." class="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-orange-500 focus:border-orange-500" />
      </div>

      <div class="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
        <button @click="selectCategory(null)" :class="buttonClass(null)">Todos</button>
        <button v-for="category in categories" :key="category._id" @click="selectCategory(category._id)" :class="buttonClass(category._id)">
          {{ category.title }}
        </button>
      </div>

      <div v-if="filteredProducts.length > 0" class="product-gallery">
        <ProductCard v-for="product in filteredProducts" :key="product._id" :product="product" @open-modal="openModal(product)" />
      </div>
      
      <div v-else class="text-center py-16 px-6">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Nenhum resultado</h3>
        <p class="mt-1 text-sm text-gray-500">Não encontramos produtos com os filtros selecionados.</p>
        <div class="mt-6">
          <button @click="clearFilters" class="inline-flex items-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="isModalOpen && selectedProduct">
      <div
        class="fixed inset-0 z-40 bg-opacity-30 backdrop-blur-sm"
        @click="closeModal"
      ></div>

      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="relative w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
          @click.stop
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
          >
            <span class="sr-only">Fechar modal</span>
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div class="aspect-square w-full">
              <img
                :src="urlFor(selectedProduct.image).width(600).url()"
                :alt="selectedProduct.title"
                class="h-full w-full rounded-lg object-cover shadow-lg"
              />
            </div>

            <div class="flex h-full flex-col">
              <h1
                class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
              >
                {{ selectedProduct.title }}
              </h1>

              <article class="prose mt-4 text-gray-600">
                {{ selectedProduct.description }}
              </article>

              <div class="mt-auto pt-8">
                <p class="text-3xl font-extrabold text-gray-900">
                  R$ {{ selectedProduct.price }}
                </p>
                <a
                  :href="selectedProduct.shopeeUrl"
                  target="_blank"
                  class="mt-6 flex w-full items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-lg font-bold text-white shadow-sm transition hover:bg-orange-600"
                >
                  Comprar na Shopee
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script setup>
// 3. Importamos 'nextTick' do Vue
import { ref, computed, nextTick } from 'vue';
import ProductCard from './ProductCard.vue';
import { urlFor } from '../lib/sanityClient';

// 4. Criamos a ref para o nosso 'div' principal
const galleryRoot = ref(null);

const props = defineProps({
  products: Array,
  categories: Array,
});

const isModalOpen = ref(false);
const selectedProduct = ref(null);
const selectedCategory = ref(null);
const searchQuery = ref('');

function openModal(product) {
  selectedProduct.value = product;
  isModalOpen.value = true;
}
function closeModal() {
  isModalOpen.value = false;
  selectedProduct.value = null;
}

// 5. FUNÇÃO DE ROLAGEM SUAVE
async function selectCategory(categoryId) {
  selectedCategory.value = categoryId;
  
  // Espera o Vue atualizar a lista de produtos
  await nextTick();
  
  // Encontra o início da seção de produtos e rola até lá
  if (galleryRoot.value) {
    const productSection = galleryRoot.value.querySelector('.product-gallery, .text-center.py-16');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// 6. NOVA FUNÇÃO PARA LIMPAR OS FILTROS
function clearFilters() {
  selectedCategory.value = null;
  searchQuery.value = '';
}

function buttonClass(categoryId) {
  const base = 'px-4 py-2 rounded-full text-sm font-semibold transition-colors';
  if (selectedCategory.value === categoryId) {
    return `${base} bg-emerald-500 text-white`;
  }
  return `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`;
}

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