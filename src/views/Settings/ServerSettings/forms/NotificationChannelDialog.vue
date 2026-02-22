<template>
    <Dialog
        :header="$t('settings.server_settings.notification_settings.dialog.title')"
        v-model:visible="modalVisible"
        :style="{ width: '46vw' }"
        :modal="true"
    >
        <div class="p-fluid">
            <div class="p-field">
                <label for="channelName">{{ $t('settings.server_settings.notification_settings.dialog.channel_name') }}</label>
                <InputText
                    id="channelName"
                    v-model="localForm.name"
                    :class="validation.name ? 'p-invalid' : ''"
                />
                <small v-if="validation.name" class="p-error">
                    {{ $t('settings.server_settings.notification_settings.dialog.channel_name_required') }}
                </small>
            </div>

            <div class="p-field">
                <label>{{ $t('settings.server_settings.notification_settings.dialog.triggers') }}</label>
                <div class="trigger-search">
                    <span class="p-input-icon-left trigger-search-input-wrap">
                        <i class="pi pi-search"></i>
                        <InputText
                            v-model="triggerSearchQuery"
                            class="trigger-search-input"
                            :placeholder="$t('settings.server_settings.notification_settings.dialog.trigger_search_placeholder')"
                        />
                    </span>
                </div>
                <div class="trigger-box">
                    <Accordion
                        v-if="filteredTriggerGroups.length > 0"
                        class="trigger-accordion"
                        :multiple="true"
                        v-model:activeIndex="triggerActiveIndexes"
                    >
                        <AccordionTab
                            v-for="(group, groupIndex) in filteredTriggerGroups"
                            :key="`trigger-group-${group.domain}`"
                        >
                            <template #header>
                                <div class="trigger-accordion-header">
                                    <div class="p-field-checkbox trigger-group-checkbox" @click.stop>
                                        <Checkbox
                                            :inputId="`trigger-group-${group.domain}-${groupIndex}`"
                                            :binary="true"
                                            :modelValue="isGroupSelected(group)"
                                            :indeterminate="isGroupIndeterminate(group)"
                                            @update:modelValue="toggleTriggerGroup(group, $event)"
                                        />
                                        <label :for="`trigger-group-${group.domain}-${groupIndex}`" @click.stop>
                                            {{ triggerGroupLabel(group.domain) }}
                                        </label>
                                    </div>
                                    <span class="trigger-group-count">{{ selectedGroupCount(group) }}/{{ group.triggers.length }}</span>
                                </div>
                            </template>

                            <div class="trigger-group-items">
                                <div
                                    v-for="trigger in group.triggers"
                                    :key="trigger.id"
                                    class="p-field-checkbox trigger-item"
                                >
                                    <Checkbox
                                        :inputId="`trigger-${trigger.id}`"
                                        v-model="localForm.triggerIds"
                                        :value="trigger.id"
                                    />
                                    <label :for="`trigger-${trigger.id}`">{{ $t(trigger.labelKey) }}</label>
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>
                    <div
                        v-if="filteredTriggerGroups.length === 0"
                        class="empty-trigger"
                    >
                        {{ hasTriggerFilter
                            ? $t('settings.server_settings.notification_settings.dialog.trigger_search_no_result')
                            : $t('settings.server_settings.notification_settings.no_trigger') }}
                    </div>
                </div>
            </div>

            <div class="p-field">
                <div class="services-header">
                    <label>{{ $t('settings.server_settings.notification_settings.dialog.services') }}</label>
                    <div class="services-header-actions">
                        <Button
                            type="button"
                            icon="pi pi-download"
                            class="p-button-sm p-button-outlined add-service-btn"
                            :label="$t('settings.server_settings.notification_settings.dialog.add_from_saved')"
                            :disabled="normalizedSavedServiceProfiles.length === 0"
                            @click="openSavedProfilePicker"
                        />
                        <Button
                            type="button"
                            icon="pi pi-plus"
                            class="p-button-sm p-button-outlined add-service-btn"
                            :label="$t('settings.server_settings.notification_settings.dialog.add_service')"
                            @click="toggleServiceMenu"
                        />
                    </div>
                    <Menu ref="serviceMenu" :model="serviceMenuItems" :popup="true">
                        <template #item="{ item }">
                            <a
                                class="p-menuitem-link service-menu-item"
                                href="#"
                                @click.prevent="handleServiceMenuItemClick(item)"
                            >
                                <img
                                    v-if="serviceIcon(item.type)"
                                    :src="serviceIcon(item.type)"
                                    :alt="item.type || 'service'"
                                    class="service-menu-icon"
                                />
                                <span class="p-menuitem-text">{{ item.label }}</span>
                            </a>
                        </template>
                    </Menu>
                </div>

                <div v-if="localForm.services.length === 0" class="empty-service">
                    {{ $t('settings.server_settings.notification_settings.dialog.no_service') }}
                </div>
                <small v-if="validation.services" class="p-error">
                    {{ $t('settings.server_settings.notification_settings.dialog.service_required') }}
                </small>

                <Accordion
                    v-if="localForm.services.length > 0"
                    class="service-accordion"
                    :multiple="true"
                    v-model:activeIndex="serviceActiveIndexes"
                >
                    <AccordionTab
                        v-for="(service, index) in localForm.services"
                        :key="`${service.type}-${index}`"
                    >
                        <template #header>
                            <div class="service-accordion-header">
                                <div class="service-title-wrap">
                                    <img
                                        v-if="serviceIcon(service.type)"
                                        :src="serviceIcon(service.type)"
                                        :alt="service.type || 'service'"
                                        class="service-type-icon"
                                    />
                                    <strong>{{ $t(serviceLabelKey(service.type)) }}</strong>
                                </div>
                                <div class="service-actions" @click.stop>
                                    <Button
                                        type="button"
                                        icon="pi pi-save"
                                        class="p-button-rounded p-button-text p-button-sm"
                                        :title="$t('settings.server_settings.notification_settings.dialog.save_as_profile')"
                                        @click.stop="openSaveProfileDialog(service)"
                                    />
                                    <Button
                                        type="button"
                                        icon="pi pi-play"
                                        class="p-button-rounded p-button-text p-button-sm"
                                        @click.stop="emitServiceTest(index)"
                                    />
                                    <Button
                                        type="button"
                                        icon="pi pi-trash"
                                        class="p-button-rounded p-button-text p-button-danger p-button-sm"
                                        @click.stop="removeService(index)"
                                    />
                                </div>
                            </div>
                        </template>

                        <div class="p-grid" v-if="serviceFields(service.type).length > 0">
                            <div v-if="isAppriseService(service.type)" class="p-col-12">
                                <div class="apprise-doc-hint">
                                    <i class="pi pi-info-circle apprise-doc-icon" aria-hidden="true"></i>
                                    <span>{{ $t('settings.server_settings.notification_settings.dialog.apprise_docs_hint') }}</span>
                                    <a
                                        class="apprise-doc-link"
                                        href="https://appriseit.com/services/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {{ $t('settings.server_settings.notification_settings.dialog.apprise_docs_link') }}
                                    </a>
                                </div>
                            </div>
                            <div
                                v-for="field in serviceFields(service.type)"
                                :key="`${service.type}-${field.key}`"
                                class="p-col-12"
                                :class="{ 'p-md-4': !field.repeatable }"
                            >
                                <template v-if="field.repeatable">
                                    <label>{{ $t(field.labelKey) }}</label>
                                    <div class="repeatable-field">
                                        <div
                                            v-for="(item, ri) in getRepeatableItems(service, field.key)"
                                            :key="`${field.key}-${ri}`"
                                            class="repeatable-row"
                                        >
                                            <InputText
                                                :modelValue="item"
                                                @update:modelValue="updateRepeatableItem(service, field.key, ri, $event)"
                                                :type="fieldInputType(field)"
                                                :placeholder="field.placeholder || ''"
                                                class="repeatable-input"
                                            />
                                            <Button
                                                type="button"
                                                icon="pi pi-minus"
                                                class="p-button-rounded p-button-text p-button-danger p-button-sm"
                                                @click="removeRepeatableItem(service, field.key, ri)"
                                                :disabled="getRepeatableItems(service, field.key).length <= 1 && field.required"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            icon="pi pi-plus"
                                            :label="repeatableAddLabel(field)"
                                            class="p-button-outlined p-button-sm add-repeatable-btn"
                                            @click="addRepeatableItem(service, field.key)"
                                        />
                                    </div>
                                </template>
                                <template v-else>
                                    <label>{{ $t(field.labelKey) }}</label>
                                    <Textarea
                                        v-if="field.inputType === 'textarea'"
                                        v-model="service.settings[field.key]"
                                        :autoResize="true"
                                        rows="2"
                                        :placeholder="field.placeholder || ''"
                                    />
                                    <InputText
                                        v-else
                                        v-model="service.settings[field.key]"
                                        :type="fieldInputType(field)"
                                        :placeholder="field.placeholder || ''"
                                    />
                                </template>
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
            </div>
        </div>

        <template #footer>
            <Button
                :label="$t('settings.server_settings.notification_settings.dialog.test')"
                icon="pi pi-play"
                @click="emitTest"
                class="p-button-text p-button-sm"
            />
            <Button
                :label="$t('settings.server_settings.notification_settings.dialog.cancel')"
                icon="pi pi-times"
                @click="modalVisible = false"
                class="p-button-text p-button-sm"
            />
            <Button
                :label="$t('settings.server_settings.notification_settings.dialog.confirm')"
                icon="pi pi-check"
                @click="submit"
                :disabled="localForm.services.length === 0"
                class="p-button-sm"
            />
        </template>
    </Dialog>

    <Dialog
        :header="$t('settings.server_settings.notification_settings.dialog.add_from_saved_title')"
        v-model:visible="savedProfilePickerVisible"
        :style="{ width: '36vw' }"
        :modal="true"
    >
        <div class="p-fluid">
            <div v-if="normalizedSavedServiceProfiles.length === 0" class="empty-service">
                {{ $t('settings.server_settings.notification_settings.dialog.no_saved_profiles') }}
            </div>
            <div v-else class="saved-profile-list">
                <div
                    v-for="profile in normalizedSavedServiceProfiles"
                    :key="profile.id"
                    class="saved-profile-row"
                >
                    <div class="saved-profile-meta">
                        <div class="saved-profile-title-wrap">
                            <img
                                v-if="serviceIcon(profile.type)"
                                :src="serviceIcon(profile.type)"
                                :alt="profile.type || 'service'"
                                class="saved-profile-icon"
                            />
                            <div class="saved-profile-title">{{ savedProfileDisplayName(profile) }}</div>
                        </div>
                        <small class="saved-profile-type">{{ $t(serviceLabelKey(profile.type)) }}</small>
                    </div>
                    <div class="saved-profile-actions">
                        <Button
                            type="button"
                            icon="pi pi-plus"
                            class="p-button-sm p-button-outlined saved-profile-use-btn"
                            :label="$t('settings.server_settings.notification_settings.dialog.use_profile')"
                            @click="addServiceFromSavedProfile(profile)"
                        />
                        <Button
                            type="button"
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-text p-button-danger p-button-sm"
                            @click="removeSavedProfile(profile.id)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Dialog>

    <Dialog
        :header="$t('settings.server_settings.notification_settings.dialog.save_profile_title')"
        v-model:visible="saveProfileDialogVisible"
        :style="{ width: '30vw' }"
        :modal="true"
    >
        <div class="p-fluid">
            <div class="p-field">
                <label for="profileDisplayName">{{ $t('settings.server_settings.notification_settings.dialog.saved_profile_name') }}</label>
                <InputText
                    id="profileDisplayName"
                    v-model="saveProfileDisplayName"
                    :class="saveProfileNameError ? 'p-invalid' : ''"
                />
                <small v-if="saveProfileNameError" class="p-error">
                    {{ $t('settings.server_settings.notification_settings.dialog.saved_profile_name_required') }}
                </small>
            </div>
        </div>
        <template #footer>
            <Button
                :label="$t('settings.server_settings.notification_settings.dialog.cancel')"
                icon="pi pi-times"
                @click="saveProfileDialogVisible = false"
                class="p-button-text p-button-sm"
            />
            <Button
                :label="$t('settings.server_settings.notification_settings.dialog.confirm')"
                icon="pi pi-check"
                @click="confirmSaveProfile"
                class="p-button-sm"
            />
        </template>
    </Dialog>
