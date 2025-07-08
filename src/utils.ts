export function getPadding() {
  return {
    top: window.innerHeight / 10,
    bottom: window.innerHeight / 20,
    right: window.innerWidth / 20,
    // TODO fix for smaller viewport
    left: window.innerWidth / 20 + window.innerWidth / 3,
  };
}
