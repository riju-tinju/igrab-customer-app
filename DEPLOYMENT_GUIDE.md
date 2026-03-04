# Deployment Guide: iGrab Customer App

This guide explains how to deploy the **iGrab Customer App** (Frontend & Backend) to a production server (Ubuntu/Linux recommended).

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: A running MongoDB instance (local or Atlas)
- **Git**: Installed on the server
- **PM2**: Recommended for managing the Node.js process (`npm install -g pm2`)

---

## 2. Server (Backend) Setup

1. **Navigate to the server directory**:
   ```bash
   cd customer-app/server
   ```

2. **Install Dependencies**:
   ```bash
   npm install --production
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Ensure `MONGODB_URI`, `PORT`, `JWT_SECRET`, and `SESSION_SECRET` are correctly set.

4. **Start the Server with PM2**:
   ```bash
   pm2 start index.js --name "igrab-backend"
   pm2 save
   ```

---

## 3. Client (Frontend) Setup

The client is a React application built with Vite. It must be built into static files and served.

1. **Navigate to the client directory**:
   ```bash
   cd ../client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Ensure `client/.env` has the correct production API URL. This variable is used throughout the app to connect to the backend:
   ```env
   VITE_API_URL=https://shop.igrabstorycafe.com  # Use your public HTTPS domain
   VITE_GOOGLE_MAPS_API_KEY=...
   ```

4. **Build the Project**:
   ```bash
   npm run build
   ```
   This creates a `dist/` folder containing the optimized static website.

5. **Serve with Nginx (Recommended)**:
   Update your Nginx site configuration (e.g., `/etc/nginx/sites-available/shop.igrabstorycafe.com`):

   ```nginx
   server {
       # ... your server_name and SSL config ...

       # 1. Serve Frontend Static Files
       location / {
           root /var/www/shop.igrabstorycafe.com;
           index index.html;
           try_files $uri $uri/ /index.html;
       }

       # 2. Proxy API Requests (IMPORTANT: No trailing slash on proxy_pass)
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # 3. Proxy Uploads
       location /uploads {
           proxy_pass http://localhost:5000/uploads;
       }
   }
   ```

---

## 4. Summary of Ports
- **Backend (API)**: Default `5000` (Defined in `server/.env`)
- **Frontend (Web)**: Default `5173` (Or as configured in your static server)

## 5. Helpful Commands
- **Check Status**: `pm2 status`
- **Show Logs**: `pm2 logs`
- **Restart All**: `pm2 restart all`
- **Rebuild Frontend**: `cd client && git pull && npm install && npm run build`
