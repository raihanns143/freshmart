import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const newEmail = "fresh-mart@gmail.com";
  const newPassword = "724426";
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Find existing admin
  const admin = await prisma.user.findFirst({
    where: { role: { in: ["SUPER_ADMIN", "ADMIN"] } },
    orderBy: { createdAt: "asc" },
  });

  if (!admin) {
    // No admin exists — create one
    const newAdmin = await prisma.user.create({
      data: {
        email: newEmail,
        name: "FreshMart Admin",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        emailVerified: new Date(),
      },
    });
    console.log("✅ Admin created:", newAdmin.email);
  } else {
    // Update existing admin
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        email: newEmail,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });
    console.log("✅ Admin updated successfully!");
    console.log("   Email:   ", newEmail);
    console.log("   Password: (hashed and saved)");
  }
}

main()
  .catch((e) => { console.error("❌ Error:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
