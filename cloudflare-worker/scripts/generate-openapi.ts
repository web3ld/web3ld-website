// scripts/generate-openapi.ts
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { generateOpenApiSpec } from '../src/contact/openapi';

function main() {
  try {
    const spec = generateOpenApiSpec();

    // Create output directory
    const outputDir = path.join(__dirname, '..', 'openapi');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write YAML version
    const yamlStr = yaml.dump(spec, { noRefs: true });
    fs.writeFileSync(
      path.join(outputDir, 'contact.yaml'),
      yamlStr
    );

    // Write JSON version
    fs.writeFileSync(
      path.join(outputDir, 'contact.json'),
      JSON.stringify(spec, null, 2)
    );

    console.log('✅ OpenAPI spec generated in /openapi/');
    console.log('📄 Files created:');
    console.log('   - openapi/contact.yaml');
    console.log('   - openapi/contact.json');
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI spec:', error);
    process.exit(1);
  }
}

main();