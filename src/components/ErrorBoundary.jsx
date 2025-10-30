import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="max-w-2xl mx-auto mt-24 card">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <pre className="text-sm text-red-300 whitespace-pre-wrap">
            {String(
              (this.state.error && this.state.error.message) ||
                this.state.error
            )}
          </pre>
          <pre className="text-xs text-slate-400 mt-3 whitespace-pre-wrap">
            {this.state.error?.stack || ""}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
