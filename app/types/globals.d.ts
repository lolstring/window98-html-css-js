import type { bot } from '../scripts/bot';
declare global {
  interface Window {
    globalBot: bot;
    xepOnline: any;
  }
}
// biome-ignore lint/complexity/noUselessEmptyExport: global declaration
export {};