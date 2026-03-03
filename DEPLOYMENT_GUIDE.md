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
   Ensure `client/.env` has the correct production API URL:
   ```env
   VITE_API_URL=https://api.yourdomain.com  # Or your server IP
   VITE_GOOGLE_MAPS_API_KEY=...
   ```

4. **Build the Project**:
   ```bash
   npm run build
   ```
   This creates a `dist/` folder containing the optimized static website.

5. **Serve the Static Files**:
   You can use **Nginx** (recommended) or a simple static server like `serve`:
   ```bash
   # Option A: Simple serve (using PM2)
   npm install -g serve
   pm2 serve dist 5173 --name "igrab-frontend" --spa
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
