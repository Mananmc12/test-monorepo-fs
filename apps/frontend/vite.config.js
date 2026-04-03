import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server runs on port 3000; API is on http://localhost:5000
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
