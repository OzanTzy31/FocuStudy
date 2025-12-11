import React, { createContext, ReactNode, useContext, useState } from "react";

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
  addSchedule: (s: Omit<Schedule, "id" | "status">) => void;
  markDone: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [homeLocation, setHomeLocation] = useState<HomeLocation | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 1,
      subject: "Struktur Data",
      date: "2025-12-10",
      time: "20:00",
      note: "Review linked list",
      status: "pending",
    },
    {
      id: 2,
      subject: "Pemrograman Web",
      date: "2025-12-11",
      time: "19:30",
      note: "Latihan form & routing",
      status: "done",
    },
  ]);

  const addSchedule = (newSchedule: Omit<Schedule, "id" | "status">) => {
    setSchedules((prev) => [
      ...prev,
      {
        id: Date.now(),
        status: "pending",
        ...newSchedule,
      },
    ]);
  };

  const markDone = (id: number) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "done" } : item))
    );
  };

  const value: AppContextType = {
    homeLocation,
    setHomeLocation,
    schedules,
    addSchedule,
    markDone,
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
