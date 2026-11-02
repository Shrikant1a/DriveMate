import { User, Vehicle, Driver, Booking, PricingRule, SupportCase, AuditLog } from '../types/index.js';

interface MockDatabase {
  users: User[];
  vehicles: Vehicle[];
  drivers: Driver[];
  bookings: Booking[];
  pricingRules: PricingRule[];
  supportCases: SupportCase[];
  auditLogs: AuditLog[];
}

const STORAGE_KEY = 'drivemate_mock_db_v2';

function getInitialDatabase(): MockDatabase {
  return {
    users: [
      {
        id: 1,
        role: 'ADMIN',
        name: 'Executive Operations Admin',
        email: 'admin@driverondemand.com',
        phone: '+91 99000 11223',
        account_status: 'ACTIVE',
      },
      {
        id: 2,
        role: 'CUSTOMER',
        name: 'Alex Patel',
        email: 'alex.patel@example.com',
        phone: '+91 98200 44556',
        address: 'Penthouse 14B, Marina Tower, Worli, Mumbai',
        emergencyContactName: 'Priya Patel',
        emergencyContactPhone: '+91 98200 11998',
        account_status: 'ACTIVE',
      },
      {
        id: 3,
        role: 'DRIVER',
        name: 'Vikramjit Singh',
        email: 'vikram.singh@example.com',
        phone: '+91 98111 22334',
        approvalStatus: 'APPROVED',
        availability: 'ONLINE',
        ratingAvg: 4.96,
        ratingCount: 148,
        experienceYears: 12,
        bio: '12+ years of executive chauffeur experience. Specialized in luxury German and British sedans. Fluent in English and Hindi with defensive driving certification.',
        account_status: 'ACTIVE',
      },
      {
        id: 4,
        role: 'DRIVER',
        name: 'Rajesh Sharma',
        email: 'rajesh.sharma@example.com',
        phone: '+91 98222 33445',
        approvalStatus: 'APPROVED',
        availability: 'ONLINE',
        ratingAvg: 4.89,
        ratingCount: 96,
        experienceYears: 8,
        bio: 'Punctual, discreet corporate driver with 8 years experience navigating high-density metro traffic and long highway journeys.',
        account_status: 'ACTIVE',
      },
      {
        id: 5,
        role: 'DRIVER',
        name: 'Anita Deshmukh',
        email: 'anita.deshmukh@example.com',
        phone: '+91 98333 44556',
        approvalStatus: 'APPROVED',
        availability: 'ONLINE',
        ratingAvg: 4.98,
        ratingCount: 112,
        experienceYears: 10,
        bio: 'Specialized in VIP events, family travel, and luxury automatic transmission sedans. Patient and certified first responder.',
        account_status: 'ACTIVE',
      },
      {
        id: 6,
        role: 'DRIVER',
        name: 'Suresh Verma',
        email: 'suresh.verma@example.com',
        phone: '+91 98444 55667',
        approvalStatus: 'PENDING',
        availability: 'OFFLINE',
        ratingAvg: 5.0,
        ratingCount: 0,
        experienceYears: 6,
        bio: 'Commercial transport driver applicant awaiting DL verification.',
        account_status: 'ACTIVE',
      },
    ],
    vehicles: [
      {
        id: 1,
        customer_id: 2,
        make: 'Mercedes-Benz',
        model: 'E-Class E350d',
        year: 2023,
        registration_number: 'MH-01-EA-4921',
        transmission: 'AUTOMATIC',
        fuel_type: 'DIESEL',
        notes: 'Air suspension calibrated. Keyless go enabled. Clean interior.',
      },
      {
        id: 2,
        customer_id: 2,
        make: 'BMW',
        model: '5 Series 530i M Sport',
        year: 2024,
        registration_number: 'MH-02-CP-8812',
        transmission: 'AUTOMATIC',
        fuel_type: 'PETROL',
        notes: 'Adaptive sport suspension. Premium sound system.',
      },
      {
        id: 3,
        customer_id: 2,
        make: 'Audi',
        model: 'A6 45 TFSI Technology',
        year: 2022,
        registration_number: 'MH-03-BK-1109',
        transmission: 'AUTOMATIC',
        fuel_type: 'PETROL',
        notes: 'Smooth dual-clutch transmission.',
      },
    ],
    drivers: [
      {
        id: 3,
        name: 'Vikramjit Singh',
        email: 'vikram.singh@example.com',
        phone: '+91 98111 22334',
        experience_years: 12,
        service_area: 'Mumbai Metro & Airport Corridor',
        approval_status: 'APPROVED',
        availability: 'ONLINE',
        rating_avg: 4.96,
        rating_count: 148,
        hourly_rate_paise: 28000,
        bio: '12+ years of executive chauffeur experience. Specialized in luxury German and British sedans. Fluent in English and Hindi with defensive driving certification.',
      },
      {
        id: 4,
        name: 'Rajesh Sharma',
        email: 'rajesh.sharma@example.com',
        phone: '+91 98222 33445',
        experience_years: 8,
        service_area: 'Bandra-Kurla Complex & South Mumbai',
        approval_status: 'APPROVED',
        availability: 'ONLINE',
        rating_avg: 4.89,
        rating_count: 96,
        hourly_rate_paise: 25000,
        bio: 'Punctual, discreet corporate driver with 8 years experience navigating high-density metro traffic and long highway journeys.',
      },
      {
        id: 5,
        name: 'Anita Deshmukh',
        email: 'anita.deshmukh@example.com',
        phone: '+91 98333 44556',
        experience_years: 10,
        service_area: 'Thane & Western Suburbs',
        approval_status: 'APPROVED',
        availability: 'ONLINE',
        rating_avg: 4.98,
        rating_count: 112,
        hourly_rate_paise: 27000,
        bio: 'Specialized in VIP events, family travel, and luxury automatic transmission sedans. Patient and certified first responder.',
      },
    ],
    bookings: [
      {
        id: 101,
        reference_code: 'DOD-2026-8812',
        customer_id: 2,
        vehicle_id: 2,
        driver_id: 3,
        trip_type: 'Hourly Booking',
        pickup_address: 'Penthouse 14B, Marina Tower, Worli, Mumbai',
        destination_address: 'The Taj Mahal Palace, Colaba, Mumbai',
        start_time: new Date(Date.now() + 3600000 * 2).toISOString(),
        duration_hours: 4,
        status: 'ACCEPTED',
        estimated_fare_paise: 136900,
        final_fare_paise: 136900,
        platform_fee_paise: 20500,
        driver_payout_paise: 116400,
        make: 'BMW',
        model: '5 Series 530i M Sport',
        year: 2024,
        registration_number: 'MH-02-CP-8812',
        transmission: 'AUTOMATIC',
        fuel_type: 'PETROL',
        customer_name: 'Alex Patel',
        customer_phone: '+91 98200 44556',
        driver_name: 'Vikramjit Singh',
        driver_phone: '+91 98111 22334',
        driver_rating: 4.96,
        driver_experience: 12,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 102,
        reference_code: 'DOD-2026-4921',
        customer_id: 2,
        vehicle_id: 1,
        driver_id: 3,
        trip_type: 'Airport Transfer',
        pickup_address: 'Terminal 2, Chhatrapati Shivaji Maharaj International Airport',
        destination_address: 'Worli Sea Face, Mumbai',
        start_time: new Date(Date.now() - 3600000 * 48).toISOString(),
        duration_hours: 3,
        status: 'COMPLETED',
        estimated_fare_paise: 108900,
        final_fare_paise: 108900,
        platform_fee_paise: 16300,
        driver_payout_paise: 92600,
        make: 'Mercedes-Benz',
        model: 'E-Class E350d',
        year: 2023,
        registration_number: 'MH-01-EA-4921',
        transmission: 'AUTOMATIC',
        customer_name: 'Alex Patel',
        driver_name: 'Vikramjit Singh',
        driver_rating: 4.96,
        review_rating: 5,
        review_comment: 'Superb driving on the coastal road. Vikram was very polite, punctual and handled my E-Class with extreme care.',
        created_at: new Date(Date.now() - 3600000 * 50).toISOString(),
      },
    ],
    pricingRules: [
      {
        id: 1,
        service_area: 'Mumbai Metro',
        trip_type: 'Hourly Booking',
        base_fee_paise: 24900,
        hourly_rate_paise: 25000,
        min_hours: 2,
        waiting_rate_paise_per_hr: 15000,
        platform_commission_pct: 15,
        is_active: true,
      },
      {
        id: 2,
        service_area: 'Pune Metro',
        trip_type: 'Hourly Booking',
        base_fee_paise: 24900,
        hourly_rate_paise: 22000,
        min_hours: 2,
        waiting_rate_paise_per_hr: 12000,
        platform_commission_pct: 15,
        is_active: true,
      },
      {
        id: 3,
        service_area: 'Interstate / Outstation',
        trip_type: 'Outstation Long Distance',
        base_fee_paise: 49900,
        hourly_rate_paise: 28000,
        min_hours: 8,
        waiting_rate_paise_per_hr: 20000,
        platform_commission_pct: 15,
        is_active: true,
      },
    ],
    supportCases: [
      {
        id: 1,
        creator_id: 2,
        creator_name: 'Alex Patel',
        creator_email: 'alex.patel@example.com',
        category: 'Trip Inquiry',
        subject: 'Request for recurring weekly chauffeur',
        description: 'I would like to retain Vikramjit Singh for my recurring Tuesday & Thursday corporate commutes.',
        status: 'OPEN',
        created_at: new Date().toISOString(),
      },
    ],
    auditLogs: [
      {
        id: 1,
        actor_id: 1,
        actor_name: 'Executive Operations Admin',
        action: 'DRIVER_VERIFICATION_APPROVED',
        target_type: 'DRIVER',
        target_id: 3,
        created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
      {
        id: 2,
        actor_id: 1,
        actor_name: 'Executive Operations Admin',
        action: 'PRICING_RULE_UPDATED',
        target_type: 'PRICING',
        target_id: 1,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ],
  };
}

function loadDb(): MockDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse mock database from localStorage', e);
  }
  const init = getInitialDatabase();
  saveDb(init);
  return init;
}

