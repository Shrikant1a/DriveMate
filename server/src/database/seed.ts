import bcrypt from 'bcryptjs';
import { execute, queryOne, initDatabase } from './db.js';
import { runMigrations } from './migrations.js';

export async function seedDatabase() {
  await runMigrations();

  console.log('🌱 Seeding demo data for DriverOnDemand...');

  // Check if admin already exists
  const existingAdmin = await queryOne('SELECT id FROM users WHERE email = ?', ['admin@driverondemand.com']);
  if (existingAdmin) {
    console.log('ℹ️ Database already seeded. Skipping initial seed.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('Admin@2026!', salt);
  const customerHash = await bcrypt.hash('Customer@123!', salt);
  const driverHash = await bcrypt.hash('Driver@123!', salt);

  // 1. Seed Admin
  const adminRes = await execute(
    `INSERT INTO users (role, name, email, phone, password_hash, account_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['ADMIN', 'Executive Operations Admin', 'admin@driverondemand.com', '+91 99000 11223', adminHash, 'ACTIVE']
  );

  // 2. Seed Customer
  const custRes = await execute(
    `INSERT INTO users (role, name, email, phone, password_hash, account_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['CUSTOMER', 'Alex Patel', 'alex.patel@example.com', '+91 98200 44556', customerHash, 'ACTIVE']
  );
  const customerId = custRes.insertId!;

  await execute(
    `INSERT INTO customer_profiles (user_id, address, emergency_contact_name, emergency_contact_phone)
     VALUES (?, ?, ?, ?)`,
    [customerId, 'Penthouse 14B, Marina Tower, Worli, Mumbai', 'Priya Patel', '+91 98200 11998']
  );

  // Customer Vehicles
  const veh1 = await execute(
    `INSERT INTO vehicles (customer_id, make, model, year, registration_number, transmission, fuel_type, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [customerId, 'Mercedes-Benz', 'E-Class E350d', 2023, 'MH-01-EA-4921', 'AUTOMATIC', 'DIESEL', 'Air suspension calibrated. Keyless go enabled. Clean interior.']
  );
  const veh1Id = veh1.insertId!;

  const veh2 = await execute(
    `INSERT INTO vehicles (customer_id, make, model, year, registration_number, transmission, fuel_type, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [customerId, 'BMW', '5 Series 530i M Sport', 2024, 'MH-02-CP-8812', 'AUTOMATIC', 'PETROL', 'Adaptive sport suspension. Premium sound system.']
  );
  const veh2Id = veh2.insertId!;

  await execute(
    `INSERT INTO vehicles (customer_id, make, model, year, registration_number, transmission, fuel_type, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [customerId, 'Audi', 'A6 45 TFSI Technology', 2022, 'MH-03-BK-1109', 'AUTOMATIC', 'PETROL', 'Smooth dual-clutch transmission.']
  );

  // 3. Seed Approved Driver 1 (Vikramjit Singh)
  const drv1 = await execute(
    `INSERT INTO users (role, name, email, phone, password_hash, account_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['DRIVER', 'Vikramjit Singh', 'vikram.singh@example.com', '+91 98111 22334', driverHash, 'ACTIVE']
  );
  const drv1Id = drv1.insertId!;

  await execute(
    `INSERT INTO driver_profiles (user_id, experience_years, service_area, approval_status, availability, rating_avg, rating_count, hourly_rate_paise, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      drv1Id,
      12,
      'Mumbai Metro & Airport Corridor',
      'APPROVED',
      'ONLINE',
      4.96,
      148,
      28000,
      '12+ years of executive chauffeur experience. Specialized in luxury German and British sedans. Certified in defensive driving, English & Hindi fluent, zero accident record.'
    ]
  );

  await execute(
    `INSERT INTO driver_documents (driver_id, document_type, file_path, review_status, reviewer_admin_id, expiry_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [drv1Id, 'DRIVING_LICENSE', '/uploads/demo-dl-vikram.jpg', 'VERIFIED', adminRes.insertId, '2030-05-15']
  );

  // 4. Seed Approved Driver 2 (Rajesh Sharma)
  const drv2 = await execute(
    `INSERT INTO users (role, name, email, phone, password_hash, account_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['DRIVER', 'Rajesh Sharma', 'rajesh.sharma@example.com', '+91 98222 33445', driverHash, 'ACTIVE']
  );
  const drv2Id = drv2.insertId!;

  await execute(
    `INSERT INTO driver_profiles (user_id, experience_years, service_area, approval_status, availability, rating_avg, rating_count, hourly_rate_paise, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      drv2Id,
      9,
      'South Mumbai & Western Suburbs',
      'APPROVED',
      'ONLINE',
      4.89,
      94,
      25000,
      'Expert in corporate travel, outstation road trips, and peak city navigation. Highly dependable with flawless route knowledge and calm demeanor.'
    ]
  );

  await execute(
    `INSERT INTO driver_documents (driver_id, document_type, file_path, review_status, reviewer_admin_id, expiry_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [drv2Id, 'DRIVING_LICENSE', '/uploads/demo-dl-rajesh.jpg', 'VERIFIED', adminRes.insertId, '2029-08-20']
  );

  // 5. Seed Approved Driver 3 (Anita Deshmukh)
  const drv3 = await execute(
    `INSERT INTO users (role, name, email, phone, password_hash, account_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['DRIVER', 'Anita Deshmukh', 'anita.deshmukh@example.com', '+91 98333 44556', driverHash, 'ACTIVE']
  );
  const drv3Id = drv3.insertId!;

  await execute(
    `INSERT INTO driver_profiles (user_id, experience_years, service_area, approval_status, availability, rating_avg, rating_count, hourly_rate_paise, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      drv3Id,
      7,
      'Bandra-Kurla Complex & Airport Hub',
      'APPROVED',
      'ONLINE',
      4.98,
      112,
      29000,
      'Elite personal chauffeur specializing in VIP hospitality, wedding party transport, and executive corporate delegations. Known for discretion and punctuality.'
    ]
  );

  await execute(
    `INSERT INTO driver_documents (driver_id, document_type, file_path, review_status, reviewer_admin_id, expiry_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [drv3Id, 'DRIVING_LICENSE', '/uploads/demo-dl-anita.jpg', 'VERIFIED', adminRes.insertId, '2031-01-10']
  );

  // 6. Seed Pending Driver Applicant (Suresh Verma)
  const drv4 = await execute(
    `INSERT INTO users (role, name, email, phone, password_hash, account_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['DRIVER', 'Suresh Verma', 'suresh.verma@example.com', '+91 98444 55667', driverHash, 'ACTIVE']
  );
  const drv4Id = drv4.insertId!;

  await execute(
    `INSERT INTO driver_profiles (user_id, experience_years, service_area, approval_status, availability, rating_avg, rating_count, hourly_rate_paise, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      drv4Id,
      4,
      'Thane & Central Suburbs',
      'PENDING',
      'OFFLINE',
      5.0,
      0,
      22000,
      '4 years of personal car driving experience. Looking forward to driving premium vehicles for DriverOnDemand clients.'
    ]
  );

  await execute(
    `INSERT INTO driver_documents (driver_id, document_type, file_path, review_status, reviewer_admin_id, expiry_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [drv4Id, 'DRIVING_LICENSE', '/uploads/demo-dl-suresh.jpg', 'PENDING', null, '2028-11-30']
  );

  // 7. Seed Pricing Rules
  const pricingPlans = [
    { service_area: 'Metropolitan Core', trip_type: 'Hourly Booking', base: 49900, hourly: 24900, min_hr: 2, waiting: 15000, commission: 15 },
    { service_area: 'Metropolitan Core', trip_type: 'Full-Day Chauffeur', base: 199900, hourly: 19900, min_hr: 8, waiting: 10000, commission: 15 },
    { service_area: 'Airport Transfers', trip_type: 'Airport Pickup & Drop', base: 79900, hourly: 27900, min_hr: 3, waiting: 18000, commission: 15 },
    { service_area: 'Outstation Travel', trip_type: 'Long-Distance Road Trip', base: 149900, hourly: 34900, min_hr: 6, waiting: 20000, commission: 18 },
    { service_area: 'Event & Gala', trip_type: 'Wedding & Party Chauffeur', base: 179900, hourly: 39900, min_hr: 4, waiting: 25000, commission: 15 },
  ];

  for (const plan of pricingPlans) {
    await execute(
      `INSERT INTO pricing_rules (service_area, trip_type, base_fee_paise, hourly_rate_paise, min_hours, waiting_rate_paise_per_hr, platform_commission_pct)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [plan.service_area, plan.trip_type, plan.base, plan.hourly, plan.min_hr, plan.waiting, plan.commission]
    );
  }

  // 8. Seed Bookings in different statuses
  // Booking 1: COMPLETED
  const b1 = await execute(
    `INSERT INTO bookings (reference_code, customer_id, driver_id, vehicle_id, trip_type, pickup_address, destination_address, start_time, duration_hours, status, estimated_fare_paise, final_fare_paise, platform_fee_paise, driver_payout_paise, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'DOD-2026-7819',
      customerId,
      drv1Id,
      veh1Id,
      'Hourly Booking',
      'Penthouse 14B, Marina Tower, Worli',
      'The Taj Mahal Palace, Colaba',
      '2026-10-28 18:30:00',
      4,
      'COMPLETED',
      149500,
      149500,
      22425,
      127075,
      'Evening dinner & business reception in customer Mercedes E-Class.'
    ]
  );
  const b1Id = b1.insertId!;

  await execute(
    `INSERT INTO booking_events (booking_id, actor_id, old_status, new_status, reason, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [b1Id, customerId, 'REQUESTED', 'ACCEPTED', 'Driver accepted dispatch request', 'Confirmed']
  );
  await execute(
    `INSERT INTO booking_events (booking_id, actor_id, old_status, new_status, reason, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [b1Id, drv1Id, 'ACCEPTED', 'IN_PROGRESS', 'Key handover and vehicle pre-check completed', 'Customer car: Mercedes E350d']
  );
  await execute(
    `INSERT INTO booking_events (booking_id, actor_id, old_status, new_status, reason, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [b1Id, drv1Id, 'IN_PROGRESS', 'COMPLETED', 'Trip completed safely at drop location', 'Safe park']
  );

  await execute(
    `INSERT INTO reviews (booking_id, customer_id, driver_id, rating, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [b1Id, customerId, drv1Id, 5, 'Vikramjit is exceptional! Drove my Mercedes with utmost care, great conversation, arrived 10 mins early. Will definitely book him again!']
  );

  // Booking 2: IN_PROGRESS
  const b2 = await execute(
    `INSERT INTO bookings (reference_code, customer_id, driver_id, vehicle_id, trip_type, pickup_address, destination_address, start_time, duration_hours, status, estimated_fare_paise, final_fare_paise, platform_fee_paise, driver_payout_paise, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'DOD-2026-9042',
      customerId,
      drv3Id,
      veh2Id,
      'Airport Pickup & Drop',
      'Marina Tower, Worli',
      'Chhatrapati Shivaji Maharaj International Airport (T2)',
      '2026-11-01 14:00:00',
      3,
      'IN_PROGRESS',
      163600,
      163600,
      24540,
      139060,
      'Trip currently ongoing. Customer vehicle: BMW 5 Series 530i.'
    ]
  );
  const b2Id = b2.insertId!;

  await execute(
    `INSERT INTO booking_events (booking_id, actor_id, old_status, new_status, reason, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [b2Id, drv3Id, 'ARRIVED', 'IN_PROGRESS', 'Vehicle exterior pre-check passed. Keys received.', 'Handover verified']
  );

  // Booking 3: REQUESTED
  const b3 = await execute(
    `INSERT INTO bookings (reference_code, customer_id, driver_id, vehicle_id, trip_type, pickup_address, destination_address, start_time, duration_hours, status, estimated_fare_paise, final_fare_paise, platform_fee_paise, driver_payout_paise, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'DOD-2026-3105',
      customerId,
      drv2Id,
      veh1Id,
      'Wedding & Party Chauffeur',
      'The Oberoi, Nariman Point',
      'St. Regis, Lower Parel',
      '2026-11-02 19:00:00',
      5,
      'REQUESTED',
      379400,
      379400,
      56910,
      322490,
      'Pending driver confirmation. Customer car: Mercedes-Benz E-Class.'
    ]
  );

  // Seed sample support ticket
  await execute(
    `INSERT INTO support_cases (booking_id, creator_id, category, subject, description, status, assigned_admin_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      b1Id,
      customerId,
      'Billing Inquiry',
      'Receipt generation for corporate reimbursement',
      'Kindly provide the GST-inclusive itemized tax invoice for my completed trip DOD-2026-7819.',
      'RESOLVED',
      adminRes.insertId
    ]
  );

  console.log('✅ Demo seed completed successfully!');
  console.log('🔑 Credentials summary:');
  console.log('   Admin:    admin@driverondemand.com   | Admin@2026!');
  console.log('   Customer: alex.patel@example.com     | Customer@123!');
  console.log('   Driver:   vikram.singh@example.com   | Driver@123!');
  console.log('   Driver 2: rajesh.sharma@example.com  | Driver@123!');
  console.log('   Driver 3: anita.deshmukh@example.com | Driver@123!');
  console.log('   Pending:  suresh.verma@example.com   | Driver@123!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

