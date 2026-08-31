import { Result, Button } from "antd";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { useErrorStore } from "../store/errorStore";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

class AppErrorBoundaryInner extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    useErrorStore.getState().setError({
      message: error.message || "Unexpected render error",
      stack: `${error.stack ?? ""}\n\n${info.componentStack}`,
      at: Date.now(),
    });
  }

  onReload = () => {
    window.location.assign("/dashboard");
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="A global error boundary caught a rendering error."
          extra={
            <Button type="primary" onClick={this.onReload}>
              Back to dashboard
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export function AppErrorBoundary({ children }: Props) {
  return <AppErrorBoundaryInner>{children}</AppErrorBoundaryInner>;
}
