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

  const handleSave = () => {
    if (!subject || !date || !time) {
      Alert.alert("Error", "Mata kuliah, tanggal, dan jam wajib diisi.");
      return;
    }

    addSchedule({ subject, date, time, note });
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
        <Text style={styles.buttonText}>Simpan Jadwal</Text>
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
