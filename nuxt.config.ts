import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@vite-pwa/nuxt"],

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "TaskFlow – Gestor de Tasques",
      short_name: "TaskFlow",
      description: "Gestiona les teves tasques amb un assistent d'IA",
      theme_color: "#6366f1",
      background_color: "#0f172a",
      display: "standalone",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    },
    devOptions: {
      enabled: false,
    },
  },

  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY,
  },
});
