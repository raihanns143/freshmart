import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export interface LogActivityParams {
  userId?: string;
  role?: string;
  action: string;
  entityType: string;
  entityId?: string;
  status?: string;
  details?: string;
}

export async function logActivity({
  userId,
  role,
  action,
  entityType,
  entityId,
  status = "SUCCESS",
  details,
}: LogActivityParams) {
  try {
    let ipAddress = "Unknown";
    let userAgent = "Unknown";

    try {
      const headersList = await headers();
      ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Unknown";
      userAgent = headersList.get("user-agent") || "Unknown";
    } catch (e) {
      // Ignore if headers() is called outside of request context
    }

    await prisma.auditLog.create({
      data: {
        userId,
        role,
        action,
        entity: entityType,
        entityId,
        status,
        details,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Non-critical, swallow the error but log to console
    console.error("[AuditLog Error]", error);
  }
}
