import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { initDatabase } from './database/db.js';
import { runMigrations } from './database/migrations.js';
import { seedDatabase } from './database/seed.js';
import { initSocket } from './socket.js';

import authRoutes from './modules/auth/authRoutes.js';
import vehicleRoutes from './modules/vehicles/vehicleRoutes.js';
import driverRoutes from './modules/drivers/driverRoutes.js';
import bookingRoutes from './modules/bookings/bookingRoutes.js';
import adminRoutes from './modules/admin/adminRoutes.js';
import supportRoutes from './modules/support/supportRoutes.js';
import paymentRoutes from './modules/payments/paymentRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch {
  // Ignore sandbox directory permission warning
}
app.use('/uploads', express.static(uploadsDir));

// Initialize Socket.IO
initSocket(server);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    project: 'DriverOnDemand',
    tagline: 'Your Car. Your Journey. Your Driver.',
    timestamp: new Date().toISOString()
  });
});

// Mount API Modules
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/payments', paymentRoutes);

// Serve Frontend Client Static Assets (Production & Preview)
const clientDistPath = path.resolve(process.cwd(), '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

const PORT = Number(process.env.PORT) || 5000;

export async function startServer(portOverride?: number) {
  await initDatabase();
  await runMigrations();
  await seedDatabase();

  const listenPort = portOverride || Number(process.env.PORT) || 5000;

  server.listen(listenPort, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 DriveMate Full-Stack Server Active`);
    console.log(`🌐 Live URL: http://localhost:${listenPort}`);
    console.log(`📡 WebSocket Dispatch: Realtime ready`);
    console.log(`🛡️ Role Security: Customer, Driver, Super Admin`);
    console.log(`======================================================\n`);
  });
  return { app, server };
}

if (process.argv[1] && process.argv[1].endsWith('server.ts')) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