</template>

<script>
import { getNotificationServiceIcon } from '../../../../models/notification/serviceIcons';

export default {
    name: 'NotificationChannelDialog',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        channel: {
            type: Object,
            default: null,
        },
        triggerOptions: {
            type: Array,
            default: () => [],
        },
        serviceTypeOptions: {
            type: Array,
            default: () => [],
        },
        savedServiceProfiles: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['update:visible', 'update:savedServiceProfiles', 'confirm', 'test'],
    data() {
        return {
            localForm: this.createInitialForm(),
            triggerSearchQuery: '',
            triggerActiveIndexes: [],
            serviceActiveIndexes: [],
            savedProfilePickerVisible: false,
            saveProfileDialogVisible: false,
            saveProfileDisplayName: '',
            saveProfileNameError: false,
            serviceToSaveAsProfile: null,
            validation: {
                name: false,
                services: false,
            },
        };
    },
    computed: {
        modalVisible: {
            get() {
                return this.visible;
            },
            set(value) {
                this.$emit('update:visible', value);
            },
        },
        serviceMenuItems() {
            return this.availableServiceTypes.map((type) => ({
                type,
                label: this.$t(this.serviceLabelKey(type)),
                command: () => this.addServiceByType(type),
            }));
        },
        serviceSchemaMap() {
            return this.serviceTypeOptions.reduce((acc, option) => {
                if (option && option.type) {
                    acc[option.type] = option;
                }
                return acc;
            }, {});
        },
        availableServiceTypes() {
            if (Array.isArray(this.serviceTypeOptions) && this.serviceTypeOptions.length > 0) {
                return this.serviceTypeOptions.map((option) => option.type).filter((type) => !!type);
            }
            return [];
        },
        triggerGroups() {
            const grouped = this.triggerOptions.reduce((acc, trigger) => {
                if (!trigger || !trigger.id) {
                    return acc;
                }
                const domain = (trigger.domain || 'other').toString().toLowerCase();
                if (!acc[domain]) {
                    acc[domain] = [];
                }
                acc[domain].push(trigger);
                return acc;
            }, {});

            const domainOrder = ['user', 'agent', 'task', 'policy', 'system', 'other'];
            return Object.keys(grouped)
                .sort((a, b) => {
                    const indexA = domainOrder.indexOf(a);
                    const indexB = domainOrder.indexOf(b);
                    const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
                    const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
                    if (safeIndexA !== safeIndexB) {
                        return safeIndexA - safeIndexB;
                    }
                    return a.localeCompare(b);
                })
                .map((domain) => ({
                    domain,
                    triggers: grouped[domain],
                }));
        },
        normalizedTriggerSearchQuery() {
            return String(this.triggerSearchQuery || '').trim().toLocaleLowerCase();
        },
        hasTriggerFilter() {
            return this.normalizedTriggerSearchQuery.length > 0;
        },
        filteredTriggerGroups() {
            if (!this.hasTriggerFilter) {
                return this.triggerGroups;
            }
            return this.triggerGroups
                .map((group) => ({
                    ...group,
                    triggers: (group.triggers || []).filter((trigger) => this.matchesTriggerSearch(trigger)),
                }))
                .filter((group) => Array.isArray(group.triggers) && group.triggers.length > 0);
        },
        normalizedSavedServiceProfiles() {
            if (!Array.isArray(this.savedServiceProfiles)) {
                return [];
            }
            return this.savedServiceProfiles
                .filter((profile) => !!profile && !!profile.type)
                .map((profile) => this.normalizeSavedProfile(profile));
        },
    },
    watch: {
        visible: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.localForm = this.normalizeForm(this.channel);
                    this.triggerSearchQuery = '';
                    this.triggerActiveIndexes = [];
                    this.savedProfilePickerVisible = false;
                    this.saveProfileDialogVisible = false;
                    this.saveProfileDisplayName = '';
                    this.saveProfileNameError = false;
                    this.serviceToSaveAsProfile = null;
                    this.validation.name = false;
                    this.validation.services = false;
                    this.serviceActiveIndexes = [];
                }
            },
        },
        normalizedTriggerSearchQuery() {
            this.syncTriggerAccordionState();
        },
        filteredTriggerGroups() {
            if (this.hasTriggerFilter) {
                this.expandFilteredTriggerGroups();
            }
        },
    },
    methods: {
        createInitialForm() {
            return {
                id: null,
                name: '',
                triggerIds: [],
                services: [],
                isActive: true,
            };
        },
        normalizeForm(channel) {
            if (!channel) {
                return this.createInitialForm();
            }
            return {
                id: channel.id || null,
                name: channel.name || '',
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
                        settings: this.normalizeServiceSettings(service.type || 'mattermost', service.settings),
                    }))
                    : [],
                isActive: channel.isActive !== false,
            };
        },
        createUniqueId(prefix) {
            return `${prefix}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;
        },
        cloneObject(value, defaultValue = {}) {
            if (value === undefined || value === null) {
                return Array.isArray(defaultValue) ? [...defaultValue] : { ...defaultValue };
            }
            return JSON.parse(JSON.stringify(value));
        },
        normalizeSavedProfile(profile) {
            return {
                id: profile.id || this.createUniqueId('saved.profile'),
                type: profile.type || 'webhook',
                displayName: profile.displayName || '',
                enabled: profile.enabled !== false,
                settings: this.normalizeServiceSettings(profile.type || 'webhook', this.cloneObject(profile.settings)),
                secretsRef: this.cloneObject(profile.secretsRef),
                lastTestResult: {
                    status: 'idle',
                    message: null,
                    testedAt: null,
                },
            };
        },
        savedProfileDisplayName(profile) {
            if (profile?.displayName && profile.displayName.trim().length > 0) {
                return profile.displayName;
            }
            return this.$t('settings.server_settings.notification_settings.dialog.saved_profile_default_name', {
                service: this.$t(this.serviceLabelKey(profile?.type)),
            });
        },
        openSavedProfilePicker() {
            this.savedProfilePickerVisible = true;
        },
        removeSavedProfile(profileId) {
            const nextProfiles = this.normalizedSavedServiceProfiles
                .filter((profile) => profile.id !== profileId);
            this.$emit('update:savedServiceProfiles', nextProfiles);
        },
        openSaveProfileDialog(service) {
            if (!service || !service.type) {
                return;
            }
            this.serviceToSaveAsProfile = {
                type: service.type,
                displayName: service.displayName || '',
                enabled: service.enabled !== false,
                settings: this.cloneObject(service.settings),
                secretsRef: this.cloneObject(service.secretsRef),
            };
            const defaultName = (service.displayName || '').trim();
            this.saveProfileDisplayName = defaultName.length > 0
                ? defaultName
                : this.$t('settings.server_settings.notification_settings.dialog.saved_profile_default_name', {
                    service: this.$t(this.serviceLabelKey(service.type)),
                });
            this.saveProfileNameError = false;
            this.saveProfileDialogVisible = true;
        },
        confirmSaveProfile() {
            const trimmedName = String(this.saveProfileDisplayName || '').trim();
            if (!trimmedName) {
                this.saveProfileNameError = true;
                return;
            }
            if (!this.serviceToSaveAsProfile || !this.serviceToSaveAsProfile.type) {
                this.saveProfileDialogVisible = false;
                return;
            }
            const profile = this.normalizeSavedProfile({
                id: this.createUniqueId('saved.profile'),
                type: this.serviceToSaveAsProfile.type,
                displayName: trimmedName,
                enabled: this.serviceToSaveAsProfile.enabled !== false,
                settings: this.cloneObject(this.serviceToSaveAsProfile.settings),
                secretsRef: this.cloneObject(this.serviceToSaveAsProfile.secretsRef),
            });
            const nextProfiles = [...this.normalizedSavedServiceProfiles, profile];
            this.$emit('update:savedServiceProfiles', nextProfiles);
            this.saveProfileDialogVisible = false;
            this.saveProfileDisplayName = '';
            this.saveProfileNameError = false;
            this.serviceToSaveAsProfile = null;
        },
        addServiceFromSavedProfile(profile) {
            if (!profile || !profile.type) {
                return;
            }
            const normalizedProfile = this.normalizeSavedProfile(profile);
            this.localForm.services.push({
                id: this.createUniqueId('channel.service'),
                type: normalizedProfile.type,
                displayName: normalizedProfile.displayName || '',
                enabled: normalizedProfile.enabled !== false,
                secretsRef: this.cloneObject(normalizedProfile.secretsRef),
                lastTestResult: {
                    status: 'idle',
                    message: null,
                    testedAt: null,
                },
                settings: this.normalizeServiceSettings(normalizedProfile.type, this.cloneObject(normalizedProfile.settings)),
            });
            const newIndex = this.localForm.services.length - 1;
            const activeSet = new Set(Array.isArray(this.serviceActiveIndexes) ? this.serviceActiveIndexes : []);
            activeSet.add(newIndex);
            this.serviceActiveIndexes = Array.from(activeSet).sort((a, b) => a - b);
            this.validation.services = false;
            this.savedProfilePickerVisible = false;
        },
        serviceLabelKey(type) {
            const labelKey = this.serviceSchemaMap[type]?.labelKey;
            if (labelKey) {
                return labelKey;
            }
            return `settings.server_settings.notification_settings.dialog.service_types.${type}`;
        },
        serviceIcon(type) {
            return getNotificationServiceIcon(type);
        },
        isAppriseService(type) {
            return String(type || '').toLowerCase() === 'apprise';
        },
        serviceFields(type) {
            const fields = this.serviceSchemaMap[type]?.fields;
            return Array.isArray(fields) ? fields : [];
        },
        fieldInputType(field) {
            if (field && field.inputType === 'password') {
                return 'password';
            }
            return 'text';
        },
        normalizeServiceSettings(type, currentSettings = {}) {
            const normalizedSettings = { ...(currentSettings || {}) };
            this.serviceFields(type).forEach((field) => {
                if (field.repeatable) {
                    if (!Array.isArray(normalizedSettings[field.key])) {
                        normalizedSettings[field.key] = normalizedSettings[field.key]
                            ? [normalizedSettings[field.key]]
                            : [''];
                    }
                } else if (normalizedSettings[field.key] === undefined || normalizedSettings[field.key] === null) {
                    normalizedSettings[field.key] = '';
                }
            });
            return normalizedSettings;
        },
        getRepeatableItems(service, key) {
            const val = service.settings[key];
            return Array.isArray(val) ? val : [val || ''];
        },
        updateRepeatableItem(service, key, index, value) {
            if (!Array.isArray(service.settings[key])) {
                service.settings[key] = [service.settings[key] || ''];
            }
            service.settings[key][index] = value;
        },
        addRepeatableItem(service, key) {
            if (!Array.isArray(service.settings[key])) {
                service.settings[key] = [service.settings[key] || ''];
            }
            service.settings[key].push('');
        },
        removeRepeatableItem(service, key, index) {
            if (Array.isArray(service.settings[key]) && service.settings[key].length > 1) {
                service.settings[key].splice(index, 1);
            }
        },
        repeatableAddLabel(field) {
            const fieldLabel = this.$t(field?.labelKey || '');
            return this.$t('settings.server_settings.notification_settings.dialog.add_item_for_field', {
                field: fieldLabel,
            });
        },
        triggerGroupLabel(domain) {
            const normalizedDomain = (domain || 'other').toString().toLowerCase();
            const labelKey = `settings.server_settings.notification_settings.dialog.trigger_groups.${normalizedDomain}`;
            const translated = this.$t(labelKey);
            if (translated !== labelKey) {
                return translated;
            }
            return normalizedDomain.charAt(0).toUpperCase() + normalizedDomain.slice(1);
        },
        triggerSearchText(trigger) {
            if (!trigger) {
                return '';
            }
            const labelKey = trigger.labelKey || '';
            const translatedLabel = labelKey ? this.$t(labelKey) : '';
            const safeLabel = translatedLabel && translatedLabel !== labelKey ? translatedLabel : '';
            const safeId = trigger.id || '';
            return `${safeLabel} ${safeId}`.toLocaleLowerCase();
        },
        matchesTriggerSearch(trigger) {
            if (!this.hasTriggerFilter) {
                return true;
            }
            return this.triggerSearchText(trigger).includes(this.normalizedTriggerSearchQuery);
        },
        expandFilteredTriggerGroups() {
            this.triggerActiveIndexes = this.filteredTriggerGroups.map((_, index) => index);
        },
        syncTriggerAccordionState() {
            if (this.hasTriggerFilter) {
                this.expandFilteredTriggerGroups();
                return;
            }
            this.triggerActiveIndexes = [];
        },
        groupTriggerIds(group) {
            if (!group || !Array.isArray(group.triggers)) {
                return [];
            }
            return group.triggers
                .map((trigger) => trigger && trigger.id)
                .filter((id) => !!id);
        },
        isGroupSelected(group) {
            const groupIds = this.groupTriggerIds(group);
            if (!groupIds.length) {
                return false;
            }
            return groupIds.every((id) => this.localForm.triggerIds.includes(id));
        },
        isGroupIndeterminate(group) {
            const groupIds = this.groupTriggerIds(group);
            if (!groupIds.length) {
                return false;
            }
            const selectedCount = groupIds.filter((id) => this.localForm.triggerIds.includes(id)).length;
            return selectedCount > 0 && selectedCount < groupIds.length;
        },
        selectedGroupCount(group) {
            const groupIds = this.groupTriggerIds(group);
            if (!groupIds.length) {
                return 0;
            }
            return groupIds.filter((id) => this.localForm.triggerIds.includes(id)).length;
        },
        toggleTriggerGroup(group, checked) {
            const groupIds = this.groupTriggerIds(group);
            if (!groupIds.length) {
                return;
            }

            if (checked) {
                const mergedIds = new Set([...(this.localForm.triggerIds || []), ...groupIds]);
                this.localForm.triggerIds = Array.from(mergedIds);
                return;
            }

            const groupIdSet = new Set(groupIds);
            this.localForm.triggerIds = (this.localForm.triggerIds || []).filter((id) => !groupIdSet.has(id));
        },
        toggleServiceMenu(event) {
            this.$refs.serviceMenu.toggle(event);
        },
        handleServiceMenuItemClick(item) {
            if (item && typeof item.command === 'function') {
                item.command();
            }
            if (this.$refs.serviceMenu && typeof this.$refs.serviceMenu.hide === 'function') {
                this.$refs.serviceMenu.hide();
            }
        },
        addServiceByType(type) {
            if (!type) {
                return;
            }
            this.localForm.services.push({
                id: null,
                type,
                displayName: '',
                enabled: true,
                secretsRef: {},
                lastTestResult: {
                    status: 'idle',
                    message: null,
                    testedAt: null,
                },
                settings: this.normalizeServiceSettings(type, {}),
            });
            const newIndex = this.localForm.services.length - 1;
            const activeSet = new Set(Array.isArray(this.serviceActiveIndexes) ? this.serviceActiveIndexes : []);
            activeSet.add(newIndex);
            this.serviceActiveIndexes = Array.from(activeSet).sort((a, b) => a - b);
            this.validation.services = false;
        },
        removeService(index) {
            this.localForm.services.splice(index, 1);
            this.serviceActiveIndexes = (Array.isArray(this.serviceActiveIndexes) ? this.serviceActiveIndexes : [])
                .filter((activeIndex) => activeIndex !== index)
                .map((activeIndex) => (activeIndex > index ? activeIndex - 1 : activeIndex));
        },
        emitTest() {
            this.$emit('test', { scope: 'global', ...this.localForm });
        },
        emitServiceTest(index) {
            const service = this.localForm.services[index];
            if (!service) {
                return;
            }
            this.$emit('test', {
                scope: 'service',
                serviceIndex: index,
                service: { ...service },
                ...this.localForm,
            });
        },
        submit() {
            this.validation.name = !this.localForm.name || !this.localForm.name.trim();
            this.validation.services = !Array.isArray(this.localForm.services) || this.localForm.services.length === 0;
            if (this.validation.name) {
                return;
            }
            if (this.validation.services) {
                return;
            }
            this.$emit('confirm', {
                ...this.localForm,
                name: this.localForm.name.trim(),
            });
            this.modalVisible = false;
        },
    },
};
</script>

<style scoped>
.trigger-box {
    max-height: 16rem;
    overflow-y: auto;
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    padding: 0.35rem 0.55rem;
}

.trigger-item {
    margin-bottom: 0.35rem;
}

.trigger-search {
    margin-bottom: 0.45rem;
}

.trigger-search-input-wrap {
    width: 100%;
}

.trigger-search-input {
    width: 100%;
}

.trigger-accordion :deep(.p-accordion-header-link) {
    padding: 0.06rem 0.4rem !important;
    min-height: 1.18rem !important;
    line-height: 3 !important;
    background: var(--surface-card) !important;
    border: 0 !important;
    color: var(--text-color) !important;
    transition: background-color 0.15s ease;
}

.trigger-accordion :deep(.p-accordion-tab:not(:first-child) .p-accordion-header .p-accordion-header-link) {
    border-top: 1px solid var(--surface-border) !important;
}

.trigger-accordion :deep(.p-accordion-header:not(.p-disabled) .p-accordion-header-link:hover) {
    background: var(--surface-100) !important;
}

.trigger-accordion :deep(.p-accordion-header.p-highlight .p-accordion-header-link) {
    background: var(--surface-card) !important;
    color: var(--text-color) !important;
}

.trigger-accordion :deep(.p-accordion-toggle-icon) {
    font-size: 0.75rem;
    margin-right: 0.3rem;
}

.trigger-accordion :deep(.p-accordion-content) {
    padding: 0.35rem 0.55rem 0 0.55rem;
}

.trigger-accordion :deep(.p-accordion-tab) {
    margin-bottom: 0;
}

.trigger-accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 1rem;
}

.trigger-group-checkbox {
    margin: 0 !important;
}

.trigger-group-checkbox label {
    line-height: 1;
    font-size: 0.84rem;
}

.trigger-group-count {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
}

.trigger-group-items {
    padding-left: 0.35rem;
}

.empty-trigger {
    color: var(--text-color-secondary);
}

.services-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
}

.add-service-btn {
    width: auto !important;
    white-space: nowrap;
    flex: 0 0 auto;
}

.services-header-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.service-accordion :deep(.p-accordion-header-link) {
    padding: 0.24rem 0.6rem !important;
    min-height: 2.35rem !important;
    background: var(--surface-card) !important;
    border-color: var(--surface-border) !important;
    color: var(--text-color) !important;
}

.service-accordion :deep(.p-accordion-tab:not(:first-child) .p-accordion-header .p-accordion-header-link) {
    border-top: 1px solid var(--surface-border) !important;
}

.service-accordion :deep(.p-accordion-header:not(.p-disabled) .p-accordion-header-link:hover) {
    background: var(--surface-100) !important;
}

.service-accordion :deep(.p-accordion-content) {
    padding: 0.6rem !important;
}

.service-accordion :deep(.p-accordion-tab) {
    margin-bottom: 0.55rem;
}

.service-accordion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 2rem;
    line-height: 1;
}

.service-title-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.service-type-icon {
    width: 1.2rem;
    height: 1.2rem;
    object-fit: contain;
}

.service-accordion-header strong {
    line-height: 1;
}

.service-menu-item {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
}

.service-menu-icon {
    width: 1.2rem;
    height: 1.2rem;
    object-fit: contain;
    flex: 0 0 auto;
}

.service-accordion :deep(.service-actions .p-button) {
    width: 2rem !important;
    height: 2rem !important;
    min-width: 2rem !important;
    padding: 0 !important;
}

.service-accordion :deep(.service-actions .p-button .pi) {
    font-size: 0.95rem;
}

.service-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}

.saved-profile-list {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}

.saved-profile-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    padding: 0.5rem 0.6rem;
    background: var(--surface-card);
}

.saved-profile-meta {
    display: inline-flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
}

.saved-profile-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}

.saved-profile-title {
    font-weight: 600;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.saved-profile-title-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
}

.saved-profile-icon {
    width: 1.1rem;
    height: 1.1rem;
    object-fit: contain;
    flex: 0 0 auto;
}

.saved-profile-type {
    color: var(--text-color-secondary);
}

.saved-profile-use-btn {
    width: auto !important;
    min-width: 5.2rem !important;
    padding-left: 0.55rem !important;
    padding-right: 0.55rem !important;
}

.empty-service {
    border: 1px dashed var(--surface-border);
    border-radius: 6px;
    padding: 0.75rem;
    color: var(--text-color-secondary);
}

.apprise-doc-hint {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    line-height: 1.2;
    color: var(--text-color-secondary);
}

.apprise-doc-icon {
    font-size: 0.85rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-1px);
}

.apprise-doc-link {
    font-weight: 500;
    text-decoration: underline;
}

.repeatable-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.repeatable-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.repeatable-input {
    flex: 1;
}

.add-repeatable-btn {
    align-self: flex-start;
    margin-top: 0.35rem;
    width: auto !important;
    min-width: 0 !important;
    padding: 0.3rem 0.7rem !important;
    border-color: var(--primary-color) !important;
    color: var(--primary-color) !important;
    background: var(--surface-card) !important;
}

.add-repeatable-btn:hover {
    border-color: var(--primary-color) !important;
    color: var(--primary-color) !important;
    background: var(--surface-100) !important;
}

.add-repeatable-btn :deep(.p-button-icon) {
    font-size: 0.8rem;
}

.add-repeatable-btn :deep(.p-button-label) {
    font-weight: 500;
}
</style>
