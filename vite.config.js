import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// Auto-copy admin logos to root public folder
try {
  const rootPublic = path.resolve(__dirname, './public');
  const adminPublic = path.resolve(__dirname, './df-admin/public');
  
  if (fs.existsSync(adminPublic)) {
    if (fs.existsSync(path.join(adminPublic, 'logo.png'))) {
      fs.copyFileSync(path.join(adminPublic, 'logo.png'), path.join(rootPublic, 'logo.png'));
    }
    if (fs.existsSync(path.join(adminPublic, 'logo-icon-only.png'))) {
      fs.copyFileSync(path.join(adminPublic, 'logo-icon-only.png'), path.join(rootPublic, 'logo-icon-only.png'));
    }
  }
} catch (err) {
  console.error('Failed to copy admin logos:', err);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './df-admin/src'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ''),
      },
      '/_next': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
