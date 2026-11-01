import { startServer } from '../server.js';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

async function capture() {
  console.log('🚀 Starting DriveMate server for browser capture...');
  const server = await startServer(5050);

  const desktopScreenshot = 'C:\\Users\\shrik\\.gemini\\antigravity\\brain\\5523a657-8079-400a-af2b-382cc450eb4e\\drivemate_browser_desktop.png';
  const mobileScreenshot = 'C:\\Users\\shrik\\.gemini\\antigravity\\brain\\5523a657-8079-400a-af2b-382cc450eb4e\\drivemate_browser_mobile.png';

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  console.log('📸 Taking Desktop Screenshot (1920x1080)...');
  execSync(`"${chromePath}" --headless --disable-gpu --virtual-time-budget=3000 --window-size=1920,1080 --screenshot="${desktopScreenshot}" http://localhost:5050`, {
    stdio: 'inherit'
  });

  console.log('📸 Taking Mobile Screenshot (390x844)...');
  execSync(`"${chromePath}" --headless --disable-gpu --virtual-time-budget=3000 --window-size=390,844 --screenshot="${mobileScreenshot}" http://localhost:5050`, {
    stdio: 'inherit'
  });

  console.log('✅ Verifying files on disk:');
  console.log('Desktop Screenshot exists:', fs.existsSync(desktopScreenshot), 'Size:', fs.statSync(desktopScreenshot).size, 'bytes');
  console.log('Mobile Screenshot exists:', fs.existsSync(mobileScreenshot), 'Size:', fs.statSync(mobileScreenshot).size, 'bytes');

  console.log('🛑 Shutting down test server...');
  server.close(() => {
    console.log('Server closed successfully.');
    process.exit(0);
  });
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});

