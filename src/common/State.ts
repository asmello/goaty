export default interface State {
  i: string; // client_id
  r?: string; // redirect_uri
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
