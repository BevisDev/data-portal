import { Tag } from "antd";
import type { Channel, Level } from "../../../types/notification";

export const StatusTag = ({ status }: { status: string }) => (
  <Tag color={status === "ACTIVE" ? "green" : "default"}>{status}</Tag>
);

const LEVEL_COLORS: Record<Level, string> = {
  INFO: "blue",
  WARN: "gold",
  ERROR: "red",
  CRITICAL: "magenta",
};

export const LevelTag = ({ level }: { level: Level }) => <Tag color={LEVEL_COLORS[level]}>{level}</Tag>;

const CHANNEL_COLORS: Record<Channel, string> = {
  EMAIL: "geekblue",
  MSTEAMS: "purple",
  WEBHOOK: "cyan",
};

export const ChannelTag = ({ channel }: { channel: Channel }) => <Tag color={CHANNEL_COLORS[channel]}>{channel}</Tag>;
