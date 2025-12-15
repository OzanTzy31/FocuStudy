// src/context/AppContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_BASE_URL } from "../config/api";

export interface HomeLocation {
  lat: number;
  lng: number;
}

export interface Schedule {
  id: number;
  subject: string;
  date: string;
  time: string;
  note?: string;
  status: "pending" | "done";
}

interface AppContextType {
  homeLocation: HomeLocation | null;
  setHomeLocation: (loc: HomeLocation | null) => void;
  schedules: Schedule[];
  addSchedule: (s: {
    subject: string;
    date: string;
    time: string;
    note?: string;
  }) => Promise<void>;
  markDone: (id: number) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;
  loadingSchedules: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [homeLocation, setHomeLocation] = useState<HomeLocation | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState<boolean>(false);

  // Load jadwal dari server saat app jalan
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoadingSchedules(true);
        const res = await fetch(`${API_BASE_URL}/schedules`);
        const data = await res.json();
        setSchedules(data);
      } catch (err) {
        console.log("Gagal mengambil jadwal dari server:", err);
        // fallback: biarin kosong, app tetap jalan
      } finally {
        setLoadingSchedules(false);
      }
    };

    loadSchedules();
  }, []);

  const addSchedule = async ({
    subject,
    date,
    time,
    note,
  }: {
    subject: string;
    date: string;
    time: string;
    note?: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, date, time, note }),
      });

      if (!res.ok) {
        throw new Error("Gagal menambah jadwal di server");
      }

      const created: Schedule = await res.json();

      // update state lokal sesuai data server (id & status dari server)
      setSchedules((prev) => [...prev, created]);
    } catch (err) {
      console.log(err);
      // fallback: kalau server error, tetap simpan lokal biar UI jalan
      setSchedules((prev) => [
        ...prev,
        {
          id: Date.now(),
          subject,
          date,
          time,
          note: note || "",
          status: "pending",
        },
      ]);
    }
  };

  const markDone = async (id: number) => {
    // Optimistic update: ubah dulu di client
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "done" } : s))
    );

    try {
      await fetch(`${API_BASE_URL}/schedules/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "done" }),
      });
    } catch (err) {
      console.log("Gagal update status di server:", err);
      // (optional) bisa rollback, tapi untuk UAS ngga perlu ribet
    }
  };

  const deleteSchedule = async (id: number) => {
    // Optimistic update: hapus dulu di sisi client
    setSchedules((prev) => prev.filter((s) => s.id !== id));

    try {
      const res = await fetch(`${API_BASE_URL}/schedules/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus jadwal di server");
      }
    } catch (err) {
      console.log("Gagal menghapus jadwal di server:", err);
    }
  };

  const value: AppContextType = {
    homeLocation,
    setHomeLocation,
    schedules,
    addSchedule,
    markDone,
    deleteSchedule,
    loadingSchedules,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return ctx;
};
