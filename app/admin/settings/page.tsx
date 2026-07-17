import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settingsArray = await prisma.setting.findMany();
  const settings = Object.fromEntries(settingsArray.map((s) => [s.key, s.value]));
  
  const currencies = await prisma.currency.findMany({
    orderBy: { isDefault: 'desc' }
  });

  return <SettingsForm initialSettings={settings} currencies={currencies} />;
}
