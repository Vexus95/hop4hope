const os = require('os');
const fs = require('fs');

// Function to get the Wi-Fi IPv4 address
function getWifiIPv4() {
  const interfaces = os.networkInterfaces();
  for (const [name, iface] of Object.entries(interfaces)) {
    if (!name.toLowerCase().includes('wi-fi') && !name.toLowerCase().includes('wlan')) continue;
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }
  return 'No Wi-Fi IPv4 address found';
}

// Get the Wi-Fi IP address
const ip = getWifiIPv4();

// Read the existing app.json
const appJsonPath = './app.json';
fs.readFile(appJsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading app.json:', err);
    return;
  }

  // Parse the app.json content
  const appJson = JSON.parse(data);

  // Update the extra field with the Wi-Fi IPv4 address
  appJson.expo.extra = {
    ...appJson.expo.extra,
    REACT_NATIVE_SERVER_IP: ip,
  };

  // Write the updated app.json back to the file
  fs.writeFile(appJsonPath, JSON.stringify(appJson, null, 2), (err) => {
    if (err) {
      console.error('Error writing to app.json:', err);
    } else {
      console.log('Updated app.json with the Wi-Fi IPv4 address');
    }
  });
});
