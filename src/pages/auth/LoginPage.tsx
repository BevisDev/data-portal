import { useMemo } from "react";
import { App, Button, Card, Carousel, Col, Divider, Form, Input, Row, Space, Typography } from "antd";
import { GithubOutlined, GoogleOutlined, LockOutlined } from "@ant-design/icons";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import slideAnalytics from "../../assets/slide-analytics.svg";
import slideGovernance from "../../assets/slide-governance.svg";
import slideSecurity from "../../assets/slide-security.svg";
import { useAuthStore } from "../../store/authStore";
import { usePlatformStore } from "../../store/platformStore";
import { isSessionExpired } from "../../utils/platform";

type LocalFormInput = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useAuthStore((state) => state.session);
  const createSession = useAuthStore((state) => state.createSession);
  const users = usePlatformStore((state) => state.users);
  const { message } = App.useApp();
  const [form] = Form.useForm<LocalFormInput>();

  const hasValidSession = !!session && !isSessionExpired(session.expiresAt);
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo ?? "/dashboard";

  const reasonText = useMemo(() => {
    const reason = (location.state as { reason?: string } | null)?.reason;
    if (reason === "expired") {
      return "Your session expired. Please login again to continue.";
    }
    return null;
  }, [location.state]);

  if (hasValidSession) {
    return <Navigate to={redirectTo} replace />;
  }

  const slides = [
    {
      key: "analytics",
      image: slideAnalytics,
      title: "Unified Analytics Workspace",
      subtitle: "Observe operational records in one intelligent enterprise dashboard.",
    },
    {
      key: "security",
      image: slideSecurity,
      title: "Security First Access",
      subtitle: "Apply role and permission controls with full session governance.",
    },
    {
      key: "governance",
      image: slideGovernance,
      title: "Trusted Data Governance",
      subtitle: "Enable clean management workflows for users, assets, and policies.",
    },
  ];

  const loginLocal = (payload: LocalFormInput) => {
    const target = users.find(
      (user) =>
        user.provider === "local" &&
        user.email.toLowerCase() === payload.email.toLowerCase() &&
        user.password === payload.password &&
        user.status === "active",
    );
    if (!target) {
      message.error("Invalid local credentials.");
      return;
    }
    createSession(target.id, "local");
    form.resetFields();
    message.success(`Welcome back, ${target.name}`);
    navigate(redirectTo, { replace: true });
  };

  const loginOAuth = (provider: "google" | "github", userId: string) => {
    const target = users.find((user) => user.id === userId && user.provider === provider && user.status === "active");
    if (!target) {
      message.error("Selected OAuth user is not active.");
      return;
    }
    createSession(target.id, provider);
    message.success(`Signed in with ${provider} as ${target.name}`);
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="auth-page">
      <Card className="auth-card" bordered={false} styles={{ body: { padding: 0 } }}>
        <Row gutter={0}>
          <Col xs={24} lg={14}>
            <div className="auth-slider-wrap">
              <Carousel autoplay effect="fade" autoplaySpeed={3000}>
                {slides.map((slide) => (
                  <div key={slide.key}>
                    <div className="auth-slide">
                      <img src={slide.image} alt={slide.title} className="auth-slide-image" />
                      <div className="auth-slide-content">
                        <Typography.Title level={3}>{slide.title}</Typography.Title>
                        <Typography.Paragraph>{slide.subtitle}</Typography.Paragraph>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </Col>
          <Col xs={24} lg={10}>
            <div className="auth-panel">
              <div className="auth-panel-inner">
                <Typography.Title level={2} style={{ marginTop: 0 }}>
                  Login Portal
                </Typography.Title>
                <Typography.Paragraph type="secondary">
                  Multi-provider sign in with enterprise role-based authorization and session middleware.
                </Typography.Paragraph>
                {reasonText ? (
                  <Typography.Paragraph className="session-warning">{reasonText}</Typography.Paragraph>
                ) : null}
                <Card size="small" title="Local Account">
                  <Form form={form} layout="vertical" onFinish={loginLocal}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                      <Input placeholder="owner@platform.local" />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                      <Input.Password placeholder="admin123" />
                    </Form.Item>
                    <Button htmlType="submit" type="primary" block icon={<LockOutlined />}>
                      Sign in
                    </Button>
                  </Form>
                  <Divider />
                  <Typography.Text type="secondary">Demo: owner@platform.local/admin123</Typography.Text>
                </Card>
                <Card size="small" title="OAuth Provider" style={{ marginTop: 16 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {users
                      .filter((user) => user.provider === "google")
                      .map((user) => (
                        <Button
                          key={user.id}
                          icon={<GoogleOutlined />}
                          block
                          onClick={() => loginOAuth("google", user.id)}
                        >
                          Continue as {user.name} (Google)
                        </Button>
                      ))}
                    {users
                      .filter((user) => user.provider === "github")
                      .map((user) => (
                        <Button
                          key={user.id}
                          icon={<GithubOutlined />}
                          block
                          onClick={() => loginOAuth("github", user.id)}
                        >
                          Continue as {user.name} (GitHub)
                        </Button>
                      ))}
                  </Space>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
