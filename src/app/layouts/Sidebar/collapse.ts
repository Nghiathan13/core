const listeners = new Set<() => void>();

let collapsed = false;

export function isCollapsed(): boolean {
  return collapsed;
}

export function subscribeCollapse(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setCollapsed(value: boolean): void {
  if (collapsed === value) {
    return;
  }
  collapsed = value;
  if (collapsed) {
    document.body.setAttribute("data-sidebar", "collapsed");
  } else {
    document.body.removeAttribute("data-sidebar");
  }
  for (const listener of listeners) {
    listener();
  }
}
