import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { Buffer } from 'buffer';  // Permet d'envoyer des données en binaire

const TARGET_DEVICE_NAME = "SportsLab_Tamagochi";
const SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const RX_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const SENSOR_CHARACTERISTIC_UUID = "f3641402-b000-4042-ba50-05ca45bf8abc";

const BluetoothScreen = () => {
  const [bleManager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [sensorData, setSensorData] = useState<string | null>(null);
  const [status, setStatus] = useState("Prêt à scanner");

  useEffect(() => {
    requestPermissions();
    return () => {
      bleManager.destroy();
    };
  }, []);

  // Demande les permissions BLE pour Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE, 
      ]);
      
      if (
        permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== 'granted' ||
        permissions[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== 'granted' ||
        permissions[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== 'granted'
      ) {
        console.log('Permissions BLE refusées');
        setStatus("Permissions BLE refusées");
      } else {
        console.log('Permissions BLE accordées');
        setStatus("Permissions BLE accordées");
      }
    }
  };

  // Scan pour trouver uniquement "SportsLab_Tamagochi"
  const startScan = () => {
    setStatus("Scan en cours...");
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Erreur de scan :", error);
        setStatus("Erreur de scan");
        return;
      }

      if (device?.name === TARGET_DEVICE_NAME) {
        console.log(`Appareil détecté : ${device.name}`);
        setStatus(`Appareil trouvé : ${device.name}`);
        bleManager.stopDeviceScan();
        connectToDevice(device);
      }
    });

    // Arrêter le scan après 10 secondes
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setStatus("Aucun appareil trouvé");
    }, 10000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      console.log(`Connexion à ${device.name}...`);
      setStatus(`Connexion à ${device.name}...`);
  
      const connectedDevice = await bleManager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      setConnectedDevice(connectedDevice);
      setStatus(`Connecté à ${connectedDevice.name}`);
  
      // 📌 Lister tous les services et caractéristiques
      const services = await connectedDevice.services();
      for (const service of services) {
        console.log(`Service trouvé : ${service.uuid}`);
  
        const characteristics = await connectedDevice.characteristicsForService(service.uuid);
        for (const characteristic of characteristics) {
          console.log(`  ↳ Characteristic : ${characteristic.uuid}`);
          console.log(`     - Readable: ${characteristic.isReadable}`);
          console.log(`     - WritableWithResponse: ${characteristic.isWritableWithResponse}`);
          console.log(`     - WritableWithoutResponse: ${characteristic.isWritableWithoutResponse}`);
          console.log(`     - Notifiable: ${characteristic.isNotifiable}`);
        }
      }
  
      // Activer les notifications seulement si la caractéristique existe
      startSensorNotifications(connectedDevice);
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setStatus("Échec de connexion");
    }
  };
  
  

  // Envoi de commandes
  const sendCommand = async (command: number, value: number = 0) => {
    if (!connectedDevice) return;

    try {
      const data = Buffer.from([command, value]);  // Convertir en buffer binaire
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        RX_CHARACTERISTIC_UUID,
        data.toString('base64')  // Envoyer en base64
      );
      console.log(`Commande envoyée : 0x${command.toString(16)} avec valeur ${value}`);
    } catch (error) {
      console.error("Erreur d'envoi de commande :", error);
    }
  };

  // Activer la réception des données capteur
  const startSensorNotifications = async (device: Device) => {
    try {
      await device.monitorCharacteristicForService(
        SERVICE_UUID,
        SENSOR_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error("Erreur de lecture des capteurs :", error);
            return;
          }

          if (characteristic?.value) {
            const rawData = Buffer.from(characteristic.value, 'base64'); // Convertir en buffer
            setSensorData(rawData.toString('hex')); // Afficher en hexadécimal
            console.log("Données capteur reçues :", rawData);
          }
        }
      );
    } catch (error) {
      console.error("Erreur d'abonnement aux capteurs :", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>{status}</Text>

      {!connectedDevice ? (
        <TouchableOpacity onPress={startScan} style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>Scanner et se connecter</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text>Connecté à {connectedDevice.name}</Text>

          {/* Boutons pour envoyer des commandes */}
          <TouchableOpacity onPress={() => sendCommand(0x1C)} style={{ padding: 10, backgroundColor: 'green', margin: 5 }}>
            <Text style={{ color: 'white' }}>Mettre à jour l'écran</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => sendCommand(0x1D, 50)} style={{ padding: 10, backgroundColor: 'orange', margin: 5 }}>
            <Text style={{ color: 'white' }}>Changer contraste (50)</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => sendCommand(0x1E, 1)} style={{ padding: 10, backgroundColor: 'purple', margin: 5 }}>
            <Text style={{ color: 'white' }}>Allumer le rétroéclairage</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => sendCommand(0x1E, 0)} style={{ padding: 10, backgroundColor: 'gray', margin: 5 }}>
            <Text style={{ color: 'white' }}>Éteindre le rétroéclairage</Text>
          </TouchableOpacity>

          {/* Affichage des données capteur */}
          {sensorData && <Text>Données capteur : {sensorData}</Text>}
        </>
      )}
    </View>
  );
};

export default BluetoothScreen;
