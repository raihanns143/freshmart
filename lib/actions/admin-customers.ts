"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function checkAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(role)) {
    throw new Error("Unauthorized");
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await checkAdmin();
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath(`/admin/customers`);
    revalidatePath(`/admin/customers/${userId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    await checkAdmin();
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath(`/admin/customers`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function blockUser(userId: string) {
  try {
    await checkAdmin();
    await prisma.user.update({
      where: { id: userId },
      data: { role: "BLOCKED" },
    });
    await prisma.session.deleteMany({ where: { userId } });
    revalidatePath(`/admin/customers`);
    revalidatePath(`/admin/customers/${userId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function unblockUser(userId: string) {
  try {
    await checkAdmin();
    await prisma.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });
    revalidatePath(`/admin/customers`);
    revalidatePath(`/admin/customers/${userId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
