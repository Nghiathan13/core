export interface View {
  el: HTMLElement;
  destroy?: () => void;
}
