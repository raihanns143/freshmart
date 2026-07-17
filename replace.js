const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'components')).concat(walk(path.join(__dirname, 'app')));

let modifiedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace import { formatCurrency } from "@/lib/utils" with import { formatPrice } from "@/lib/currency"
  if (content.includes('formatCurrency') && content.includes('@/lib/utils')) {
    content = content.replace(/formatCurrency/g, 'formatPrice');
    // We also need to add import { formatPrice } from "@/lib/currency" if it's not there
    if (!content.includes('@/lib/currency')) {
        // Just replace the utils import if formatCurrency was the only thing? 
        // No, maybe other utils are imported like cn.
        // Let's do it safely.
        content = content.replace(/import \{([^}]*)formatPrice([^}]*)\} from ["']@\/lib\/utils["']/, (match, p1, p2) => {
           let remaining = (p1 + p2).replace(/,\s*,/g, ',').replace(/^\s*,\s*/, '').replace(/\s*,\s*$/, '').trim();
           if (remaining === '') {
             return `import { formatPrice } from "@/lib/currency";`;
           }
           return `import { ${remaining} } from "@/lib/utils";\nimport { formatPrice } from "@/lib/currency";`;
        });
    }
    changed = true;
  } else if (content.includes('formatCurrency')) {
     content = content.replace(/formatCurrency/g, 'formatPrice');
     changed = true;
  }

  // Replace settings.currency with settings.activeCurrency
  if (content.includes('settings.currency') && content.includes('formatPrice')) {
    content = content.replace(/settings\.currency/g, 'settings.activeCurrency');
    changed = true;
  }

  // Sometimes they use `settings?.currency`
  if (content.includes('settings?.currency') && content.includes('formatPrice')) {
    content = content.replace(/settings\?\.currency/g, 'settings?.activeCurrency');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedFiles++;
    console.log(`Modified: ${file}`);
  }
});

console.log(`Total modified files: ${modifiedFiles}`);
