import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON and URL-encoded body parsing for API requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Dynamic API Routing (routes /api/* to the files in the /api/ folder)
app.all('/api/:route*', async (req, res) => {
  const apiRoute = req.params.route;
  const subRoute = req.params[0] || '';
  
  // Construct the relative path to the API handler (e.g. 'gallery' or 'razorpay/create-order')
  const relativePath = subRoute ? `${apiRoute}${subRoute}` : apiRoute;
  const apiFilePath = path.join(__dirname, 'api', `${relativePath}.ts`);
  const compiledJsPath = path.join(__dirname, 'api', `${relativePath}.js`);
  
  try {
    if (fs.existsSync(apiFilePath) || fs.existsSync(compiledJsPath)) {
      // Dynamic import of the API file. 
      // Vercel serverless handlers export a default async function handler(req, res).
      const modulePath = `./api/${relativePath}.js`;
      const handlerModule = await import(modulePath);
      const handler = handlerModule.default;
      
      // Inject standard Express response methods if they are called in Vercel handlers
      await handler(req, res);
    } else {
      res.status(404).json({ error: `API route /api/${relativePath} not found` });
    }
  } catch (error) {
    console.error(`Error handling API route /api/${relativePath}:`, error);
    res.status(500).json({ error: 'Internal server error in API handler', details: error.message });
  }
});

// Serve static assets compiled by Vite from the /dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all other GET requests to index.html for SPA client-side routing (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Production Server running on http://localhost:${PORT}`);
  console.log(`👉 Serving Frontend Assets from: ./dist`);
  console.log(`👉 Serving API Routes from: ./api`);
  console.log(`==================================================\n`);
});
