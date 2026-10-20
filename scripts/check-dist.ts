import {execFile} from 'node:child_process';
import {readFile, readdir} from 'node:fs/promises';
import {promisify} from 'node:util';

async function snapshot(): Promise<Record<string, string>> {
  const names = (await readdir('dist')).sort();
  return Object.fromEntries(await Promise.all(names.map(async (name) => [
    name, (await readFile(`dist/${name}`)).toString('base64')
  ])));
}

const before = await snapshot();
await promisify(execFile)('pnpm', ['run', 'build']);
const after = await snapshot();
if (JSON.stringify(before) !== JSON.stringify(after)) {
  throw new Error('Generated dist artifacts were outdated. Review the rebuilt artifacts.');
}
process.stdout.write('Generated dist artifacts are reproducible.\n');
