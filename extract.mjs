import { readFileSync, writeFileSync } from 'fs';
const src = readFileSync('game-v4.32.1.html', 'utf8');
const lines = src.split('\n');
const htmlLines = lines.slice(2401, 3041);
const html = htmlLines.join('\n');
const escaped = html.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\${/g,'\\${');
const out = 'export const gameHtml = `' + escaped + '`;\n';
writeFileSync('src/game/game-html.js', out, 'utf8');
console.log('Done. Lines:', htmlLines.length, 'Chars:', out.length);
// Quick check for emojis
const hasEmoji = out.includes('\uD83D') || out.includes('🪙') || out.includes('🔧');
console.log('Contains proper emojis:', hasEmoji);
