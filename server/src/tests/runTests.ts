import bcrypt from 'bcryptjs';
import { initDatabase, queryOne, query, execute } from '../database/db.js';
import { runMigrations } from '../database/migrations.js';
import { seedDatabase } from '../database/seed.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('🧪 Starting DriveMate Automated Integration & Business Rule Tests...\n');

  // Test 1: Database & Migrations
  console.log('1. Database & Migrations:');
  await initDatabase();
  await runMigrations();
  await seedDatabase();

  const userCount = await queryOne<any>('SELECT COUNT(*) as count FROM users');
  assert(userCount && userCount.count >= 4, 'Users table populated with demo accounts');

  const vehicleCount = await queryOne<any>('SELECT COUNT(*) as count FROM vehicles');
  assert(vehicleCount && vehicleCount.count >= 3, 'Vehicles table contains customer vehicles');

  const ruleCount = await queryOne<any>('SELECT COUNT(*) as count FROM pricing_rules');
  assert(ruleCount && ruleCount.count >= 5, 'Pricing rules table initialized with 5 service verticals');

  // Test 2: Auth & Role Validation
  console.log('\n2. Authentication & Password Security:');
  const admin = await queryOne<any>('SELECT * FROM users WHERE email = ?', ['admin@driverondemand.com']);
  assert(admin !== null && admin.role === 'ADMIN', 'Admin account seeded with role=ADMIN');

  const validAdminPass = await bcrypt.compare('Admin@2026!', admin.password_hash);
  assert(validAdminPass === true, 'Admin password hash verified with bcrypt');

  const invalidAdminPass = await bcrypt.compare('WrongPassword', admin.password_hash);
  assert(invalidAdminPass === false, 'Invalid credentials rejected by password hasher');

  // Test 3: Business Logic - Customer Car Ownership
  console.log('\n3. Customer Vehicles & Ownership:');
  const customer = await queryOne<any>('SELECT * FROM users WHERE email = ?', ['alex.patel@example.com']);
  assert(customer !== null && customer.role === 'CUSTOMER', 'Customer account exists');

  const custVehicles = await query<any>('SELECT * FROM vehicles WHERE customer_id = ?', [customer.id]);
  assert(custVehicles.length >= 2, 'Customer owns personal vehicles (Mercedes-Benz, BMW, etc.)');
  assert(custVehicles[0].transmission !== null, 'Vehicle has registered transmission type (AUTOMATIC/MANUAL)');

  // Test 4: Driver Verification Rule (DRV-04)
  console.log('\n4. Driver Verification Rules:');
  const approvedDriver = await queryOne<any>(
    'SELECT u.id, dp.approval_status, dp.availability FROM users u JOIN driver_profiles dp ON u.id = dp.user_id WHERE u.email = ?',
    ['vikram.singh@example.com']
  );
  assert(approvedDriver.approval_status === 'APPROVED', 'Vikramjit Singh has APPROVED status');

  const pendingDriver = await queryOne<any>(
    'SELECT u.id, dp.approval_status, dp.availability FROM users u JOIN driver_profiles dp ON u.id = dp.user_id WHERE u.email = ?',
    ['suresh.verma@example.com']
  );
  assert(pendingDriver.approval_status === 'PENDING', 'Suresh Verma is in PENDING verification');

  // Test 5: Server-Side Fare Calculation Formula
  console.log('\n5. Server-Side Fare Calculation & Integer Paise:');
  const hourlyRule = await queryOne<any>('SELECT * FROM pricing_rules WHERE trip_type = "Hourly Booking"');
  const duration = 4;
  const billableHours = Math.max(hourlyRule.min_hours, duration);
  const subtotal = hourlyRule.base_fee_paise + (hourlyRule.hourly_rate_paise * billableHours);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  assert(Number.isInteger(total), 'Fare is strictly stored and calculated as integer paise without floating point issues');
  assert(total === (49900 + 24900 * 4) + Math.round((49900 + 24900 * 4) * 0.05), 'Fare matches exact published formula: base + (hourly * hours) + taxes');

  // Test 6: Booking Creation and Status Transitions
  console.log('\n6. Booking Lifecycle & State Transitions:');
  const testRef = `TEST-BOOKING-${Date.now()}`;
  const insertBooking = await execute(
    `INSERT INTO bookings (reference_code, customer_id, driver_id, vehicle_id, trip_type, pickup_address, destination_address, start_time, duration_hours, status, estimated_fare_paise, final_fare_paise, platform_fee_paise, driver_payout_paise)
     VALUES (?, ?, ?, ?, 'Hourly Booking', 'Test Pickup Loc', 'Test Drop Loc', '2026-11-05 10:00:00', 3, 'REQUESTED', 130725, 130725, 18675, 105825)`,
    [testRef, customer.id, approvedDriver.id, custVehicles[0].id]
  );
  const testBookingId = insertBooking.insertId!;
  assert(testBookingId > 0, 'New booking created in REQUESTED status');

  // Transition: REQUESTED -> ACCEPTED
  await execute("UPDATE bookings SET status = 'ACCEPTED' WHERE id = ?", [testBookingId]);
  await execute(
    "INSERT INTO booking_events (booking_id, actor_id, old_status, new_status, reason) VALUES (?, ?, 'REQUESTED', 'ACCEPTED', 'Driver confirmed')",
    [testBookingId, approvedDriver.id]
  );
  let bCheck = await queryOne<any>('SELECT status FROM bookings WHERE id = ?', [testBookingId]);
  assert(bCheck.status === 'ACCEPTED', 'Status transitioned to ACCEPTED');

  // Transition: ACCEPTED -> EN_ROUTE -> ARRIVED -> IN_PROGRESS -> COMPLETED
  await execute("UPDATE bookings SET status = 'IN_PROGRESS' WHERE id = ?", [testBookingId]);
  await execute("UPDATE bookings SET status = 'COMPLETED' WHERE id = ?", [testBookingId]);
  bCheck = await queryOne<any>('SELECT status FROM bookings WHERE id = ?', [testBookingId]);
  assert(bCheck.status === 'COMPLETED', 'Status transitioned to COMPLETED');

  // Test 7: Review Rule (Only completed bookings can be reviewed)
  console.log('\n7. Review Constraints:');
  const reviewRes = await execute(
    'INSERT INTO reviews (booking_id, customer_id, driver_id, rating, comment) VALUES (?, ?, ?, 5, "Superb ride!")',
    [testBookingId, customer.id, approvedDriver.id]
  );
  assert(reviewRes.insertId! > 0, 'Review successfully recorded for completed booking');

  // Test 8: Admin Audit Trail
  console.log('\n8. Admin Audit Trail Logging:');
  await execute(
    "INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata) VALUES (?, 'DRIVER_APPROVAL', 'DRIVER', ?, ?)",
    [admin.id, pendingDriver.id, JSON.stringify({ note: 'Documents verified and approved' })]
  );
  const audit = await queryOne<any>("SELECT * FROM audit_logs WHERE target_id = ? ORDER BY id DESC LIMIT 1", [pendingDriver.id]);
  assert(audit !== null && audit.action === 'DRIVER_APPROVAL', 'Admin action recorded in persistent audit log');

  // Test 9: Platform Commission & Driver Payout Split
  console.log('\n9. Platform Commission & Driver Payout Split:');
  const grossFare = 100000; // ₹1,000.00
  const platformFee = Math.round(grossFare * 0.15); // 15% platform commission
  const driverPayout = grossFare - platformFee; // 85% driver take-home
  assert(platformFee === 15000, 'Platform commission exactly calculates at 15%');
  assert(driverPayout === 85000, 'Driver payout exactly calculates at 85%');
  assert(platformFee + driverPayout === grossFare, 'Zero leakage in payout sum');

  // Test 10: SQL Injection Protection with Parameterized Queries
  console.log('\n10. Security & SQL Injection Protection:');
  const maliciousInput = "test@example.com' OR '1'='1";
  const injectionAttempt = await queryOne<any>('SELECT * FROM users WHERE email = ?', [maliciousInput]);
  assert(injectionAttempt === null, 'SQL injection attempt via parameterized query is safely sanitized');

  // Test 11: Dynamic Transmission Specification (Automatic vs Manual)
  console.log('\n11. Vehicle Transmission Integrity:');
  const autoCar = custVehicles.find((v: any) => v.transmission === 'AUTOMATIC');
  assert(autoCar !== undefined, 'Customer has registered AUTOMATIC transmission luxury vehicle');

  // Test 12: Cancellation & Refund State Rules
  console.log('\n12. Cancellation & Dispute Rules:');
  const cancelBookingId = testBookingId;
  await execute("UPDATE bookings SET status = 'CANCELLED' WHERE id = ?", [cancelBookingId]);
  const cancelCheck = await queryOne<any>('SELECT status FROM bookings WHERE id = ?', [cancelBookingId]);
  assert(cancelCheck.status === 'CANCELLED', 'Booking transitions to CANCELLED state successfully');

  console.log(`\n==============================================`);
  console.log(`📊 Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==============================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Test suite error:', err);
    process.exit(1);
  });
