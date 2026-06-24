import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "道の駅一覧",
        short_name: "道の駅一覧",
        description: "全国の道の駅を検索・記録できるアプリ",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#863bff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // 一覧・詳細ページのデータ（JSON生成物含む）をアプリシェルと一緒にプリキャッシュし、
        // 一度開いた後はオフラインでも表示できるようにする
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      },
    }),
  ],
});
