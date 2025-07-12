declare global {
  interface JQuery {
    combobox(options?: Partial<JQueryUI.ComboboxOptions>): JQuery;
  }
}
export {};