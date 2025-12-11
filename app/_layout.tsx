import { Stack } from "expo-router";
import React from "react";
import { AppProvider } from "../src/context/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "FocusStudy" }} />
        <Stack.Screen
          name="add-schedule"
          options={{ title: "Tambah Jadwal" }}
        />
        <Stack.Screen
          name="set-home-location"
          options={{ title: "Set Lokasi Rumah" }}
        />
        {/* modal.tsx bawaan template, boleh dibiarkan */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
    </AppProvider>
  );
}
