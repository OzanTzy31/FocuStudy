import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppContext } from "../src/context/AppContext";

const SetHomeLocationScreen: React.FC = () => {
  const { setHomeLocation } = useAppContext();
  const router = useRouter();

  const handleSetDummy = () => {
    // Koordinat dummy, misal Palembang
    setHomeLocation({ lat: -2.9761, lng: 104.7754 });
    Alert.alert("Berhasil", "Lokasi rumah dummy telah disimpan.");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Lokasi Rumah</Text>
      <Text style={styles.text}>
        Pada versi prototype ini, lokasi rumah masih menggunakan{" "}
        <Text style={{ fontWeight: "600" }}>data dummy</Text>. Di pengembangan
        berikutnya, tombol ini akan mengambil koordinat GPS nyata dari
        perangkat.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSetDummy}>
        <Text style={styles.buttonText}>Gunakan Lokasi Dummy</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetHomeLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
