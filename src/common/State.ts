export default interface State {
  z: string;
  t: string;
  i: string;
  s: string;
  r?: boolean;
  p?: string;
  x?: Record<string, string>;
  c?: string;
}

export function isValidState(maybeState: object): maybeState is State {
  const keys = Object.keys(maybeState);
  const requiredKeys = ["z", "t", "i", "s"];
  if (!requiredKeys.every((requiredKey) => keys.includes(requiredKey))) {
    return false;
  }
  const allKeys = [...requiredKeys, "r", "p", "x", "c"];
  return keys.every((key) => allKeys.includes(key));
}

export function decode(stateString: string): State | undefined {
  try {
    return JSON.parse(window.atob(stateString));
  } catch (error) {
    return undefined;
  }
}

export function encode(state: State): string {
  return window.btoa(JSON.stringify(state));
}
