import solid from "solid-start/vite";
import { defineConfig, optimizeDeps } from "vite";
import vercel from "solid-start-vercel";

export default defineConfig({
  plugins: [solid({ adapter: vercel({ edge: false }) , ssr: false })],
  optimizeDeps: {
    exclude: ["solid-colorful"],
  },
  ssr: {
    noExternal: ["solid-colorful"],
  },
});
