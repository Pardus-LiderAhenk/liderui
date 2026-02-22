import {
  NotificationSeverity,
  NotificationTriggerDomain,
} from "./enums";

/**
 * @typedef {Object} NotificationTrigger
 * @property {string} id
 * @property {string} labelKey
 * @property {string} domain
 * @property {string} severity
 * @property {boolean} defaultEnabled
 * @property {boolean} isSystem
 */

export function createNotificationTrigger(overrides = {}) {
  return {
    id: "",
    labelKey: "",
    domain: NotificationTriggerDomain.SYSTEM,
    severity: NotificationSeverity.INFO,
    defaultEnabled: false,
    isSystem: true,
    ...overrides,
  };
}

export function normalizeNotificationTrigger(payload = {}) {
  return createNotificationTrigger({
    id: payload.id || "",
    labelKey: payload.labelKey || "",
    domain: payload.domain || NotificationTriggerDomain.SYSTEM,
    severity: payload.severity || NotificationSeverity.INFO,
    defaultEnabled: Boolean(payload.defaultEnabled),
    isSystem: payload.isSystem !== false,
  });
}
