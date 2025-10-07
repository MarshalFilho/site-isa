<template>
  <div>
    <!-- SEÇÃO DE CATEGORIAS -->
    <div class="max-w-7xl mx-auto px-6 pt-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
        Navegue por Categoria
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="category in categories"
          :key="category._id"
          @click="selectCategory(category._id)"
          class="group relative block h-48 rounded-lg overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <!-- Imagem -->
          <img
            v-if="category.image"
            :src="getCategoryImage(category.image)"
            :alt="category.title"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          <!-- Overlay quando há imagem -->
          <div
            v-if="category.image"
            class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-60"
          >
            <h3 class="text-white text-2xl font-bold">{{ category.title }}</h3>
          </div>

          <!-- Fundo neutro quando NÃO há imagem -->
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center bg-gray-100"
          >
            <h3 class="text-gray-700 text-2xl font-bold">{{ category.title }}</h3>
          </div>
        </button>
      </div>
    </div>

    <!-- SEÇÃO DE PRODUTOS -->
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold">Nossos Produtos:</h2>
      </div>

      <!-- Campo de busca -->
      <div class="mb-8 max-w-md mx-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nome..."
          class="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <!-- Filtros de categoria -->
      <div class="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
        <button
          @click="selectCategory(null)"
          :class="buttonClass(null)"
        >
          Todos
        </button>

        <button
          v-for="category in categories"
          :key="category._id"
          @click="selectCategory(category._id)"
          :class="buttonClass(category._id)"
        >
          {{ category.title }}
        </button>
      </div>

      <!-- Lista de produtos -->
      <div v-if="filteredProducts.length > 0" class="product-gallery">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product._id"
          :product="product"
          @open-modal="openModal(product)"
        />
      </div>

      <!-- Nenhum produto encontrado -->
      <div v-else class="text-center py-16">
        <p class="text-gray-500 text-lg">
          Nenhum produto encontrado com esses filtros.
        </p>
      </div>
    </div>

    <!-- MODAL DE DETALHES DO PRODUTO -->
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
import { ref, computed } from "vue";
import ProductCard from "./ProductCard.vue";
import { urlFor } from "../lib/sanityClient";

const props = defineProps({
  products: Array,
  categories: Array,
});

const isModalOpen = ref(false);
const selectedProduct = ref(null);
const selectedCategory = ref(null);
const searchQuery = ref("");

// === Funções de interação ===
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

function buttonClass(categoryId) {
  const base = "px-4 py-2 rounded-full text-sm font-semibold transition-colors";
  if (selectedCategory.value === categoryId) {
    return `${base} bg-orange-500 text-white`;
  }
  return `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`;
}

// === Tratamento seguro de imagem de categoria ===
function getCategoryImage(image) {
  // Se for objeto Sanity (tem asset)
  if (image && image.asset) {
    return urlFor(image).url();
  }

  // Se for string (URL direta)
  if (typeof image === "string") {
    return image;
  }

  // Fallback: imagem padrão
  return "https://via.placeholder.com/400x300?text=Sem+Imagem";
}

// === Lógica de filtragem de produtos ===
const filteredProducts = computed(() => {
  let products = props.products;

  // Filtro por categoria
  if (selectedCategory.value) {
    products = products.filter(
      (product) => product.category?._id === selectedCategory.value
    );
  }

  // Filtro por busca
  if (searchQuery.value) {
    products = products.filter((product) =>
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
