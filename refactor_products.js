const fs = require('fs');

function refactor(file) {
  let content = fs.readFileSync(file, 'utf-8');
  let hasSafeLog = content.includes('async function safeAuditLog');
  
  if (!hasSafeLog) {
    const importLog = `import { logActivity } from "@/lib/logger";\n`;
    const safeLogFunc = `
async function safeAuditLog(data: any) {
  const session = await auth();
  await logActivity({
    userId: data.userId || (session?.user as any)?.id,
    role: (session?.user as any)?.role || "ADMIN",
    action: data.action,
    entityType: data.entity,
    entityId: data.entityId,
    details: data.details,
    status: "SUCCESS"
  });
}
`;
    content = importLog + content.replace('import { auth } from "@/auth";', 'import { auth } from "@/auth";\n' + safeLogFunc);
  }

  content = content.replace(/try\s*\{\s*await prisma\.auditLog\.create\(\{[\s\S]*?data:\s*([\s\S]*?)\s*\}\);?\s*\}\s*catch[^{]*\{\s*\/\* auditLog is non-critical \*\/\s*\}/g, (match, dataObj) => {
    return `await safeAuditLog(${dataObj});`;
  });

  fs.writeFileSync(file, content);
}

refactor('lib/actions/admin-products.ts');
refactor('lib/actions/admin-brands.ts');
console.log('Done');
