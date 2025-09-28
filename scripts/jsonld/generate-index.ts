#!/usr/bin/env tsx

/* This is an alternative to the index-plugin, it produces the same output */

import * as fs from 'fs';
import * as path from 'path';

const APP_DIR = 'app';

function findJsonLdDirectories(): string[] {
  const results: string[] = [];
  
  // Add base directories
  results.push('app/_data/jsonld/homepage');
  results.push('app/_data/jsonld/global');
  
  // Find all directories with page.tsx that also have a jsonld folder
  function scan(dir: string) {
    try {
      const files = fs.readdirSync(dir);
      
      // Check if this directory has page.tsx
      const hasPage = files.includes('page.tsx');
      const hasJsonLd = files.includes('jsonld');
      
      if (hasPage && hasJsonLd) {
        results.push(path.join(dir, 'jsonld'));
      }
      
      // Recurse into subdirectories
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && 
            !file.startsWith('.') && 
            file !== 'node_modules' &&
            file !== 'jsonld') {
          scan(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  scan(APP_DIR);
  return results;
}

function generateIndex(dirPath: string): void {
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  if (jsonFiles.length === 0) return;
  
  const imports: string[] = [];
  const exports: string[] = [];
  
  for (const file of jsonFiles) {
    const varName = file
      .replace('.json', '')
      .replace(/-([a-z])/g, (_, l) => l.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, '');
    
    imports.push(`import ${varName} from './${file}';`);
    exports.push(`  ${varName},`);
  }
  
  const content = `${imports.join('\n')}

const jsonLdData = [
${exports.join('\n')}
];

export default jsonLdData;
`;
  
  fs.writeFileSync(path.join(dirPath, 'index.ts'), content);
  console.log(`✅ Generated: ${dirPath}/index.ts`);
}

// Main
const dirs = findJsonLdDirectories();
for (const dir of dirs) {
  generateIndex(dir);
}