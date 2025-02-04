import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from 'expo-constants';

// Configuration des UUID de service et caractéristique
const SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const RX_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

const REACT_NATIVE_SERVER_IP = Constants.expoConfig?.extra?.REACT_NATIVE_SERVER_IP;

if (!REACT_NATIVE_SERVER_IP) {
  throw new Error('REACT_NATIVE_SERVER_IP is not defined in app.config.js or app.json');
}

// Fonction pour convertir une matrice de bits en tableau d'octets
function convertMatrixToByteArray(matrix: number[]): number[] {
  const byteArray = [];

  for (let i = 0; i < matrix.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte <<= 1;
      byte |= matrix[i + j] ? 1 : 0;
    }
    byteArray.push(byte);
  }

  return byteArray;
}

const BluetoothImageSender = () => {
  const [bleManager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [status, setStatus] = useState("Prêt à scanner");
  const [matrice, setMatrice] = useState<number[] | null>(null);

  // Création de données d'image avec la matrice récupérée
  const createSimpleImageBuffers = (mat: number[]): Uint8Array[] => {
    const byteArray = convertMatrixToByteArray(mat);
    return [
      new Uint8Array([0x1B, 0x00, ...byteArray.slice(0, 166)]),   // Premier buffer
      new Uint8Array([0x1B, 0x01, ...byteArray.slice(166, 332)]), // Deuxième buffer
      new Uint8Array([0x1B, 0x02, ...byteArray.slice(332, 498)])  // Troisième buffer
    ];
  };

  useEffect(() => {
    requestPermissions();
    return () => {
      bleManager.destroy();
    };
  }, []);

  const API_URL = `http://${REACT_NATIVE_SERVER_IP}:5000/users`;
  const getCharactersMatrice = async (): Promise<number[]> => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("Token non trouvé");
      }

      const response = await axios.get(`${API_URL}/characters`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const hexMatrice = response.data[0].matrice;
      const bitArray: number[] = [];
      for (let i = 0; i < hexMatrice.length; i += 2) {
        const byte = parseInt(hexMatrice.substr(i, 2), 16);
        for (let j = 7; j >= 0; j--) {
          bitArray.push((byte >> j) & 1);
        }
      }

      setMatrice(bitArray);
      return bitArray;
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      throw error;
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        ]);

        const isPermissionsGranted = 
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' &&
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === 'granted' &&
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'granted';

        setStatus(isPermissionsGranted ? "Permissions BLE accordées" : "Permissions BLE refusées");
      } catch (err) {
        console.error("Erreur de permissions", err);
        setStatus("Erreur de permissions BLE");
      }
    }
  };

  const startScan = () => {
    setStatus("Scan en cours...");
    
    bleManager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        console.error("Erreur de scan :", error);
        setStatus("Erreur de scan");
        return;
      }

      if (device?.name === "SportsLab_Tamagochi") {
        bleManager.stopDeviceScan();
        
        try {
          const mat = await getCharactersMatrice();
          await connectToDevice(device);
        } catch (error) {
          console.error("Erreur lors de la récupération de la matrice :", error);
          setStatus("Échec de récupération de la matrice");
        }
      }
    });
  
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setStatus("Scan terminé");
    }, 10000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      setStatus(`Connexion à ${device.name}...`);
      const connectedDevice = await bleManager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      setConnectedDevice(connectedDevice);
      setStatus(`Connecté à ${connectedDevice.name}`);
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setStatus("Échec de connexion");
    }
  };
  
  const sendBuffer = async (buffer: Uint8Array) => {
    if (!connectedDevice) {
      console.error("Aucun appareil connecté");
      return;
    }

    try {
      const base64Data = Buffer.from(buffer).toString("base64");
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        RX_CHARACTERISTIC_UUID,
        base64Data
      );
      console.log(`Buffer envoyé: ${buffer[1]}`);
    } catch (error) {
      console.error("Erreur d'envoi du buffer :", error);
    }
  };

  const sendImageToScreen = async () => {
    if (!connectedDevice) {
      setStatus("Connectez un appareil d'abord");
      return;
    }

    if (!matrice) {
      setStatus("Matrice non récupérée");
      return;
    }

    try {
      const buffers = createSimpleImageBuffers(matrice);

      for (const buffer of buffers) {
        await sendBuffer(buffer);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      await sendBuffer(new Uint8Array([0x1C]));
      setStatus("Image envoyée");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image :", error);
      setStatus("Échec de l'envoi de l'image");
    }
  };

  const sendCommand = async (command: number, value: number = 0) => {
    if (!connectedDevice) return;

    try {
      const data = Buffer.from([command, value]);
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        RX_CHARACTERISTIC_UUID,
        data.toString('base64')
      );
      console.log(`Commande envoyée : 0x${command.toString(16)} avec valeur ${value}`);
    } catch (error) {
      console.error("Erreur d'envoi de commande :", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{status}</Text>
      <TouchableOpacity onPress={() => sendCommand(0x1D, 100)} style={{ padding: 10, backgroundColor: 'orange', margin: 5 }}>
        <Text style={{ color: 'white' }}>Changer contraste (120)</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => sendCommand(0x1E, 1)} style={{ padding: 10, backgroundColor: 'purple', margin: 5 }}>
        <Text style={{ color: 'white' }}>Allumer le rétroéclairage</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => sendCommand(0x1E, 0)} style={{ padding: 10, backgroundColor: 'black', margin: 5 }}>
        <Text style={{ color: 'white' }}>Eteindre le rétroéclairage</Text>
      </TouchableOpacity>
      {!connectedDevice ? (
        <TouchableOpacity style={styles.button} onPress={startScan}>
          <Text style={styles.buttonText}>Scanner et se connecter</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={sendImageToScreen}>
          <Text style={styles.buttonText}>Envoyer 3 points noirs</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  statusText: {
    marginBottom: 20,
    fontSize: 16
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  }
});

export default BluetoothImageSender;