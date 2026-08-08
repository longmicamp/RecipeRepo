import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: Number(process.env.PORT ?? env.VITE_PORT) || 5173,
      proxy: {
        // "python-api" is the name of the API resource in AppHost.cs.
        // Aspire's dev proxy serves this endpoint over HTTPS (self-signed),
        // so target https and disable cert verification with secure:false.
        "/api": {
          target:
            process.env["services__python-api__https__0"] ||
            "https://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        input: "./index.html",
      },
    },
  };
});
