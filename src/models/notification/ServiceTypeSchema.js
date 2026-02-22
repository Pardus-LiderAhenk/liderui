import { NotificationServiceType } from "./enums";

/**
 * @typedef {Object} ServiceFieldSchema
 * @property {string} key
 * @property {string} labelKey
 * @property {string} inputType
 * @property {boolean} required
 * @property {boolean} secret
 * @property {boolean} repeatable
 * @property {string} placeholder
 */

/**
 * @typedef {Object} ServiceTypeSchema
 * @property {string} type
 * @property {string} labelKey
 * @property {ServiceFieldSchema[]} fields
 */

export function createServiceFieldSchema(overrides = {}) {
  return {
    key: "",
    labelKey: "",
    inputType: "text",
    required: false,
    secret: false,
    repeatable: false,
    placeholder: "",
    ...overrides,
  };
}

export function createServiceTypeSchema(overrides = {}) {
  return {
    type: NotificationServiceType.WEBHOOK,
    labelKey: "",
    fields: [],
    ...overrides,
  };
}

export function normalizeServiceTypeSchema(payload = {}) {
  const fields = Array.isArray(payload.fields)
    ? payload.fields.map((field) => createServiceFieldSchema(field))
    : [];

  return createServiceTypeSchema({
    type: payload.type || NotificationServiceType.WEBHOOK,
    labelKey: payload.labelKey || "",
    fields,
  });
}
