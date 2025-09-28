// scripts/jsonLD/index-plugin.ts

/* This is the primary generator of index files for jsonld folders,
it is an automated alternative to the generate-index.ts, it produces the same output */

import fs from 'fs';
import path from 'path';

class JsonLdPlugin {
  apply() {
    const APP_DIR = 'app';
    const dirs = this.findJsonLdDirectories(APP_DIR);

    for (const dir of dirs) {
      this.generateIndex(dir);
    }
  }

  findJsonLdDirectories(appDir: string): string[] {
    const results: string[] = [];
    // always include these two
    results.push('app/_data/jsonld/homepage');
    results.push('app/_data/jsonld/global');

    const scan = (dir: string) => {
      try {
        const files = fs.readdirSync(dir);
        const hasPage = files.includes('page.tsx');
        const hasJsonLd = files.includes('jsonld');

        if (hasPage && hasJsonLd) {
          results.push(path.join(dir, 'jsonld'));
        }

        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);

          if (
            stat.isDirectory() &&
            !file.startsWith('.') &&
            file !== 'node_modules' &&
            file !== 'jsonld'
          ) {
            scan(fullPath);
          }
        }
      } catch (error) {
        // ignore directories we cannot access
      }
    };

    scan(appDir);
    return results;
  }

  generateIndex(dirPath: string) {
    try {
      if (!fs.existsSync(dirPath)) return;

      const files = fs.readdirSync(dirPath);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      if (jsonFiles.length === 0) return;

      const imports: string[] = [];
      const exportsLines: string[] = [];

      for (const file of jsonFiles) {
        const varName = file
          .replace('.json', '')
          .replace(/-([a-z])/g, (_, l) => l.toUpperCase())
          .replace(/[^a-zA-Z0-9]/g, '');

        imports.push(`import ${varName} from './${file}';`);
        exportsLines.push(`  ${varName},`);
      }

      const content = `${imports.join('\n')}

const jsonLdData = [
${exportsLines.join('\n')}
];

export default jsonLdData;
`;

      const outPath = path.join(dirPath, 'index.ts');

      // If file exists and contents are identical, skip write and skip logging
      if (fs.existsSync(outPath)) {
        const existing = fs.readFileSync(outPath, 'utf8');
        if (existing === content) {
          // No-op: already up-to-date
          return;
        }
      }

      fs.writeFileSync(outPath, content, 'utf8');
      console.log(`✅ Generated: ${dirPath.replace(/\\/g, '/')}/index.ts`);
    } catch (err) {
      // swallow errors so dev server doesn't crash; optionally log in debug
      // console.error('JsonLdPlugin error:', err);
    }
  }
}

function withJsonLd(nextConfig: any = {}) {
  return {
    ...nextConfig,
    webpack(config: any, options: any) {
      if (options?.isServer) {
        const plugin = new JsonLdPlugin();
        plugin.apply();
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
}

export default withJsonLd;
