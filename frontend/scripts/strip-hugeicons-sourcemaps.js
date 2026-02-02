/* Strip sourceMappingURL comments from @hugeicons/core-free-icons to silence missing map warnings */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'node_modules', '@hugeicons', 'core-free-icons', 'dist', 'esm');

try {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
  let stripped = 0;

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const original = fs.readFileSync(fullPath, 'utf8');
    const updated = original.replace(/\/\/# sourceMappingURL=.*\n?/g, '');
    if (original !== updated) {
      fs.writeFileSync(fullPath, updated, 'utf8');
      stripped += 1;
    }
  });

  console.log(`strip-hugeicons-sourcemaps: processed ${files.length} files, removed mappings from ${stripped}.`);
} catch (err) {
  console.warn('strip-hugeicons-sourcemaps: skipped (hugeicons package not found).', err.message);
}
