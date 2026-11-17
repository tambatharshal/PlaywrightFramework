/**
 * Local practice app — static UI + simple REST API
 * Start: npm run dummy:serve
 * UI:  http://127.0.0.1:4173
 * API: http://127.0.0.1:4173/api
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.DUMMY_PORT || 4173);
const PUBLIC_DIR = path.join(__dirname, 'public');

const USERS = {
  standard_user: { password: 'secret_sauce', role: 'user' },
  locked_out_user: { password: 'secret_sauce', role: 'locked' },
};

const PRODUCTS = [
  { id: 1, name: 'Sauce Labs Backpack', price: 29.99, desc: 'Carry all your samples' },
  { id: 2, name: 'Sauce Labs Bike Light', price: 9.99, desc: 'A red light for night rides' },
  { id: 3, name: 'Sauce Labs Bolt T-Shirt', price: 15.99, desc: 'Get your testing superhero on' },
  { id: 4, name: 'Sauce Labs Fleece Jacket', price: 49.99, desc: 'Fleece for cool evenings' },
  { id: 5, name: 'Sauce Labs Onesie', price: 7.99, desc: 'Infant onesie for tiny testers' },
  { id: 6, name: 'Test.allTheThings() T-Shirt', price: 15.99, desc: 'Classic QA tee' },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res, pathname) {
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    return res.end('Not Found');
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

async function handleApi(req, res, url) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  const pathname = url.pathname.replace(/\/$/, '') || '/';

  if (req.method === 'POST' && pathname === '/api/login') {
    const body = await readBody(req);
    const user = USERS[body.username];
    if (!user || user.password !== body.password) {
      return sendJson(res, 401, { error: 'Username and password do not match' });
    }
    if (user.role === 'locked') {
      return sendJson(res, 403, { error: 'Sorry, this user has been locked out.' });
    }
    return sendJson(res, 200, { token: `token-${body.username}`, username: body.username, role: user.role });
  }

  if (req.method === 'GET' && pathname === '/api/products') {
    return sendJson(res, 200, { data: PRODUCTS });
  }

  if (req.method === 'GET' && pathname.startsWith('/api/products/')) {
    const id = Number(pathname.split('/').pop());
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return sendJson(res, 404, { error: 'Product not found' });
    return sendJson(res, 200, { data: product });
  }

  if (req.method === 'POST' && pathname === '/api/orders') {
    const body = await readBody(req);
    return sendJson(res, 201, {
      id: `ORD-${Date.now()}`,
      items: body.items || [],
      customer: body.customer || {},
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    });
  }

  if (req.method === 'GET' && pathname === '/api/users') {
    const page = Number(url.searchParams.get('page') || 1);
    return sendJson(res, 200, {
      page,
      data: [
        { id: 1, email: 'standard.local@example.com', first_name: 'Standard', last_name: 'User' },
        { id: 2, email: 'admin.local@example.com', first_name: 'Admin', last_name: 'User' },
      ],
    });
  }

  return sendJson(res, 404, { error: `No route for ${req.method} ${pathname}` });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
    if (url.pathname.startsWith('/api')) {
      return await handleApi(req, res, url);
    }
    return serveStatic(req, res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { error: String(error.message || error) });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Dummy app running at http://127.0.0.1:${PORT}`);
  console.log(`API base at http://127.0.0.1:${PORT}/api`);
});
