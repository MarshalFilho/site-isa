import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import icon from "astro-icon";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [vue(), icon()],

  vite: {
    plugins: [tailwindcss()]
  }
});