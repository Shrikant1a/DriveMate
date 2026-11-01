import { execute, initDatabase } from './db.js';

export async function runMigrations() {
  await initDatabase();

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role VARCHAR(20) NOT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      phone VARCHAR(20) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      account_status VARCHAR(20) DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS customer_profiles (
      user_id INTEGER PRIMARY KEY,
      address TEXT,
      emergency_contact_name VARCHAR(100),
      emergency_contact_phone VARCHAR(20),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS driver_profiles (
      user_id INTEGER PRIMARY KEY,
      experience_years INTEGER DEFAULT 3,
      service_area VARCHAR(100) DEFAULT 'Metropolitan Core',
      approval_status VARCHAR(20) DEFAULT 'PENDING',
      availability VARCHAR(20) DEFAULT 'OFFLINE',
      rating_avg DECIMAL(3,2) DEFAULT 5.0,
      rating_count INTEGER DEFAULT 0,
      hourly_rate_paise INTEGER DEFAULT 25000,
      bio TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS driver_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_id INTEGER NOT NULL,
      document_type VARCHAR(50) NOT NULL,
      file_path VARCHAR(255) NOT NULL,
      review_status VARCHAR(20) DEFAULT 'PENDING',
      reviewer_admin_id INTEGER,
      rejection_reason TEXT,
      expiry_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      make VARCHAR(50) NOT NULL,
      model VARCHAR(50) NOT NULL,
      year INTEGER NOT NULL,
      registration_number VARCHAR(30) NOT NULL,
      transmission VARCHAR(20) NOT NULL DEFAULT 'AUTOMATIC',
      fuel_type VARCHAR(20) NOT NULL DEFAULT 'PETROL',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS pricing_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_area VARCHAR(100) NOT NULL,
      trip_type VARCHAR(50) NOT NULL,
      base_fee_paise INTEGER NOT NULL,
      hourly_rate_paise INTEGER NOT NULL,
      min_hours INTEGER NOT NULL DEFAULT 2,
      waiting_rate_paise_per_hr INTEGER NOT NULL DEFAULT 15000,
      platform_commission_pct INTEGER NOT NULL DEFAULT 15,
      is_active BOOLEAN DEFAULT 1
    );`,

    `CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_code VARCHAR(30) NOT NULL UNIQUE,
      customer_id INTEGER NOT NULL,
      driver_id INTEGER,
      vehicle_id INTEGER NOT NULL,
      trip_type VARCHAR(50) NOT NULL,
      pickup_address TEXT NOT NULL,
      destination_address TEXT,
      start_time DATETIME NOT NULL,
      duration_hours INTEGER NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
      estimated_fare_paise INTEGER NOT NULL,
      final_fare_paise INTEGER,
      platform_fee_paise INTEGER,
      driver_payout_paise INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES users(id),
      FOREIGN KEY (driver_id) REFERENCES users(id),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );`,

    `CREATE TABLE IF NOT EXISTS booking_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      actor_id INTEGER NOT NULL,
      old_status VARCHAR(30),
      new_status VARCHAR(30) NOT NULL,
      reason TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      provider_order_id VARCHAR(100),
      provider_payment_id VARCHAR(100),
      amount_paise INTEGER NOT NULL,
      currency VARCHAR(10) DEFAULT 'INR',
      status VARCHAR(30) DEFAULT 'PENDING',
      webhook_payload TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL UNIQUE,
      customer_id INTEGER NOT NULL,
      driver_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id),
      FOREIGN KEY (customer_id) REFERENCES users(id),
      FOREIGN KEY (driver_id) REFERENCES users(id)
    );`,

    `CREATE TABLE IF NOT EXISTS support_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER,
      creator_id INTEGER NOT NULL,
      category VARCHAR(50) NOT NULL,
      subject VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(30) DEFAULT 'OPEN',
      assigned_admin_id INTEGER,
      resolution_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users(id)
    );`,

    `CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_id INTEGER,
      action VARCHAR(100) NOT NULL,
      target_type VARCHAR(50),
      target_id INTEGER,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  console.log('🔄 Executing database migrations...');
  for (const tableSql of tables) {
    await execute(tableSql);
  }
  console.log('✅ All 12 database tables successfully verified/created.');
}

if (process.argv[1] && process.argv[1].endsWith('migrations.ts')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

