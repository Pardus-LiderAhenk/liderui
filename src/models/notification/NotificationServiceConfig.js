import {
  NotificationServiceType,
  NotificationTestStatus,
} from "./enums";

/**
 * @typedef {Object} NotificationServiceTestResult
 * @property {string} status
 * @property {string|null} message
 * @property {string|null} testedAt
 */

/**
 * @typedef {Object} NotificationServiceConfig
 * @property {string} id
 * @property {string} type
 * @property {string} displayName
 * @property {boolean} enabled
 * @property {Object.<string, any>} settings
 * @property {Object.<string, string|null>} secretsRef
 * @property {NotificationServiceTestResult} lastTestResult
 */

export function createNotificationServiceTestResult(overrides = {}) {
  return {
    status: NotificationTestStatus.IDLE,
    message: null,
    testedAt: null,
    ...overrides,
  };
}

export function createNotificationServiceConfig(overrides = {}) {
  return {
    id: "",
    type: NotificationServiceType.WEBHOOK,
    displayName: "",
    enabled: true,
    settings: {},
    secretsRef: {},
    lastTestResult: createNotificationServiceTestResult(),
    ...overrides,
  };
}

export function normalizeNotificationServiceConfig(payload = {}) {
  return createNotificationServiceConfig({
    id: payload.id || "",
    type: payload.type || NotificationServiceType.WEBHOOK,
    displayName: payload.displayName || "",
    enabled: payload.enabled !== false,
    settings: payload.settings || {},
    secretsRef: payload.secretsRef || {},
    lastTestResult: createNotificationServiceTestResult(payload.lastTestResult || {}),
  });
}
