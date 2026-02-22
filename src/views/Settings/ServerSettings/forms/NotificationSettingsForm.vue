<template>
    <div class="p-formgrid p-grid">
        <div class="p-col-12 notification-toolbar">
            <h3 class="notification-title">{{ $t('settings.server_settings.notification_settings.title') }}</h3>
            <Button
                type="button"
                icon="pi pi-plus"
                :label="$t('settings.server_settings.notification_settings.add_new_channel')"
                class="p-button-sm add-channel-btn"
                @click="openCreateDialog"
            />
        </div>
        <div class="p-col-12">
            <div class="notification-list-card">
                <div class="table-wrap">
                    <table class="notification-table">
                        <thead>
                            <tr>
                                <th>{{ $t('settings.server_settings.notification_settings.channel_name') }}</th>
                                <th>{{ $t('settings.server_settings.notification_settings.triggers') }}</th>
                                <th>{{ $t('settings.server_settings.notification_settings.services') }}</th>
                                <th>{{ $t('settings.server_settings.notification_settings.status') }}</th>
                                <th>{{ $t('settings.server_settings.notification_settings.actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="channel in channels" :key="channel.id">
                                <td class="channel-name">{{ getChannelDisplayName(channel) }}</td>

                                <td>
                                    <div class="trigger-list">
                                        <span
                                            v-for="triggerGroup in resolveTriggerLabels(channel)"
                                            :key="`${channel.id}-${triggerGroup.key}`"
                                            class="trigger-pill"
                                            v-tooltip.bottom="{
                                                value: triggerGroup.tooltipHtml,
                                                disabled: !triggerGroup.tooltipHtml,
                                                escape: false,
                                                class: 'notification-trigger-tooltip',
                                            }"
                                        >
                                            {{ triggerGroup.label }}
                                        </span>
                                    </div>
                                </td>

                                <td>
                                    <div class="type-icons">
                                        <span
                                            v-for="(typeEntry, index) in resolveTypeIcons(channel)"
                                            :key="`${channel.id}-type-${index}`"
                                            class="type-icon-box"
                                            v-tooltip.bottom="{ value: resolveServiceTypeLabel(typeEntry.type), disabled: !typeEntry.type }"
                                        >
                                            <img
                                                v-if="typeEntry.iconSrc"
                                                :src="typeEntry.iconSrc"
                                                class="type-icon-img"
                                                :alt="typeEntry.type || 'service'"
                                            />
                                            <i v-else class="pi pi-bell"></i>
                                        </span>
                                    </div>
                                </td>

                                <td>
                                    <InputSwitch v-model="channel.isActive" />
                                </td>

                                <td>
                                    <div class="actions">
                                        <Button
                                            type="button"
                                            icon="pi pi-pencil"
                                            class="p-button-rounded p-button-text p-button-secondary p-button-sm"
                                            @click="openEditDialog(channel)"
                                        />
                                        <Button
                                            type="button"
                                            icon="pi pi-copy"
                                            class="p-button-rounded p-button-text p-button-help p-button-sm"
                                            v-tooltip.bottom="$t('settings.server_settings.notification_settings.duplicate')"
                                            @click="duplicateChannel(channel)"
                                        />
                                        <Button
                                            type="button"
                                            icon="pi pi-trash"
                                            class="p-button-rounded p-button-text p-button-danger p-button-sm"
                                            @click="removeChannel(channel.id)"
                                        />
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="channels.length === 0">
                                <td colspan="5" class="empty-row">{{ $t('settings.server_settings.notification_settings.empty') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="save-button p-field p-col-12 p-text-right">
            <div class="p-d-flex p-jc-end">
                <div>
                    <Button icon="pi pi-save" type="button" :label="$t('settings.server_settings.notification_settings.save')" @click="showDialog = true;"/>
                </div>
            </div>
        </div>

        <Dialog
            :header="$t('settings.server_settings.notification_settings.update_settings')"
            v-model:visible="showDialog"
            :style="{ width: '20vw' }"
            :modal="true"
        >
            <div class="p-fluid">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    {{ $t('settings.server_settings.notification_settings.save_notify') }}
                </span>
            </div>
            <template #footer>
                <Button
                    :label="$t('settings.server_settings.notification_settings.cancel')"
                    icon="pi pi-times"
                    @click="showDialog = false"
                    class="p-button-text p-button-sm"
                />
                <Button
                    :label="$t('settings.server_settings.notification_settings.yes')"
                    icon="pi pi-check"
                    @click="submitForm"
                    class="p-button-sm"
                />
            </template>
        </Dialog>

        <NotificationChannelDialog
            :visible="channelDialogVisible"
            :channel="selectedChannel"
            :triggerOptions="triggerOptions"
            :serviceTypeOptions="serviceTypeOptions"
            :savedServiceProfiles="savedServiceProfiles"
            @update:visible="channelDialogVisible = $event"
            @update:savedServiceProfiles="onSavedServiceProfilesUpdate"
            @confirm="onChannelDialogConfirm"
            @test="onChannelDialogTest"
        />
    </div>
</template>

<script>
import {
    createNotificationSettings,
    createNotificationChannel,
    normalizeNotificationSettings,
} from '../../../../models/notification';
import { getNotificationServiceIcon } from '../../../../models/notification/serviceIcons';
import { serverSettingService } from '../../../../services/Settings/ServerSettingsService.js';
import NotificationChannelDialog from './NotificationChannelDialog.vue';

export default {
    name: 'NotificationSettingsForm',
    props: ['serverSettings'],
    components: {
        NotificationChannelDialog,
    },
    data() {
        return {
            notificationSettings: createNotificationSettings(),
            channelDialogVisible: false,
            selectedChannel: null,
            dialogMode: 'create',
            showDialog: false,
            isLoadingNotificationSettings: false,
            isTestingNotificationService: false,
        };
    },
    computed: {
        channels() {
            return this.notificationSettings.channels;
        },
        savedServiceProfiles() {
            return Array.isArray(this.notificationSettings.savedServiceProfiles)
                ? this.notificationSettings.savedServiceProfiles
                : [];
        },
        triggerOptions() {
            const catalog = Array.isArray(this.notificationSettings.triggerCatalog)
                ? this.notificationSettings.triggerCatalog
                : [];
            if (catalog.length > 0) {
                return catalog;
            }

            const inferredTriggerIds = [
                ...new Set(
                    this.channels
                        .filter((channel) => Array.isArray(channel?.triggerIds))
                        .flatMap((channel) => channel.triggerIds)
                        .filter((id) => typeof id === 'string' && id.trim().length > 0),
                ),
            ];

            return inferredTriggerIds.map((id) => ({
                id,
                labelKey: `settings.server_settings.notification_settings.trigger_labels.${id.replace(/\./g, '_')}`,
            }));
        },
        triggerDomainMap() {
            return this.triggerOptions.reduce((acc, trigger) => {
                if (trigger && trigger.id) {
                    acc[trigger.id] = (trigger.domain || 'other').toString().toLowerCase();
                }
                return acc;
            }, {});
        },
        triggerInfoMap() {
            return this.triggerOptions.reduce((acc, trigger) => {
                if (trigger && trigger.id) {
                    acc[trigger.id] = trigger;
                }
                return acc;
            }, {});
        },
        serviceTypeOptions() {
            const schemas = Array.isArray(this.notificationSettings.serviceTypeSchemas)
                ? this.notificationSettings.serviceTypeSchemas
                : [];
            if (schemas.length > 0) {
                return schemas;
            }

            const inferredTypes = [
                ...new Set(
                    this.channels
                        .filter((channel) => Array.isArray(channel?.services))
                        .flatMap((channel) => channel.services)
                        .map((service) => service?.type)
                        .filter((type) => typeof type === 'string' && type.trim().length > 0),
                ),
            ];

            return inferredTypes.map((type) => ({
                type,
                labelKey: `settings.server_settings.notification_settings.dialog.service_types.${type}`,
                fields: [],
            }));
        },
        serviceLabelMap() {
            return this.serviceTypeOptions.reduce((acc, schema) => {
                if (schema && schema.type) {
                    acc[schema.type] = schema.labelKey || `settings.server_settings.notification_settings.dialog.service_types.${schema.type}`;
                }
                return acc;
            }, {});
        },
    },
    watch: {
        serverSettings: {
            immediate: true,
            handler(newValue) {
                if (!newValue) {
                    return;
                }
                this.notificationSettings = this.createBaseNotificationSettings(newValue.notificationSettings);
                if (!this.hasCatalogs(this.notificationSettings)) {
                    this.ensureCatalogsLoaded();
                }
            },
        },
    },
    mounted() {
        if (!this.hasCatalogs(this.notificationSettings)) {
            this.ensureCatalogsLoaded();
        }
    },
    methods: {
        extractNotificationPayload(rawSettings) {
            if (!rawSettings || typeof rawSettings !== 'object') {
                return createNotificationSettings();
            }

            if (rawSettings.notificationSettings && typeof rawSettings.notificationSettings === 'object') {
                return rawSettings.notificationSettings;
            }

            if (rawSettings.data && typeof rawSettings.data === 'object') {
                if (rawSettings.data.notificationSettings && typeof rawSettings.data.notificationSettings === 'object') {
                    return rawSettings.data.notificationSettings;
                }
                if (
                    rawSettings.data.channels
                    || rawSettings.data.savedServiceProfiles
                    || rawSettings.data.triggerCatalog
                    || rawSettings.data.serviceTypeSchemas
                ) {
                    return rawSettings.data;
                }
            }

            return rawSettings;
        },
        createBaseNotificationSettings(rawSettings = null) {
            const source = this.extractNotificationPayload(rawSettings || createNotificationSettings());
            const catalogRoot = source.catalog && typeof source.catalog === 'object' ? source.catalog : {};
            const normalizedSource = {
                ...source,
                triggerCatalog: Array.isArray(source.triggerCatalog)
                    ? source.triggerCatalog
                    : (Array.isArray(source.triggers)
                        ? source.triggers
                        : (Array.isArray(catalogRoot.triggers) ? catalogRoot.triggers : [])),
                savedServiceProfiles: Array.isArray(source.savedServiceProfiles)
                    ? source.savedServiceProfiles
                    : (Array.isArray(source.serviceProfiles) ? source.serviceProfiles : []),
                serviceTypeSchemas: Array.isArray(source.serviceTypeSchemas)
                    ? source.serviceTypeSchemas
                    : (Array.isArray(source.serviceSchemas)
                        ? source.serviceSchemas
                        : (Array.isArray(source.serviceTypes)
                            ? source.serviceTypes
                            : (Array.isArray(catalogRoot.serviceTypes) ? catalogRoot.serviceTypes : []))),
            };
            const normalized = normalizeNotificationSettings(normalizedSource);
            if (!Array.isArray(normalized.channels)) {
                normalized.channels = [];
            }
            if (!Array.isArray(normalized.triggerCatalog)) {
                normalized.triggerCatalog = [];
            }
            if (!Array.isArray(normalized.savedServiceProfiles)) {
                normalized.savedServiceProfiles = [];
            }
            if (!Array.isArray(normalized.serviceTypeSchemas)) {
                normalized.serviceTypeSchemas = [];
            }
            return normalized;
        },
        hasCatalogs(settings) {
            const hasTriggers = Array.isArray(settings?.triggerCatalog) && settings.triggerCatalog.length > 0;
            const hasServices = Array.isArray(settings?.serviceTypeSchemas) && settings.serviceTypeSchemas.length > 0;
            return hasTriggers && hasServices;
        },
        async ensureCatalogsLoaded() {
            if (this.hasCatalogs(this.notificationSettings) || this.isLoadingNotificationSettings) {
                return;
            }

            await this.loadNotificationSettings();

            if (this.hasCatalogs(this.notificationSettings)) {
                return;
            }

            const { response, error } = await serverSettingService.getConfigurations();
            if (!error && response && response.status === 200) {
                const settingsFromConfigurations = response.data?.notificationSettings || response.data;
                this.notificationSettings = this.createBaseNotificationSettings(settingsFromConfigurations);
            }
        },
        async loadNotificationSettings() {
            if (this.isLoadingNotificationSettings) {
                return;
            }
            this.isLoadingNotificationSettings = true;
            const { response, error } = await serverSettingService.getNotificationSettings();
            if (!error && response && response.status === 200) {
                this.notificationSettings = this.createBaseNotificationSettings(response.data);
            }
            this.isLoadingNotificationSettings = false;
        },
        async openCreateDialog() {
            await this.ensureCatalogsLoaded();
            this.dialogMode = 'create';
            this.selectedChannel = {
                id: null,
                name: `${this.$t('settings.server_settings.notification_settings.new_channel_prefix')} ${this.channels.length + 1}`,
                triggerIds: [],
                services: [],
                isActive: true,
                category: 'notification',
            };
            this.channelDialogVisible = true;
        },
        async openEditDialog(channel) {
            await this.ensureCatalogsLoaded();
            this.dialogMode = 'edit';
            this.selectedChannel = {
                id: channel.id,
                name: this.getChannelDisplayName(channel),
                triggerIds: Array.isArray(channel.triggerIds) ? [...channel.triggerIds] : [],
                services: Array.isArray(channel.services)
                    ? channel.services.map((service) => ({
                        id: service.id || null,
                        type: service.type || 'mattermost',
                        displayName: service.displayName || '',
                        enabled: service.enabled !== false,
                        secretsRef: service.secretsRef || {},
                        lastTestResult: service.lastTestResult || {
                            status: 'idle',
                            message: null,
                            testedAt: null,
                        },
                        settings: {
                            ...(service.settings || {}),
                        },
                    }))
                    : [],
                isActive: channel.isActive !== false,
                category: channel.category || 'notification',
            };
            this.channelDialogVisible = true;
        },
        onChannelDialogConfirm(payload) {
            const normalizedChannel = createNotificationChannel({
                id: payload.id || `channel.new.${Date.now()}`,
                name: payload.name,
                category: payload.category || 'notification',
                isActive: payload.isActive !== false,
                triggerIds: Array.isArray(payload.triggerIds) ? payload.triggerIds : [],
                services: Array.isArray(payload.services)
                    ? payload.services.map((service, index) => ({
                        id: service.id || `${payload.id || 'channel.new'}.service.${index}.${Date.now()}`,
                        type: service.type || 'mattermost',
                        displayName: service.displayName || '',
                        enabled: service.enabled !== false,
                        settings: service.settings || {},
                        secretsRef: service.secretsRef || {},
                        lastTestResult: service.lastTestResult || {
                            status: 'idle',
                            message: null,
                            testedAt: null,
                        },
                    }))
                    : [],
            });

            if (this.dialogMode === 'edit' && payload.id) {
                const index = this.channels.findIndex((channel) => channel.id === payload.id);
                if (index > -1) {
                    this.notificationSettings.channels.splice(index, 1, normalizedChannel);
                }
            } else {
                this.notificationSettings.channels.push(normalizedChannel);
            }
        },
        onSavedServiceProfilesUpdate(profiles) {
            this.notificationSettings.savedServiceProfiles = Array.isArray(profiles)
                ? profiles
                : [];
        },
        normalizeServiceTestPayload(service) {
            return {
                id: service?.id || '',
                type: service?.type || 'webhook',
                displayName: service?.displayName || '',
                enabled: service?.enabled !== false,
                settings: service?.settings || {},
                secretsRef: service?.secretsRef || {},
                lastTestResult: service?.lastTestResult || {
                    status: 'idle',
                    message: null,
                    testedAt: null,
                },
            };
        },
        getServiceLabel(service) {
            if (service?.displayName && service.displayName.trim().length > 0) {
                return service.displayName;
            }
            const labelKey = this.serviceLabelMap[service?.type];
            return labelKey ? this.$t(labelKey) : (service?.type || this.$t('settings.server_settings.notification_settings.type'));
        },
        async testSingleService(service) {
            const payload = this.normalizeServiceTestPayload(service);
            const { response, error } = await serverSettingService.testNotificationService(payload);
            if (error || !response || response.status !== 200 || !response.data) {
                return {
                    ok: false,
                    result: null,
                    message: this.$t('settings.server_settings.notification_settings.dialog.test_request_failed'),
                };
            }

            const result = response.data;
            return {
                ok: String(result.status).toLowerCase() === 'success',
                result,
                message: result.message || null,
            };
        },
        async onChannelDialogTest(payload) {
            if (this.isTestingNotificationService) {
                return;
            }

            const allServices = Array.isArray(payload?.services) ? payload.services : [];
            if (allServices.length === 0) {
                this.$toast.add({
                    severity: 'warn',
                    detail: this.$t('settings.server_settings.notification_settings.dialog.test_requires_service'),
                    summary: this.$t("computer.task.toast_summary"),
                    life: 2500,
                });
                return;
            }

            if (payload?.scope === 'service') {
                this.isTestingNotificationService = true;
                const testedService = payload.service || allServices[payload.serviceIndex];
                const response = await this.testSingleService(testedService);
                this.isTestingNotificationService = false;

                this.$toast.add({
                    severity: response.ok ? 'success' : 'error',
                    detail: response.message || this.$t(response.ok
                        ? 'settings.server_settings.notification_settings.dialog.service_test_success'
                        : 'settings.server_settings.notification_settings.dialog.service_test_failed'),
                    summary: this.$t("computer.task.toast_summary"),
                    life: 3000,
                });
                return;
            }

            const enabledServices = allServices.filter((service) => service?.enabled !== false);
            if (enabledServices.length === 0) {
                this.$toast.add({
                    severity: 'warn',
                    detail: this.$t('settings.server_settings.notification_settings.dialog.test_requires_enabled_service'),
                    summary: this.$t("computer.task.toast_summary"),
                    life: 2500,
                });
                return;
            }

            this.isTestingNotificationService = true;
            const results = await Promise.all(
                enabledServices.map(async (service) => ({
                    service,
                    ...(await this.testSingleService(service)),
                })),
            );
            this.isTestingNotificationService = false;

            const successCount = results.filter((item) => item.ok).length;
            const failedCount = results.length - successCount;

            if (failedCount === 0) {
                this.$toast.add({
                    severity: 'success',
                    detail: this.$t('settings.server_settings.notification_settings.dialog.global_test_all_success', {
                        success: successCount,
                        total: results.length,
                    }),
                    summary: this.$t("computer.task.toast_summary"),
                    life: 3000,
                });
                return;
            }

            const failedServices = results
                .filter((item) => !item.ok)
                .map((item) => this.getServiceLabel(item.service))
                .join(', ');
            const firstFailureReason = results.find((item) => !item.ok && item.message)?.message;

            this.$toast.add({
                severity: successCount > 0 ? 'warn' : 'error',
                detail: `${this.$t('settings.server_settings.notification_settings.dialog.global_test_partial', {
                    success: successCount,
                    failed: failedCount,
                    total: results.length,
                    services: failedServices,
                })}${firstFailureReason ? ` (${firstFailureReason})` : ''}`,
                summary: this.$t("computer.task.toast_summary"),
                life: 4000,
            });
        },
        async submitForm() {
            const payload = this.createBaseNotificationSettings(this.notificationSettings);
            const { response, error } = await serverSettingService.updateNotificationSettings(payload);

            if (error) {
                this.$toast.add({
                    severity: 'error',
                    detail: this.$t('settings.server_settings.notification_settings.save_error'),
                    summary: this.$t("computer.task.toast_summary"),
                    life: 3000,
                });
                this.showDialog = false;
                return;
            }

            if (response && response.status === 200) {
                this.notificationSettings = this.createBaseNotificationSettings(response.data || payload);
                this.$toast.add({
                    severity: 'success',
                    detail: this.$t('settings.server_settings.notification_settings.save_success'),
                    summary: this.$t("computer.task.toast_summary"),
                    life: 2500,
                });
            }

            this.showDialog = false;
        },
        removeChannel(channelId) {
            this.notificationSettings.channels = this.channels.filter((channel) => channel.id !== channelId);
        },
        duplicateChannel(channel) {
            if (!channel) {
                return;
            }

            const duplicatedChannelId = this.createUniqueId('channel.copy');
            const baseName = (this.getChannelDisplayName(channel) || '').trim()
                || `${this.$t('settings.server_settings.notification_settings.new_channel_prefix')} ${this.channels.length + 1}`;
            const duplicatedName = `${baseName} (${this.$t('settings.server_settings.notification_settings.copy_suffix')})`;

            const duplicatedChannel = createNotificationChannel({
                id: duplicatedChannelId,
                name: duplicatedName,
                category: channel.category || 'notification',
                isActive: channel.isActive !== false,
                triggerIds: Array.isArray(channel.triggerIds) ? [...channel.triggerIds] : [],
                services: Array.isArray(channel.services)
                    ? channel.services.map((service, index) => ({
                        id: this.createUniqueId(`${duplicatedChannelId}.service.${index}`),
                        type: service?.type || 'mattermost',
                        displayName: service?.displayName || '',
                        enabled: service?.enabled !== false,
                        settings: this.cloneObject(service?.settings),
                        secretsRef: this.cloneObject(service?.secretsRef),
                        lastTestResult: {
                            status: 'idle',
                            message: null,
                            testedAt: null,
                        },
                    }))
                    : [],
                policy: this.cloneObject(channel.policy),
                createdAt: null,
                updatedAt: null,
                updatedBy: null,
            });

            this.notificationSettings.channels.push(duplicatedChannel);
        },
        createUniqueId(prefix) {
            return `${prefix}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;
        },
        cloneObject(value) {
            if (value === undefined || value === null) {
                return {};
            }
            return JSON.parse(JSON.stringify(value));
        },
        getChannelDisplayName(channel) {
            if (channel.nameKey) {
                return this.$t(channel.nameKey);
            }
            return channel.name || '';
        },
        resolveTypeIcons(channel) {
            if (!channel.services || !channel.services.length) {
                return [{ type: null, iconSrc: null }];
            }

            return channel.services.slice(0, 5).map((service) => ({
                type: service?.type || null,
                iconSrc: getNotificationServiceIcon(service?.type),
            }));
        },
        resolveServiceTypeLabel(type) {
            if (!type) {
                return null;
            }
            const labelKey = this.serviceLabelMap[type] || `settings.server_settings.notification_settings.dialog.service_types.${type}`;
            return this.$t(labelKey);
        },
        resolveTriggerLabels(channel) {
            if (!channel.triggerIds || !channel.triggerIds.length) {
                return [{
                    key: 'none',
                    label: this.$t('settings.server_settings.notification_settings.no_trigger'),
                    tooltipHtml: null,
                }];
            }

            const groupedDetails = channel.triggerIds.reduce((acc, id) => {
                const domain = this.resolveTriggerDomain(id);
                if (!acc[domain]) {
                    acc[domain] = [];
                }
                acc[domain].push(id);
                return acc;
            }, {});

            const domainOrder = ['user', 'agent', 'task', 'policy', 'system', 'other'];
            const domains = Object.keys(groupedDetails).sort((a, b) => {
                const indexA = domainOrder.indexOf(a);
                const indexB = domainOrder.indexOf(b);
                const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
                const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
                if (safeIndexA !== safeIndexB) {
                    return safeIndexA - safeIndexB;
                }
                return a.localeCompare(b);
            });

            return domains.slice(0, 5).map((domain) => {
                const triggerIds = groupedDetails[domain];
                const tooltipHtml = triggerIds
                    .map((triggerId) => `<div class="notification-trigger-tooltip-row">${this.escapeTooltipHtml(this.resolveTriggerLabel(triggerId))}</div>`)
                    .join('');

                return {
                    key: `${domain}-${triggerIds.length}`,
                    label: this.$t('settings.server_settings.notification_settings.trigger_group_summary', {
                        group: this.resolveTriggerGroupLabel(domain),
                        count: triggerIds.length,
                    }),
                    tooltipHtml: tooltipHtml || null,
                };
            });
        },
        resolveTriggerDomain(triggerId) {
            if (this.triggerDomainMap[triggerId]) {
                return this.triggerDomainMap[triggerId];
            }
            if (typeof triggerId === 'string' && triggerId.includes('.')) {
                return triggerId.split('.')[0].toLowerCase();
            }
            return 'other';
        },
        resolveTriggerGroupLabel(domain) {
            const normalizedDomain = (domain || 'other').toString().toLowerCase();
            const labelKey = `settings.server_settings.notification_settings.dialog.trigger_groups.${normalizedDomain}`;
            const translated = this.$t(labelKey);
            if (translated !== labelKey) {
                return translated;
            }
            return normalizedDomain.charAt(0).toUpperCase() + normalizedDomain.slice(1);
        },
        resolveTriggerLabel(triggerId) {
            const trigger = this.triggerInfoMap[triggerId];
            if (trigger && trigger.labelKey) {
                return this.$t(trigger.labelKey);
            }
            if (typeof triggerId === 'string' && triggerId.trim().length > 0) {
                const labelKey = `settings.server_settings.notification_settings.trigger_labels.${triggerId.replace(/\./g, '_')}`;
                const translated = this.$t(labelKey);
                if (translated !== labelKey) {
                    return translated;
                }
                return triggerId;
            }
            return this.$t('settings.server_settings.notification_settings.no_trigger');
        },
        escapeTooltipHtml(value) {
            if (value === null || value === undefined) {
                return '';
            }
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },
    },
};
</script>

<style scoped>
.notification-list-card {
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    overflow: hidden;
    background: var(--surface-card);
}

.notification-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem 0.5rem 0.5rem;
    margin-bottom: 15px;
}

.notification-title {
    margin: 0;
}

.add-channel-btn {
    width: auto !important;
    white-space: nowrap;
    flex: 0 0 auto;
}

.table-wrap {
    overflow-x: auto;
}

.notification-table {
    width: 100%;
    border-collapse: collapse;
}

.notification-table th {
    text-align: left;
    padding: 0.75rem 1rem;
    background: var(--surface-100);
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-color);
}

.notification-table td {
    border-top: 1px solid var(--surface-border);
    padding: 0.75rem 1rem;
    vertical-align: middle;
}

.channel-name {
    font-size: 1rem;
    min-width: 12rem;
}

.type-icons {
    display: flex;
    gap: 0.5rem;
}

.type-icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 4px;
    background: var(--surface-100);
    color: var(--text-color-secondary);
}

.type-icon-img {
    width: 1.2rem;
    height: 1.2rem;
    object-fit: contain;
}

.trigger-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    min-width: 12.5rem;
}

.trigger-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem 0.6rem;
    min-height: 2rem;
    border-radius: 6px;
    background: var(--surface-100);
    font-size: 0.85rem;
}

.actions {
    display: flex;
    gap: 0.35rem;
}

.empty-row {
    text-align: center;
    color: var(--text-color-secondary);
}

.save-button {
    margin-top: 14px;
}

@media (max-width: 768px) {
    .notification-table th {
        font-size: 0.85rem;
    }

    .channel-name {
        font-size: 0.95rem;
    }
}
</style>

<style>
.p-tooltip.notification-trigger-tooltip {
    max-width: none !important;
}

.p-tooltip.notification-trigger-tooltip .p-tooltip-text {
    max-width: none !important;
    width: auto !important;
    display: inline-block;
    white-space: nowrap !important;
    padding: 0.2rem 0.35rem;
}

.p-tooltip.notification-trigger-tooltip .notification-trigger-tooltip-row {
    display: block;
    white-space: nowrap !important;
    padding: 0.18rem 0.2rem;
}

.p-tooltip.notification-trigger-tooltip .notification-trigger-tooltip-row + .notification-trigger-tooltip-row {
    border-top: 1px solid rgba(128, 128, 128, 0.28);
}
</style>
