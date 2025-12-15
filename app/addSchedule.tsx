import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppContext } from "../src/context/AppContext";

const AddScheduleScreen: React.FC = () => {
  const { addSchedule } = useAppContext();
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  const scheduleNotification = async (
    subject: string,
    dateStr: string,
    timeStr: string
  ): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Notifikasi tidak diizinkan",
        "Izin notifikasi belum diberikan, jadi reminder tidak bisa muncul."
      );
      return false;
    }

    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);

    if (!year || !month || !day || hour === undefined || minute === undefined) {
      console.log("Format tanggal/jam tidak valid");
      Alert.alert(
        "Format salah",
        "Gunakan format tanggal YYYY-MM-DD dan jam HH:MM"
      );
      return false;
    }

    const triggerDate = new Date(year, month - 1, day, hour, minute);
    const now = new Date();

    const diffMs = triggerDate.getTime() - now.getTime();
    const diffSeconds = Math.round(diffMs / 1000);

    console.log("NOW       :", now.toISOString());
    console.log("TRIGGER   :", triggerDate.toISOString());
    console.log("DIFF (s)  :", diffSeconds);

    if (diffSeconds <= 0) {
      Alert.alert(
        "Waktu sudah lewat",
        "Silakan pilih tanggal/jam yang lebih besar dari waktu sekarang."
      );
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder Belajar 📚",
        body: `Saatnya belajar: ${subject} pada ${timeStr}`,
        sound: "default",
      },
      trigger: {
        seconds: diffSeconds,
        repeats: false,
      } as any,
    });

    return true;
  };

  const handleSave = async () => {
    if (!subject || !date || !time) {
      Alert.alert("Error", "Mata kuliah, tanggal, dan jam wajib diisi.");
      return;
    }

    let ok = false;
    try {
      ok = await scheduleNotification(subject, date, time);
    } catch (err) {
      console.log("Gagal menjadwalkan notif:", err);
      ok = false;
    }

    if (!ok) return;

    // SIMPAN KE SERVER + STATE
    await addSchedule({ subject, date, time, note });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mata Kuliah / Topik</Text>
      <TextInput
        value={subject}
        onChangeText={setSubject}
        placeholder="Contoh: Struktur Data"
        style={styles.input}
      />

      <Text style={styles.label}>Tanggal</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      <Text style={styles.label}>Jam</Text>
      <TextInput
        value={time}
        onChangeText={setTime}
        placeholder="HH:MM (24 jam)"
        style={styles.input}
      />

      <Text style={styles.label}>Catatan (opsional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Contoh: review materi minggu lalu"
        style={[styles.input, styles.textArea]}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Simpan Jadwal & Set Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
