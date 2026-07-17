"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(data: { name?: string; phone?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function changePassword(oldPass: string, newPass: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.password) {
    return { success: false, error: "Account does not use a password (OAuth)." };
  }

  const isValid = await bcrypt.compare(oldPass, user.password);
  if (!isValid) return { success: false, error: "Incorrect current password." };

  const hashed = await bcrypt.hash(newPass, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return { success: true };
}
