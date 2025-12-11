import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Schedule, useAppContext } from "../src/context/AppContext";

const HomeScreen: React.FC = () => {
  const { homeLocation, schedules, markDone } = useAppContext();
  const router = useRouter();

  const handleCheckReminder = () => {
    if (!schedules.length) {
      Alert.alert("Reminder", "Belum ada jadwal belajar.");
      return;
    }

    const next = schedules.find((item) => item.status === "pending");
    if (!next) {
      Alert.alert("Reminder", "Semua jadwal sudah selesai ✅");
      return;
    }

    Alert.alert(
      "Contoh Reminder",
      `Jangan lupa belajar: ${next.subject} jam ${next.time}`
    );
  };

  const renderItem = ({ item }: { item: Schedule }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.info}>
          {item.date} • {item.time}
        </Text>
        {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
      </View>
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.status,
            item.status === "done" ? styles.statusDone : styles.statusPending,
          ]}
        >
          {item.status === "done" ? "Selesai" : "Belum"}
        </Text>
        {item.status !== "done" && (
          <TouchableOpacity onPress={() => markDone(item.id)}>
            <Text style={styles.link}>Tandai selesai</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Card status lokasi rumah */}
      <View style={styles.homeCard}>
        <Text style={styles.homeTitle}>Lokasi Rumah</Text>
        {homeLocation ? (
          <>
            <Text style={styles.homeText}>Lokasi rumah sudah disimpan ✅</Text>
            <Text style={styles.homeTextSmall}>
              Lat: {homeLocation.lat.toFixed(4)} | Lng:{" "}
              {homeLocation.lng.toFixed(4)}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.homeText}>Lokasi rumah belum disetel.</Text>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => router.push("/setHomeLocation")}
            >
              <Text style={styles.smallButtonText}>Set Lokasi Rumah</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Tombol cek reminder */}
      <TouchableOpacity
        style={styles.reminderButton}
        onPress={handleCheckReminder}
      >
        <Text style={styles.reminderButtonText}>Cek Reminder</Text>
      </TouchableOpacity>

      {/* List jadwal */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Jadwal Belajar</Text>
        <TouchableOpacity onPress={() => router.push("/addSchedule")}>
          <Text style={styles.link}>+ Tambah Jadwal</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  homeCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginBottom: 12,
    elevation: 2,
  },
  homeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  homeText: {
    fontSize: 14,
  },
  homeTextSmall: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  smallButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#2563eb",
    borderRadius: 6,
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  reminderButton: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#22c55e",
    alignItems: "center",
    marginBottom: 16,
  },
  reminderButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "500",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  subject: {
    fontSize: 15,
    fontWeight: "600",
  },
  info: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  note: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
  },
  statusContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  statusPending: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
  statusDone: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
});
