import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Schedule, useAppContext } from "../src/context/AppContext";

const parseScheduleDateTime = (s: Schedule): Date | null => {
  try {
    const [year, month, day] = s.date.split("-").map(Number);
    const [hour, minute] = s.time.split(":").map(Number);

    if (!year || !month || !day || hour === undefined || minute === undefined) {
      return null;
    }

    return new Date(year, month - 1, day, hour, minute);
  } catch {
    return null;
  }
};

const HomeScreen: React.FC = () => {
  const {
    homeLocation,
    schedules,
    markDone,
    deleteSchedule,
    loadingSchedules,
  } = useAppContext();

  const router = useRouter();

  // ====== STATE UNTUK TIPS DARI SERVER (CLIENT–SERVER) ======
  const [tip, setTip] = useState<string | null>(null);
  const [tipLoading, setTipLoading] = useState(false);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        setTipLoading(true);
        // free API sederhana (client -> server)
        const res = await fetch("https://api.adviceslip.com/advice");
        const json = await res.json();
        setTip(json.slip?.advice ?? null);
      } catch (err) {
        console.log("Gagal mengambil tips:", err);
        setTip(null);
      } finally {
        setTipLoading(false);
      }
    };

    fetchTip();
  }, []);

  // ====== JADWAL TERDEKAT (PENDING) ======
  const nextSchedule = useMemo(() => {
    if (!schedules.length) return null;

    const now = new Date();

    const upcoming = schedules
      .filter((s) => s.status === "pending")
      .map((s) => ({
        schedule: s,
        dt: parseScheduleDateTime(s),
      }))
      .filter((item) => item.dt && item.dt.getTime() >= now.getTime())
      .sort((a, b) => a.dt!.getTime() - b.dt!.getTime());

    if (!upcoming.length) return null;
    return upcoming[0];
  }, [schedules]);

  // ====== SIMULASI "CEK REMINDER" ======
  const handleCheckReminder = () => {
    if (!schedules.length) {
      Alert.alert("Reminder", "Belum ada jadwal belajar.");
      return;
    }

    const pending = schedules.filter((s) => s.status === "pending");
    if (!pending.length) {
      Alert.alert("Reminder", "Semua jadwal sudah selesai ✅");
      return;
    }

    const target = nextSchedule?.schedule ?? pending[0];

    Alert.alert(
      "Contoh Reminder",
      `Jangan lupa belajar: ${target.subject} pada ${target.time} (${target.date})`
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

        {/* Tombol Hapus */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Hapus Jadwal",
              `Yakin mau menghapus jadwal "${item.subject}"?`,
              [
                { text: "Batal", style: "cancel" },
                {
                  text: "Hapus",
                  style: "destructive",
                  onPress: () => deleteSchedule(item.id),
                },
              ]
            );
          }}
        >
          <Text style={[styles.link, { color: "#b91c1c", marginTop: 4 }]}>
            Hapus
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Lokasi rumah */}
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

      {/* Tips fokus dari server (client–server) */}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Tips Fokus (dari server)</Text>
        <Text style={styles.tipText}>
          {tipLoading
            ? "Mengambil tips dari server..."
            : tip || "Gagal memuat tips, coba buka ulang aplikasi."}
        </Text>
      </View>

      {/* Tombol cek reminder (simulasi) */}
      <TouchableOpacity
        style={styles.reminderButton}
        onPress={handleCheckReminder}
      >
        <Text style={styles.reminderButtonText}>Cek Reminder</Text>
      </TouchableOpacity>

      {/* Jadwal terdekat */}
      <View style={styles.nextCard}>
        <Text style={styles.nextTitle}>Jadwal Terdekat</Text>
        {nextSchedule ? (
          <>
            <Text style={styles.nextSubject}>
              {nextSchedule.schedule.subject}
            </Text>
            <Text style={styles.nextInfo}>
              {nextSchedule.schedule.date} • {nextSchedule.schedule.time}
            </Text>
            {nextSchedule.schedule.note ? (
              <Text style={styles.nextNote}>{nextSchedule.schedule.note}</Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.nextInfo}>
            Belum ada jadwal belajar yang akan datang.
          </Text>
        )}
      </View>

      {/* List jadwal */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Semua Jadwal Belajar</Text>
        <TouchableOpacity onPress={() => router.push("/addSchedule")}>
          <Text style={styles.link}>+ Tambah Jadwal</Text>
        </TouchableOpacity>
      </View>

      {loadingSchedules && (
        <Text style={styles.loadingText}>Memuat jadwal dari server...</Text>
      )}

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
  tipCard: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
  },
  reminderButton: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#22c55e",
    alignItems: "center",
    marginBottom: 12,
  },
  reminderButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  nextCard: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  nextTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  nextSubject: {
    fontSize: 15,
    fontWeight: "600",
  },
  nextInfo: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  nextNote: {
    fontSize: 13,
    marginTop: 4,
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
  loadingText: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
});