function saveDb(db: MockDatabase) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Failed to save mock database to localStorage', e);
  }
}

export function getCurrentSessionUser(): User | null {
  try {
    const userRaw = localStorage.getItem('dod_user');
    if (userRaw) {
      return JSON.parse(userRaw);
    }
  } catch {}
  return null;
}

export function setCurrentSessionUser(user: User | null) {
  if (user) {
    localStorage.setItem('dod_user', JSON.stringify(user));
    localStorage.setItem('dod_token', `demo_jwt_token_${user.id}`);
  } else {
    localStorage.removeItem('dod_user');
    localStorage.removeItem('dod_token');
  }
}

/**
 * Client-Side Demo Mock Handler
 * Handles requests locally whenever the backend is offline or returns 404 (e.g. Netlify static hosting).
 */
export async function handleMockRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const db = loadDb();
  let body: any = {};
  if (options.body && typeof options.body === 'string') {
    try {
      body = JSON.parse(options.body);
    } catch {}
  }

  // Artificial short delay to make UI feel realistic
  await new Promise((resolve) => setTimeout(resolve, 150));

  console.info(`[DriveMate Demo Engine] ${method} ${endpoint}`, body);

  // 1. AUTH: REGISTER CUSTOMER
  if (endpoint === '/auth/register' && method === 'POST') {
    const existing = db.users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());
    let user: User;
    if (existing) {
      user = {
        ...existing,
        name: body.name || existing.name,
        phone: body.phone || existing.phone,
        address: body.address || existing.address,
      };
    } else {
      user = {
        id: Date.now(),
        role: 'CUSTOMER',
        name: body.name || 'Valued Customer',
        email: body.email,
        phone: body.phone || '+91 98000 00000',
        address: body.address || 'Pune, Maharashtra',
        account_status: 'ACTIVE',
        created_at: new Date().toISOString(),
      };
      db.users.push(user);

      // Pre-create a starter luxury car in customer's garage so they can book immediately
      db.vehicles.push({
        id: Date.now() + 1,
        customer_id: user.id,
        make: 'BMW',
        model: '5 Series 530i M Sport',
        year: 2024,
        registration_number: 'MH-12-DM-2026',
        transmission: 'AUTOMATIC',
        fuel_type: 'PETROL',
        notes: 'Personal luxury sedan in pristine condition. Keyless start.',
      });
      saveDb(db);
    }

    setCurrentSessionUser(user);
    return {
      message: 'Registration successful',
      userId: user.id,
      token: `demo_jwt_token_${user.id}`,
      user,
    } as unknown as T;
  }

  // 2. AUTH: REGISTER DRIVER
  if (endpoint === '/auth/register-driver' && method === 'POST') {
    const existing = db.users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());
    let user: User;
    if (existing) {
      user = existing;
    } else {
      user = {
        id: Date.now(),
        role: 'DRIVER',
        name: body.name || 'Professional Driver',
        email: body.email,
        phone: body.phone || '+91 98000 00000',
        experienceYears: Number(body.experienceYears) || 5,
        serviceArea: body.serviceArea || 'Mumbai Metro & Airport Corridor',
        approvalStatus: 'APPROVED', // Pre-approve for instant evaluation
        availability: 'ONLINE',
        ratingAvg: 4.95,
        ratingCount: 1,
        account_status: 'ACTIVE',
        created_at: new Date().toISOString(),
      };
      db.users.push(user);

      db.drivers.push({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        experience_years: user.experienceYears || 5,
        service_area: user.serviceArea || 'Mumbai Metro',
        approval_status: 'APPROVED',
        availability: 'ONLINE',
        rating_avg: 4.95,
        rating_count: 1,
        hourly_rate_paise: 25000,
        bio: 'Dedicated professional chauffeur with clean track record.',
      });
      saveDb(db);
    }

    setCurrentSessionUser(user);
    return {
      message: 'Driver registered successfully',
      userId: user.id,
      token: `demo_jwt_token_${user.id}`,
      user,
    } as unknown as T;
  }

  // 3. AUTH: LOGIN
  if (endpoint === '/auth/login' && method === 'POST') {
    const email = (body.email || '').toLowerCase().trim();
    let user = db.users.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      // If logging in with an email not yet in database, auto-create account for seamless demo testing
      const isDriver = email.includes('driver');
      const isAdmin = email.includes('admin');
      user = {
        id: Date.now(),
        role: isAdmin ? 'ADMIN' : isDriver ? 'DRIVER' : 'CUSTOMER',
        name: email.split('@')[0].replace('.', ' ').replace(/^./, (s: string) => s.toUpperCase()),
        email: body.email,
        phone: '+91 98000 00000',
        account_status: 'ACTIVE',
        approvalStatus: 'APPROVED',
        availability: 'ONLINE',
        ratingAvg: 4.95,
      };
      db.users.push(user);
      if (user.role === 'CUSTOMER') {
        db.vehicles.push({
          id: Date.now() + 1,
          customer_id: user.id,
          make: 'BMW',
          model: '5 Series 530i M Sport',
          year: 2024,
          registration_number: 'MH-12-DM-2026',
          transmission: 'AUTOMATIC',
          fuel_type: 'PETROL',
          notes: 'Personal luxury sedan in pristine condition.',
        });
      }
      saveDb(db);
    }

    setCurrentSessionUser(user);
    return {
      token: `demo_jwt_token_${user.id}`,
      user,
    } as unknown as T;
  }

  // 4. AUTH: GET ME
  if (endpoint === '/auth/me') {
    const user = getCurrentSessionUser() || db.users[1]; // Fallback to Alex Patel
    return { user } as unknown as T;
  }

  // 5. AUTH: LOGOUT
  if (endpoint === '/auth/logout') {
    setCurrentSessionUser(null);
    return { message: 'Logged out successfully' } as unknown as T;
  }

  // 6. VEHICLES: GET
  if (endpoint === '/vehicles' && method === 'GET') {
    const current = getCurrentSessionUser();
    const customerId = current ? current.id : 2;
    let vehicles = db.vehicles.filter((v) => v.customer_id === customerId);

    // If customer has no vehicles yet, provide BMW default
    if (vehicles.length === 0) {
      const defaultCar: Vehicle = {
        id: Date.now(),
        customer_id: customerId,
        make: 'BMW',
        model: '5 Series 530i M Sport',
        year: 2024,
        registration_number: 'MH-12-DM-2026',
        transmission: 'AUTOMATIC',
        fuel_type: 'PETROL',
        notes: 'Personal luxury sedan in pristine condition.',
      };
      db.vehicles.push(defaultCar);
      saveDb(db);
      vehicles = [defaultCar];
    }
    return { vehicles } as unknown as T;
  }

  // 7. VEHICLES: ADD
  if (endpoint === '/vehicles' && method === 'POST') {
    const current = getCurrentSessionUser();
    const customerId = current ? current.id : 2;
    const newCar: Vehicle = {
      id: Date.now(),
      customer_id: customerId,
      make: body.make || 'BMW',
      model: body.model || '5 Series',
      year: Number(body.year) || 2024,
      registration_number: body.registration_number || 'MH-01-DM-9999',
      transmission: body.transmission || 'AUTOMATIC',
      fuel_type: body.fuel_type || 'PETROL',
      notes: body.notes || 'Personal luxury car',
      created_at: new Date().toISOString(),
    };
    db.vehicles.push(newCar);
    saveDb(db);
    return { message: 'Vehicle added successfully', vehicle: newCar } as unknown as T;
  }

  // 8. VEHICLES: DELETE
  if (endpoint.startsWith('/vehicles/') && method === 'DELETE') {
    const id = Number(endpoint.split('/')[2]);
    db.vehicles = db.vehicles.filter((v) => v.id !== id);
    saveDb(db);
    return { message: 'Vehicle deleted successfully' } as unknown as T;
  }

  // 9. DRIVERS: AVAILABLE
  if (endpoint.startsWith('/drivers/available') && method === 'GET') {
    return { drivers: db.drivers } as unknown as T;
  }

  // 10. DRIVERS: STATUS
  if (endpoint === '/drivers/me/status' && method === 'GET') {
    const current = getCurrentSessionUser();
    return {
      profile: {
        id: current?.id || 3,
        name: current?.name || 'Vikramjit Singh',
        email: current?.email || 'vikram.singh@example.com',
        approval_status: current?.approvalStatus || 'APPROVED',
        availability: current?.availability || 'ONLINE',
        rating_avg: current?.ratingAvg || 4.96,
        rating_count: current?.ratingCount || 148,
        experience_years: current?.experienceYears || 12,
        service_area: current?.serviceArea || 'Mumbai Metro & Airport Corridor',
        hourly_rate_paise: 28000,
      },
      documents: [
        {
          id: 1,
          driver_id: current?.id || 3,
          document_type: 'DRIVING_LICENSE',
          file_path: '/uploads/dl-demo.jpg',
          review_status: 'VERIFIED',
          created_at: new Date().toISOString(),
        },
      ],
    } as unknown as T;
  }

  // 11. DRIVERS: AVAILABILITY
  if (endpoint === '/drivers/me/availability' && method === 'PATCH') {
    const current = getCurrentSessionUser();
    if (current) {
      current.availability = body.availability;
      setCurrentSessionUser(current);
    }
    return { message: 'Availability updated', availability: body.availability } as unknown as T;
  }

  // 12. DRIVERS: EARNINGS
  if (endpoint === '/drivers/me/earnings' && method === 'GET') {
    return {
      totalTrips: 18,
      totalHours: 72,
      grossPaise: 2016000,
      commissionPaise: 302400,
      netPayoutPaise: 1713600,
    } as unknown as T;
  }

  // 13. DRIVERS: INCOMING REQUESTS
  if (endpoint === '/drivers/me/incoming-requests' && method === 'GET') {
    const reqs = db.bookings.filter((b) => b.status === 'REQUESTED' || b.status === 'SEARCHING');
    return { requests: reqs } as unknown as T;
  }

  // 14. BOOKINGS: QUOTE
  if (endpoint === '/bookings/quote' && method === 'POST') {
    const duration = Number(body.durationHours) || 4;
    const baseFee = 24900;
    const hourlyRate = 25000;
    const total = baseFee + duration * hourlyRate;
    const commission = Math.round(total * 0.15);
    return {
      quote: {
        baseFeePaise: baseFee,
        hourlyRatePaise: hourlyRate,
        durationHours: duration,
        estimatedFarePaise: total,
        platformFeePaise: commission,
        driverPayoutPaise: total - commission,
      },
    } as unknown as T;
  }

  // 15. BOOKINGS: CREATE
  if (endpoint === '/bookings' && method === 'POST') {
    const current = getCurrentSessionUser();
    const customerId = current ? current.id : 2;
    const duration = Number(body.duration_hours) || 4;
    const fare = 24900 + duration * 25000;

    const matchedVeh = db.vehicles.find((v) => v.id === body.vehicle_id) || db.vehicles[0];
    const matchedDrv = db.drivers.find((d) => d.id === body.driver_id) || db.drivers[0];

    const newBooking: Booking = {
      id: Date.now(),
      reference_code: `DOD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: customerId,
      vehicle_id: body.vehicle_id || matchedVeh?.id || 1,
      driver_id: body.driver_id || matchedDrv?.id || 3,
      trip_type: body.trip_type || 'Hourly Booking',
      pickup_address: body.pickup_address || 'Penthouse 14B, Marina Tower, Worli, Mumbai',
      destination_address: body.destination_address || 'The Taj Mahal Palace, Colaba, Mumbai',
      start_time: body.start_time || new Date().toISOString(),
      duration_hours: duration,
      status: 'ACCEPTED',
      estimated_fare_paise: fare,
      final_fare_paise: fare,
      platform_fee_paise: Math.round(fare * 0.15),
      driver_payout_paise: Math.round(fare * 0.85),
      notes: body.notes || 'Customer personal vehicle.',
      created_at: new Date().toISOString(),
      make: matchedVeh?.make || 'BMW',
      model: matchedVeh?.model || '5 Series 530i M Sport',
      year: matchedVeh?.year || 2024,
      registration_number: matchedVeh?.registration_number || 'MH-12-DM-2026',
      transmission: matchedVeh?.transmission || 'AUTOMATIC',
      fuel_type: matchedVeh?.fuel_type || 'PETROL',
      customer_name: current?.name || 'Alex Patel',
      customer_phone: current?.phone || '+91 98200 44556',
      driver_name: matchedDrv?.name || 'Vikramjit Singh',
      driver_phone: matchedDrv?.phone || '+91 98111 22334',
      driver_rating: matchedDrv?.rating_avg || 4.96,
      driver_experience: matchedDrv?.experience_years || 12,
    };

    db.bookings.unshift(newBooking);
    saveDb(db);
    return { message: 'Booking confirmed successfully', booking: newBooking } as unknown as T;
  }

  // 16. BOOKINGS: GET ALL
  if (endpoint === '/bookings' && method === 'GET') {
    return { bookings: db.bookings } as unknown as T;
  }

  // 17. BOOKINGS: CANCEL / STATUS
  if (endpoint.includes('/cancel') && method === 'POST') {
    const id = Number(endpoint.split('/')[2]);
    const b = db.bookings.find((item) => item.id === id);
    if (b) {
      b.status = 'CANCELLED';
      saveDb(db);
    }
    return { message: 'Booking cancelled' } as unknown as T;
  }

  if (endpoint.includes('/reviews') && method === 'POST') {
    const id = Number(endpoint.split('/')[2]);
    const b = db.bookings.find((item) => item.id === id);
    if (b) {
      b.review_rating = body.rating || 5;
      b.review_comment = body.comment || '';
      saveDb(db);
    }
    return { message: 'Review submitted successfully' } as unknown as T;
  }

  // 18. ADMIN: SUMMARY
  if (endpoint === '/admin/summary' && method === 'GET') {
    return {
      metrics: {
        totalBookings: db.bookings.length + 140,
        activeTrips: db.bookings.filter((b) => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS').length || 4,
        verifiedDrivers: db.drivers.length + 18,
        grossBookingValuePaise: 38400000,
        platformRevenuePaise: 5760000,
        pendingDriversCount: 1,
      },
    } as unknown as T;
  }

  // 19. ADMIN: DRIVERS / USERS / PRICING / AUDIT
  if (endpoint.startsWith('/admin/drivers')) {
    return { drivers: db.drivers } as unknown as T;
  }
  if (endpoint.startsWith('/admin/users')) {
    return { users: db.users } as unknown as T;
  }
  if (endpoint.startsWith('/admin/pricing')) {
    return { rules: db.pricingRules } as unknown as T;
  }
  if (endpoint.startsWith('/admin/audit-logs')) {
    return { logs: db.auditLogs } as unknown as T;
  }

  // 20. SUPPORT
  if (endpoint === '/support' && method === 'GET') {
    return { cases: db.supportCases } as unknown as T;
  }
  if (endpoint === '/support' && method === 'POST') {
    const current = getCurrentSessionUser();
    const newCase: SupportCase = {
      id: Date.now(),
      creator_id: current?.id || 2,
      creator_name: current?.name || 'Customer',
      creator_email: current?.email || 'customer@example.com',
      category: body.category || 'General',
      subject: body.subject || 'Support Ticket',
      description: body.description || '',
      status: 'OPEN',
      created_at: new Date().toISOString(),
    };
    db.supportCases.unshift(newCase);
    saveDb(db);
    return { message: 'Support ticket submitted', case: newCase } as unknown as T;
  }

  // Fallback generic response
  return { success: true } as unknown as T;
}

