import { useEffect } from "react";
import { Button, Modal, Space, Typography } from "antd";
import { useErrorStore } from "../store/errorStore";

export function GlobalErrorMiddleware() {
  const current = useErrorStore((state) => state.current);
  const setError = useErrorStore((state) => state.setError);
  const clearError = useErrorStore((state) => state.clearError);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      setError({
        message: event.message || "Unexpected runtime error",
        source: event.filename,
        stack: event.error?.stack,
        at: Date.now(),
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      setError({
        message: reason instanceof Error ? reason.message : "Unhandled promise rejection",
        stack: reason instanceof Error ? reason.stack : undefined,
        at: Date.now(),
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, [setError]);

  return (
    <Modal
      title="Global Error"
      open={!!current}
      onCancel={clearError}
      footer={[
        <Button key="close" type="primary" onClick={clearError}>
          Close
        </Button>,
      ]}
    >
      <Space direction="vertical" size={6}>
        <Typography.Text strong>{current?.message}</Typography.Text>
        {current?.source ? <Typography.Text type="secondary">Source: {current.source}</Typography.Text> : null}
        {current?.stack ? (
          <Typography.Paragraph code style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>
            {current.stack}
          </Typography.Paragraph>
        ) : null}
      </Space>
    </Modal>
  );
}
