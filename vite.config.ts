import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { readFileSync, copyFileSync, existsSync } from 'node:fs';

// Cloudflare Pages serves 200.html as the SPA fallback for any unmatched
// route, without the infinite loop that a `/* /index.html 200` _redirects
// rule triggers (Cloudflare strips .html from the target, re-matching /*).
function cloudflareSpaFallback(): PluginOption {
  return {
    name: 'cloudflare-spa-fallback',
    apply: 'build',
    closeBundle: () => {
      const distPath = fileURLToPath(new URL('./dist', import.meta.url));
      const indexHtml = `${distPath}/index.html`;
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, `${distPath}/200.html`);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), cloudflareSpaFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
