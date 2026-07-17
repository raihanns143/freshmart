"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Store, Truck, CreditCard, Mail } from "lucide-react";
import { toast } from "sonner";
import { updateSettings } from "@/lib/actions/admin2";

import { Currency } from "@prisma/client";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
  currencies: Currency[];
}

export function SettingsForm({ initialSettings, currencies }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("general");

  function handleChange(key: string, value: string) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateSettings(settings);
      if (result.success) {
        toast.success("Settings saved successfully");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to save settings");
      }
    });
  }

  const tabs = [
    { id: "general", label: "General", icon: Store },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "smtp", label: "Email / SMTP", icon: Mail },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage store configuration</p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            
            {activeTab === "general" && (
              <div className="space-y-4 max-w-xl">
                <h2 className="text-lg font-semibold text-white mb-4">General Settings</h2>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Store Name</label>
                  <input
                    value={settings.SITE_NAME ?? ""}
                    onChange={(e) => handleChange("SITE_NAME", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="FreshMart Bangladesh"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Store Contact Email</label>
                  <input
                    value={settings.CONTACT_EMAIL ?? ""}
                    onChange={(e) => handleChange("CONTACT_EMAIL", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="support@freshmart.com.bd"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Store Contact Phone</label>
                  <input
                    value={settings.CONTACT_PHONE ?? ""}
                    onChange={(e) => handleChange("CONTACT_PHONE", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="+880 1700 000000"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Store Address</label>
                  <input
                    value={settings.STORE_ADDRESS ?? ""}
                    onChange={(e) => handleChange("STORE_ADDRESS", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Dhaka, Bangladesh"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Currency</label>
                  <select
                    value={settings.CURRENCY ?? "BDT"}
                    onChange={(e) => handleChange("CURRENCY", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {currencies.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code} ({c.symbol}) - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4 max-w-xl">
                <h2 className="text-lg font-semibold text-white mb-4">Shipping Rates</h2>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Delivery Charge</label>
                  <input
                    type="number"
                    value={settings.DELIVERY_CHARGE ?? ""}
                    onChange={(e) => handleChange("DELIVERY_CHARGE", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Tax Rate (e.g. 0.05 for 5%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.TAX_RATE ?? ""}
                    onChange={(e) => handleChange("TAX_RATE", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Applied to the total order value.</p>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-4 max-w-xl">
                <h2 className="text-lg font-semibold text-white mb-4">Payment Providers</h2>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-sm text-slate-300">
                    The platform currently only supports Cash on Delivery (COD). All online payment integrations have been removed per configuration.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "smtp" && (
              <div className="space-y-4 max-w-xl">
                <h2 className="text-lg font-semibold text-white mb-4">SMTP Configuration</h2>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">SMTP Host</label>
                  <input
                    value={settings.smtpHost ?? ""}
                    onChange={(e) => handleChange("smtpHost", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                    placeholder="smtp.mailgun.org"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">SMTP Port</label>
                    <input
                      value={settings.smtpPort ?? ""}
                      onChange={(e) => handleChange("smtpPort", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">Security</label>
                    <select
                      value={settings.smtpSecure ?? "tls"}
                      onChange={(e) => handleChange("smtpSecure", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">SMTP User</label>
                  <input
                    value={settings.smtpUser ?? ""}
                    onChange={(e) => handleChange("smtpUser", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">SMTP Password</label>
                  <input
                    type="password"
                    value={settings.smtpPassword ?? ""}
                    onChange={(e) => handleChange("smtpPassword", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                  />
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </form>
  );
}
