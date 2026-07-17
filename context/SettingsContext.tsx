"use client";

import React, { createContext, useContext } from "react";
import { Currency, defaultBDT } from "@/lib/currency";

export type StoreSettings = {
  currency: string;
  activeCurrency: Currency;
  siteName: string;
  taxRate: number;
  deliveryCharge: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl?: string;
  faviconUrl?: string;
  [key: string]: any;
};

const defaultSettings: StoreSettings = {
  currency: "BDT",
  activeCurrency: defaultBDT,
  siteName: "FreshMart Bangladesh",
  taxRate: 0.05,
  deliveryCharge: 50,
  contactEmail: "support@freshmart.com.bd",
  contactPhone: "+880 1700 000000",
  address: "Dhaka, Bangladesh",
};

const SettingsContext = createContext<{ settings: StoreSettings }>({ settings: defaultSettings });

export const SettingsProvider = ({ children, settings }: { children: React.ReactNode; settings?: Partial<StoreSettings> }) => {
  const mergedSettings = { ...defaultSettings, ...settings };
  return <SettingsContext.Provider value={{ settings: mergedSettings }}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
