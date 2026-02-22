import { NotificationCategory } from "./enums";
import {
  createNotificationServiceConfig,
  normalizeNotificationServiceConfig,
} from "./NotificationServiceConfig";

/**
 * @typedef {Object} NotificationPolicy
 * @property {number} cooldownSeconds
 * @property {number} dedupWindowSeconds
 * @property {number} maxPerMinute
 */

/**
 * @typedef {Object} NotificationChannel
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {boolean} isActive
 * @property {string[]} triggerIds
 * @property {import('./NotificationServiceConfig').NotificationServiceConfig[]} services
 * @property {NotificationPolicy} policy
 * @property {string|null} createdAt
 * @property {string|null} updatedAt
 * @property {string|null} updatedBy
 */

export function createNotificationPolicy(overrides = {}) {
  return {
    cooldownSeconds: 0,
    dedupWindowSeconds: 0,
    maxPerMinute: 0,
    ...overrides,
  };
}

export function createNotificationChannel(overrides = {}) {
  return {
    id: "",
    name: "",
    category: NotificationCategory.NOTIFICATION,
    isActive: true,
    triggerIds: [],
    services: [],
    policy: createNotificationPolicy(),
    createdAt: null,
    updatedAt: null,
    updatedBy: null,
    ...overrides,
  };
}

export function normalizeNotificationChannel(payload = {}) {
  const services = Array.isArray(payload.services)
    ? payload.services.map((service) => normalizeNotificationServiceConfig(service))
    : [];

  return createNotificationChannel({
    id: payload.id || "",
    name: payload.name || "",
    category: payload.category || NotificationCategory.NOTIFICATION,
    isActive: payload.isActive !== false,
    triggerIds: Array.isArray(payload.triggerIds) ? payload.triggerIds : [],
    services: services.map((service) => createNotificationServiceConfig(service)),
    policy: createNotificationPolicy(payload.policy || {}),
    createdAt: payload.createdAt || null,
    updatedAt: payload.updatedAt || null,
    updatedBy: payload.updatedBy || null,
  });
}
