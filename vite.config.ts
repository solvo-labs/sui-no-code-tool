// vite.config.js
import { defineConfig, optimizeDeps } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import GlobalsPolyfills from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [
      react(),
      wasm(),
      NodeGlobalsPolyfillPlugin({
        buffer: true,
      }),
    ],
    base: "/",
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
        plugins: [
          GlobalsPolyfills({
            process: true,
            buffer: true,
          }),
        ],
      },
    },
  };

  if (command !== "serve") {
  }

  return config;
});
