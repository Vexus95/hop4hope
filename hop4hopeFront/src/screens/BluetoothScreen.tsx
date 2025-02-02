import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

const SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const RX_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

const BluetoothScreen = () => {
  const [bleManager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    requestPermissions();
    return () => {
      bleManager.destroy();
    };
  }, []);

  // Demande les permissions BLE (Android uniquement)
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ]);
      
      // Vérifie si les permissions sont accordées
      if (
        permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== 'granted' ||
        permissions[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== 'granted' ||
        permissions[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== 'granted'
      ) {
        console.log('Permissions manquantes');
      } else {
        console.log('Permissions accordées');
      }
    }
  };

// Scan des appareils BLE
const startScan = () => {
    console.log('Démarrage du scan...');
    setDevices([]); // Réinitialise la liste des appareils
  
    // Lancer le scan sans spécifier scanMode
    bleManager.startDeviceScan([SERVICE_UUID], {}, (error, device) => {
      if (error) {
        console.error("Erreur de scan:", error);
        return;
      }
  
      // Log de tous les appareils détectés
      console.log('Appareil détecté :', device?.name);
  
      if (device && device.name?.startsWith("K950")) {
        setDevices((prevDevices) => {
          const exists = prevDevices.some(d => d.id === device.id);
          return exists ? prevDevices : [...prevDevices, device];
        });
      }
    });
  
    // Arrêter le scan après 10 secondes
    setTimeout(() => {
      console.log('Arrêt du scan');
      bleManager.stopDeviceScan();
    }, 10000);
  };
  
  
  
  // Connexion à un appareil BLE
  const connectToDevice = async (device: Device) => {
    try {
      console.log(`Connexion à ${device.name}...`);
      const connectedDevice = await bleManager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connectedDevice);
      console.log("Connecté à :", connectedDevice.name);
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={startScan} style={{ padding: 10, backgroundColor: 'blue', margin: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Scanner les appareils</Text>
      </TouchableOpacity>

      {connectedDevice ? (
        <Text style={{ textAlign: 'center', margin: 10 }}>Connecté à {connectedDevice.name}</Text>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => connectToDevice(item)} style={{ padding: 10, backgroundColor: 'lightgray', margin: 5 }}>
              <Text>{item.name} ({item.id})</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default BluetoothScreen;
