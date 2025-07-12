import type { Bot } from '../scripts/bot';
declare global {
  interface Window {
    globalBot: Bot;
    xepOnline: any;
  }
  interface JQuery {
    combobox(options?: Partial<JQueryUI.ComboboxOptions>): JQuery;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setInitialIcons(options?: any): JQuery<HTMLElement>;
  }
}
// biome-ignore lint/complexity/noUselessEmptyExport: global declaration
export {};