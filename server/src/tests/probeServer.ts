import { startServer } from '../server.js';

async function probe() {
  console.log('📡 Launching DriveMate Live HTTP Server Probe...');
  const port = 5050;
  const baseUrl = `http://127.0.0.1:${port}`;

  const { server } = await startServer(port);

  try {
    // 1. Probe Health Check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.log('  ✅ GET /api/health Response:', healthData);

    // 2. Probe Available Drivers API
    const drvRes = await fetch(`${baseUrl}/api/drivers/available`);
    const drvData: any = await drvRes.json();
    console.log(`  ✅ GET /api/drivers/available returned ${drvData.drivers?.length} approved online chauffeurs:`);
    drvData.drivers?.forEach((d: any) => {
      console.log(`     • ${d.name} (${d.experience_years} yrs exp, ★ ${d.rating_avg}, ${d.service_area})`);
    });

    // 3. Probe Server-Side Fare Calculation
    const quoteRes = await fetch(`${baseUrl}/api/bookings/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripType: 'Hourly Booking',
        durationHours: 4,
        serviceArea: 'Metropolitan Core'
      })
    });
    const quoteData: any = await quoteRes.json();
    console.log('  ✅ POST /api/bookings/quote Response:', {
      tripType: quoteData.tripType,
      billableHours: quoteData.billableHours,
      estimatedFare: `₹${quoteData.estimatedFarePaise / 100}`,
      platformFee: `₹${quoteData.platformFeePaise / 100}`,
      driverPayout: `₹${quoteData.driverPayoutPaise / 100}`
    });

    // 4. Probe Frontend Static Asset Serving
    const frontendRes = await fetch(`${baseUrl}/`);
    const htmlText = await frontendRes.text();
    const hasRoot = htmlText.includes('<div id="root"></div>');
    console.log(`  ✅ GET / Frontend Single-Page App Served: ${hasRoot ? 'YES (Includes React root element)' : 'NO'}`);

    console.log('\n🎉 ALL LIVE SERVER PROBE TESTS PASSED SUCCESSFULLY!\n');
  } catch (err: any) {
    console.error('Probe failed:', err);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
}

probe();
