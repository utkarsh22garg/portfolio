import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isGithubPages = process.env.GITHUB_PAGES === "true";
  const repoName = "portfolio"; // 🔁 Replace this with your actual GitHub repo name

  return {
    base: isGithubPages ? `/${repoName}/` : "/",
    server: {
      host: "::",
      port: 8080,
      open: true,
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
