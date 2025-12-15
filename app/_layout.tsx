import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import React from "react";
import { AppProvider } from "../src/context/AppContext";

// Handler global notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    } as any),
});

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "FocusStudy" }} />
        <Stack.Screen name="addSchedule" options={{ title: "Tambah Jadwal" }} />
        <Stack.Screen
          name="setHomeLocation"
          options={{ title: "Set Lokasi Rumah" }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
    </AppProvider>
  );
}
