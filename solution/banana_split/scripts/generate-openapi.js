/**
 * Generate OpenAPI JSON file for Bump.sh deployment
 */

const fs = require('fs');
const path = require('path');
const { specs } = require('../config/swagger');

// Generate OpenAPI JSON file
const openApiPath = path.join(__dirname, '..', 'banana_split_openapi.json');

try {
  fs.writeFileSync(openApiPath, JSON.stringify(specs, null, 2));
  console.log('OpenAPI specification generated successfully!');
  console.log(`File saved to: ${openApiPath}`);
  console.log(`Generated ${Object.keys(specs.paths || {}).length} endpoints`);
  
  // Validate the generated spec
  if (specs.info && specs.info.title && specs.paths) {
    console.log('OpenAPI spec validation passed');
    console.log(`Title: ${specs.info.title}`);
    console.log(`Version: ${specs.info.version}`);
  } else {
    console.warn('OpenAPI spec may be incomplete');
  }
  
} catch (error) {
  console.error('Failed to generate OpenAPI specification:', error);
  process.exit(1);
}
