import { readFileSync } from 'node:fs';
import { assertResources } from '../lib/resources.mjs';
const read = name => JSON.parse(readFileSync(new URL(`../src/data/${name}.json`, import.meta.url),'utf8'));
assertResources({tools:read('tools'),videos:read('videos'),wishes:read('wishes'),issues:read('known-issues'),forms:read('site').forms});
console.log('[resources] videos, wishes, known issues and Microsoft Forms valid');
