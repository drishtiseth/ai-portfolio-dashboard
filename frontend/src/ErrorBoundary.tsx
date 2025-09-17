import { Component, type ReactNode } from "react";
type State = { hasError: boolean; msg?: string };
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, msg: err instanceof Error ? err.message : String(err) };
  }
  render() {
    return this.state.hasError
      ? <div style={{ padding: 16, color: "red" }}><b>Render error:</b><pre>{this.state.msg}</pre></div>
      : this.props.children;
  }
}
