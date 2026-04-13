import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');
const projectRoot = path.resolve(backendDir, '..');
const envPath = path.join(backendDir, '.env');
const envExamplePath = path.join(backendDir, '.env.example');
const frontendConfigPath = path.join(projectRoot, 'frontend', 'js', 'config.js');

function parseEnvFile(content) {
  const result = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

const envSourcePath = fs.existsSync(envPath) ? envPath : envExamplePath;
const parsed = parseEnvFile(fs.readFileSync(envSourcePath, 'utf8'));

const apiBaseUrl = parsed.FRONTEND_API_BASE_URL || 'http://localhost:8080/api';
const whatsappNumber = parsed.FRONTEND_WHATSAPP_NUMBER || '5491112345678';

const content = `// Archivo generado automáticamente desde backend/${path.basename(envSourcePath)}\n// Ejecutá: npm run config:frontend\nwindow.APP_CONFIG = Object.assign({}, window.APP_CONFIG || {}, {\n  API_BASE_URL: ${JSON.stringify(apiBaseUrl)},\n  WHATSAPP_NUMBER: ${JSON.stringify(whatsappNumber)},\n});\n`;

fs.writeFileSync(frontendConfigPath, content, 'utf8');
console.log(`Config frontend sincronizada en ${frontendConfigPath}`);
