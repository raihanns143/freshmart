"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Store, Truck, CreditCard, Mail } from "lucide-react";
import { toast } from "sonner";
import { updateSettings } from "@/lib/actions/admin2";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
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
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
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
                    value={settings.storeName ?? ""}
                    onChange={(e) => handleChange("storeName", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    placeholder="FreshMart"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Store Contact Email</label>
                  <input
                    value={settings.storeEmail ?? ""}
                    onChange={(e) => handleChange("storeEmail", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    placeholder="hello@freshmart.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Store Contact Phone</label>
                  <input
                    value={settings.storePhone ?? ""}
                    onChange={(e) => handleChange("storePhone", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    placeholder="+1 (800) 123-4567"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Currency (Symbol)</label>
                  <input
                    value={settings.currencySymbol ?? ""}
                    onChange={(e) => handleChange("currencySymbol", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    placeholder="$"
                  />
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4 max-w-xl">
                <h2 className="text-lg font-semibold text-white mb-4">Shipping Rates</h2>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Base Shipping Cost ($)</label>
                  <input
                    type="number"
                    value={settings.baseShippingCost ?? ""}
                    onChange={(e) => handleChange("baseShippingCost", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Free Shipping Threshold ($)</label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold ?? ""}
                    onChange={(e) => handleChange("freeShippingThreshold", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Orders above this amount will get free shipping.</p>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-4 max-w-xl">
                <h2 className="text-lg font-semibold text-white mb-4">Payment Providers</h2>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Stripe Secret Key</label>
                  <input
                    type="password"
                    value={settings.stripeSecretKey ?? ""}
                    onChange={(e) => handleChange("stripeSecretKey", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Stripe Webhook Secret</label>
                  <input
                    type="password"
                    value={settings.stripeWebhookSecret ?? ""}
                    onChange={(e) => handleChange("stripeWebhookSecret", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                  />
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                    placeholder="smtp.mailgun.org"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">SMTP Port</label>
                    <input
                      value={settings.smtpPort ?? ""}
                      onChange={(e) => handleChange("smtpPort", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">Security</label>
                    <select
                      value={settings.smtpSecure ?? "tls"}
                      onChange={(e) => handleChange("smtpSecure", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">SMTP Password</label>
                  <input
                    type="password"
                    value={settings.smtpPassword ?? ""}
                    onChange={(e) => handleChange("smtpPassword", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
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
