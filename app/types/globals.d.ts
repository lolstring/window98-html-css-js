import type { Bot } from '../scripts/bot';
declare global {
  interface Window {
    globalBot: Bot;
    CLIPPY_CDN: string;
    // biome-ignore lint/suspicious/noExplicitAny: ClippyJS is not typed
    clippy: any; 
  }
  interface JQuery {
    combobox(options?: Partial<JQueryUI.ComboboxOptions>): JQuery;
    // biome-ignore lint/suspicious/noExplicitAny: selfdefinedfn
    setInitialIcons(options?: any): JQuery<HTMLElement>;
  }
}
// biome-ignore lint/complexity/noUselessEmptyExport: global declaration
export {};
