export const NotificationCategory = Object.freeze({
  DIRECTORY: "directory",
  NOTIFICATION: "notification",
  XMPP: "xmpp",
  FILE: "file",
  EMAIL: "email",
  OTHER: "other",
});

export const NotificationServiceType = Object.freeze({
  EMAIL: "email",
  FCM: "fcm",
  GOOGLECHAT: "googlechat",
  JIRA: "jira",
  MATRIX: "matrix",
  MASTODON: "mastodon",
  MATTERMOST: "mattermost",
  MSTEAMS: "msteams",
  NEXTCLOUDTALK: "nextcloudtalk",
  ROCKETCHAT: "rocketchat",
  SIGNAL: "signal",
  SLACK: "slack",
  SMTP2GO: "smtp2go",
  TELEGRAM: "telegram",
  WHATSAPP: "whatsapp",
  ZULIP: "zulip",
  DISCORD: "discord",
  WEBHOOK: "webhook",
  APPRISE: "apprise",
});

export const NotificationTriggerDomain = Object.freeze({
  USER: "user",
  AGENT: "agent",
  TASK: "task",
  POLICY: "policy",
  SYSTEM: "system",
});

export const NotificationSeverity = Object.freeze({
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  CRITICAL: "critical",
});

export const NotificationTestStatus = Object.freeze({
  IDLE: "idle",
  SUCCESS: "success",
  FAILED: "failed",
});
