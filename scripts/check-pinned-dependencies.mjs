import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ********************************************************************************
// == Constant ====================================================================
const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const EXACT_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// == Main ========================================================================
const main = () => {
 const manifestPaths = [path.join(repoRoot, 'package.json'), ...readdirSync(path.join(repoRoot, 'package')).map((name) => path.join(repoRoot, 'package', name, 'package.json'))];
 const manifests = manifestPaths.map((manifestPath) => ({ manifest: JSON.parse(readFileSync(manifestPath, 'utf8')), manifestPath }));
 const workspaceNames = new Set(manifests.map(({ manifest }) => manifest.name));

 const violations = [];
 for (const { manifest, manifestPath } of manifests) {
  for (const field of DEPENDENCY_FIELDS) {
   for (const [name, version] of Object.entries(manifest[field] ?? {})) {
    if (workspaceNames.has(name) || EXACT_VERSION_PATTERN.test(version)) {
     continue;
    } /* else -- an external dependency declared with a range */

    violations.push(`${path.relative(repoRoot, manifestPath)} ${field}.${name}: "${version}"`);
   }
  }
 }

 if (violations.length === 0) {
  console.log('#5d0c1f3a Every dependency is pinned to an exact version.');
  return;
 } /* else -- at least one dependency floats */

 console.error(`#b2e7a940 Pin these dependencies to an exact version (npm install --save-exact):\n${violations.join('\n')}`);
 process.exitCode = 1;
};

main();
