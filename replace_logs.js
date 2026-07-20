const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const files = getFiles('lib/actions');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let modified = false;

  // Replace definition of safeAuditLog
  if (content.includes('async function safeAuditLog')) {
    const replacement = `
import { logActivity } from "@/lib/logger";

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
    content = content.replace(/async function safeAuditLog\(data.*?\n\s*try \{ await prisma\.auditLog\.create\(\{ data \}\); \} catch \(\_\) \{ \/\* non-critical \*\/ \}\n\}/g, replacement.trim());
    modified = true;
  }

  // Replace direct prisma.auditLog.create
  if (content.includes('prisma.auditLog.create')) {
    content = content.replace(/await prisma\.auditLog\.create\(\{\n\s*data: \{([\s\S]*?)\},\n\s*\}\)/g, (match, inner) => {
      let entityMatch = inner.match(/entity:\s*([^,]+)/);
      let actionMatch = inner.match(/action:\s*([^,]+)/);
      let entityIdMatch = inner.match(/entityId:\s*([^,]+)/);
      let detailsMatch = inner.match(/details:\s*([^,}]+)/);
      
      let entity = entityMatch ? entityMatch[1].trim() : '""';
      let action = actionMatch ? actionMatch[1].trim() : '""';
      let entityId = entityIdMatch ? entityIdMatch[1].trim() : 'null';
      let details = detailsMatch ? detailsMatch[1].trim() : 'null';
      
      return `await logActivity({
        action: ${action},
        entityType: ${entity},
        entityId: ${entityId},
        details: ${details},
      })`;
    });

    if (!content.includes('import { logActivity }')) {
      content = `import { logActivity } from "@/lib/logger";\n` + content;
    }
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content);
  }
}
console.log('Logs replaced');
