import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import path from 'path';

function syncToExtensionPlugin() {
  return {
    name: 'sync-to-extension',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'static/dist');
      const destDir = path.resolve(__dirname, '../extension/dist');
      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        for (const file of fs.readdirSync(srcDir)) {
          fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
        }
        console.log('⚡ Unified Vite build: synced frame bundle to extension/dist/');
      }
    }
  };
}

export default defineConfig({
  plugins: [svelte(), syncToExtensionPlugin()],
  build: {
    outDir: 'static/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'frame.js',
        assetFileNames: 'frame.[ext]'
      }
    }
  }
});
