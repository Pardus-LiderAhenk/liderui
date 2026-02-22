import {
  createNotificationChannel,
  normalizeNotificationChannel,
} from "./NotificationChannel";
import {
  createServiceTypeSchema,
  normalizeServiceTypeSchema,
} from "./ServiceTypeSchema";
import {
  createNotificationServiceConfig,
  normalizeNotificationServiceConfig,
} from "./NotificationServiceConfig";
import {
  createNotificationTrigger,
  normalizeNotificationTrigger,
} from "./NotificationTrigger";

/**
 * @typedef {Object} NotificationSettings
 * @property {number} version
 * @property {import('./NotificationChannel').NotificationChannel[]} channels
 * @property {import('./NotificationServiceConfig').NotificationServiceConfig[]} savedServiceProfiles
 * @property {import('./NotificationTrigger').NotificationTrigger[]} triggerCatalog
 * @property {import('./ServiceTypeSchema').ServiceTypeSchema[]} serviceTypeSchemas
 * @property {string|null} updatedAt
 * @property {string|null} updatedBy
 */

export function createNotificationSettings(overrides = {}) {
  return {
    version: 1,
    channels: [],
    savedServiceProfiles: [],
    triggerCatalog: [],
    serviceTypeSchemas: [],
    updatedAt: null,
    updatedBy: null,
    ...overrides,
  };
}

export function normalizeNotificationSettings(payload = {}) {
  const channels = Array.isArray(payload.channels)
    ? payload.channels.map((channel) => normalizeNotificationChannel(channel))
    : [];

  const triggerCatalog = Array.isArray(payload.triggerCatalog)
    ? payload.triggerCatalog.map((trigger) => normalizeNotificationTrigger(trigger))
    : [];

  const savedServiceProfiles = Array.isArray(payload.savedServiceProfiles)
    ? payload.savedServiceProfiles.map((profile) => normalizeNotificationServiceConfig(profile))
    : [];

  const serviceTypeSchemas = Array.isArray(payload.serviceTypeSchemas)
    ? payload.serviceTypeSchemas.map((schema) => normalizeServiceTypeSchema(schema))
    : [];

  return createNotificationSettings({
    version: Number.isInteger(payload.version) ? payload.version : 1,
    channels: channels.map((channel) => createNotificationChannel(channel)),
    savedServiceProfiles: savedServiceProfiles.map((profile) => createNotificationServiceConfig(profile)),
    triggerCatalog: triggerCatalog.map((trigger) => createNotificationTrigger(trigger)),
    serviceTypeSchemas: serviceTypeSchemas.map((schema) => createServiceTypeSchema(schema)),
    updatedAt: payload.updatedAt || null,
    updatedBy: payload.updatedBy || null,
  });
}
