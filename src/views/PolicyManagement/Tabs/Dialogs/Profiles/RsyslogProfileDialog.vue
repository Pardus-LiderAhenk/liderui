<template>
    <Dialog header="Yönetilecek Log Ekle" 
        v-model:visible="addLogDialog"
        :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <label>Sık Kullanılanlardan Seç</label>
                    <Dropdown :showClear="true"
                        v-model="logName"
                        :options="favLogFiles"
                        optionLabel="name"
                        @change="selectFavLog"
                        placeholder="Seç"
                    >
                    </Dropdown>
                </div>
                <div class="p-field">
                    <label>Yerel Kayıt</label>
                    <Dropdown
                        v-model="form.isLocal"
                        :options="[{name: 'Evet', value: 'YES'},
                            {name: 'Hayır', value: 'NO'}]"
                        optionLabel="name" optionValue="value"
                    >
                    </Dropdown>
                </div>
                <div class="p-field">
                    <label>Kayıt Adı</label>
                    <InputText class="validation2.recordDescription ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                        type="text" 
                        placeholder="*.*;auth,authpriv.none" 
                        v-model="form.recordDescription"
                    />
                    <small v-if="validation2.recordDescription" class="p-error">
                        Kayıt adı boş bırakılamaz
                    </small>
                </div>
                <div class="p-field">
                    <label>Log Kayıt yolu</label>
                    <InputText class="validation2.logFilePath ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                        type="text" 
                        placeholder="-/var/log/syslog" 
                        v-model="form.logFilePath"
                    />
                    <small v-if="validation2.logFilePath" class="p-error">
                        Log kayıt yolu boş bırakılamaz 
                    </small>
                </div>
                
            </div>
        <template #footer>
            <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                @click="addLogDialog = false" class="p-button-text p-button-sm"/>
            <Button :label="$t('policy_management.add')" icon="pi pi-plus"
                @click="addLogItem" class="p-button-sm"/>
        </template>
    </Dialog>

    <div>
        <Dialog :header="pluginProfile.name" 
            v-model:visible="showDialog"
            :style="{width: '50vw'}" :modal="true">
            <base-profile :pluginProfile="pluginProfile" ref="profile"
                @add-profile="defaultSettings"
                @save-profile="saveProfile"
                @edit-profile="editProfile"
                @update-profile="updateProfile">
                <template #default>
                    <div class="p-fluid p-formgrid">
                        <h6>Log Rotasyonu</h6>
                        <div class="p-field p-grid">
                            <div class="p-field p-col-12 p-md-4">
                                <label>Rotasyon sıklığı</label>
                                <Dropdown
                                    v-model="profileData.rotationInterval"
                                    :options="rotationOptions"
                                    optionLabel="name"
                                    optionValue="value"
                                >
                                </Dropdown>
                            </div>
                            <div class="p-field p-col-12 p-md-4">
                                <label>Şu kadar eski logu tut</label>
                                <InputNumber showButtons buttonLayout="horizontal" class="p-inputtext-sm"
                                    decrementButtonClass="p-button-danger" incrementButtonClass="p-button-success"
                                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                    v-model="profileData.keepBacklogs" mode="decimal" :min="1" :max="99999" 
                                />
                            </div>
                            <div class="p-field p-col-12 p-md-4">
                                <label>Rotasyon için dosya boyutu(MB)</label>
                                <InputText type="text" class="p-inputtext-sm" 
                                    v-tooltip.top="'Log dosyası şu boyuttan büyük olduğunda rotasyona git(MB)'"  
                                    v-model="profileData.maxSize" placeholder="50"
                                />
                            </div>
                        </div>
                        <div class="p-field p-grid">
                            <InputSwitch class="p-col-fixed" v-model="profileData.createNewLogFiles"/>
                            <label class="p-col">Rotasyondan sonra yeni log dosyası oluştur</label>
                        </div>
                        <div class="p-field p-grid">
                            <InputSwitch class="p-col-fixed" v-model="profileData.compressOldLogFiles"/>
                            <label  class="p-col">Eski log dosyalarını sıkıştır</label>
                        </div>
                        <div class="p-field p-grid">
                            <InputSwitch class="p-col-fixed" v-model="profileData.missingOk"/>
                            <label class="p-col">Log dosyası yoksa hata vermeden diğerine geç</label>
                        </div>
                        <h6>Logların Yedekleneceği Uzak Sunucu</h6>
                        <div class="p-field p-grid">
                            <div class="p-field p-col-12 p-md-4">
                                <label>Sunucu Adres</label>
                                <InputText type="text" :class="validation.address ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                                    v-model="profileData.ADDRESS" placeholder="192.168.*.*"/>
                                <small v-if="validation.address" class="p-error">
                                    Sunucu adresi boş bırakılamaz 
                                </small>
                            </div>
                            <div class="p-field p-col-12 p-md-4">
                                <label>Port</label>
                                <InputText type="number" :class="validation.port ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                                    v-model="profileData.PORT" placeholder="514"/>
                                <small v-if="validation.port" class="p-error">
                                    Port boş bırakılamaz
                                </small>
                            </div>
                            <div class="p-field p-col-12 p-md-4">
                                <label>Protokol</label>
                                <Dropdown
                                    v-model="profileData.PROTOCOL"
                                    :options="[{name: 'UDP', value: 'UDP'},
                                            {name: 'TCP', value: 'TCP'}]"
                                    optionLabel="name"
                                    optionValue="value"
                                >
                                </Dropdown>
                            </div>
                        </div>
                        <h6>Yönetilecek Loglar</h6>
                        <div class="p-field">
                            <DataTable :value="items" responsiveLayout="scroll"
                                class="p-datatable-sm">
                                <template #header>
                                    <div class="p-d-flex p-jc-end">
                                        <div class="p-text-right">
                                            <Button :label="$t('policy_management.add')" icon="pi pi-plus" 
                                                @click="addLogItemDialog" class="p-button-sm"
                                            />
                                        </div>
                                    </div>
                                </template>
                                
                                <template #empty>
                                    <div class="p-d-flex p-jc-center">
                                        <span>Kayıt bulunamadı</span>
                                    </div>
                                </template>
                                <Column field="isLocal" header="Yerel Kayıt" style="width:20%"></Column>
                                <Column field="recordDescription" header="Kayıt Adı" style="width:35%"></Column>
                                <Column field="logFilePath" header="Log Kayıt Yolu" style="width:35%"></Column>
                                <Column :exportable="false">
                                    <template #body="slotProps">
                                        <div class="p-d-flex p-jc-end">
                                            <Button class="p-button-sm p-button-rounded p-button-danger" 
                                                icon="pi pi-trash"  
                                                :title="$t('policy_management.delete')" 
                                                @click.prevent="deleteLogItem(slotProps.data)">
                                            </Button>
                                        </div>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                </template>
            </base-profile>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="showDialog = false" class="p-button-text p-button-sm"
                />
            </template>
        </Dialog>
    </div>
</template>

<script>
/**
 * Rsyslog profile dialog
 * @see {@link http://www.liderahenk.org/}
* emits this event
* @event closePolicyDialog
*/

import BaseProfile from './Component/BaseProfile.vue';

export default {

    props: {
        rsyslogProfileDialog: {
            type: Boolean,
            default: false,
        },
        pluginProfile: {
            type: Object,
            description: "Plugin task object",
        },
    },

    data() {
        return {
            profileData: {
                createNewLogFiles: false,
                compressOldLogFiles: false,
                missingOk: false,
                rotationInterval: "DAILY",
                keepBacklogs: 1,
                PROTOCOL: "UDP",
                maxSize: "",
                PORT: "",
                ADDRESS: "",
            },
            addLogDialog: false,
            items: [],
            logName: "",
            form: {
                recordDescription: "",
                logFilePath: "",
                isLocal: "YES",
            },
            rotationOptions: [
                {name: "Günlük", value: "DAILY"},
                {name: "Haftalık", value: "WEEKLY"},
                {name: "Aylık", value: "MONTHLY"},
                {name: "Yıllık", value: "YEARLY"},
            ],
            favLogFiles: [
                {name: "*.*;auth,authpriv.none", value: "-/var/log/syslog"},
                {name: "auth,authpriv.*", value: "/var/log/auth.log"},
                {name: "daemon.*", value: "-/var/log/daemon.log"},
                {name: "cron.*", value: "/var/log/cron.log"},
                {name: "kern.*", value: "-/var/log/kern.log"},
                {name: "user.*", value: "-/var/log/user.log"},
                {name: "mail.*", value: "-/var/log/mail.log"}
            ],
            validation: {},
            validation2: {}
        }
    },

    components:{
        BaseProfile,
    },

    computed: {
        showDialog: {
            get () {
                return this.rsyslogProfileDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeProfileDialog');
                }
            }
        },
    },

    methods: {
        defaultSettings() {
            this.validation = {};
            this.profileData.createNewLogFiles = false;
            this.profileData.compressOldLogFiles = false;
            this.profileData.missingOk = false;
            this.profileData.rotationInterval = "DAILY";
            this.profileData.keepBacklogs = 1;
            this.profileData.PROTOCOL = "UDP";
            this.profileData.maxSize ="";
            this.profileData.PORT = "";
            this.profileData.ADDRESS = "";
            this.items = [];
        },

        saveProfile() {
            if (this.validateForm()) {
                this.getProfileData();
                this.$refs.profile.saveProfile(this.profileData);
            }
        },

        editProfile(data) {
            this.defaultSettings();
            if (data) {
                this.profileData.createNewLogFiles = data.profileData.createNewLogFiles;
                this.profileData.compressOldLogFiles = data.profileData.compressOldLogFiles;
                this.profileData.missingOk = data.profileData.missingOk;
                this.profileData.rotationInterval = data.profileData.rotationInterval;
                this.profileData.keepBacklogs = data.profileData.keepBacklogs;
                this.profileData.PROTOCOL = data.profileData.PROTOCOL;
                this.profileData.maxSize = data.profileData.maxSize;
                this.profileData.PORT = data.profileData.PORT;
                this.profileData.ADDRESS = data.profileData.ADDRESS;

                if (data.profileData.hasOwnProperty('items')){
                    this.items = data.profileData.items;
                }
            }
        },

        updateProfile() {
            if (this.validateForm()) {
                this.getProfileData();
                this.$refs.profile.updateProfile(this.profileData);
                this.selectedProfileData = null;
            }
        },

        addLogItemDialog() {
            this.form.recordDescription = "";
            this.form.logFilePath = "";
            this.form.isLocal = "YES";
            this.logName = "";
            this.validation2 = {};
            this.addLogDialog = true;
        },

        getProfileData() {
            if (this.items.length > 0) {
                this.profileData.items = this.items;
            }
        },

        selectFavLog(data) {
            if (data.value) {
                this.form.recordDescription = data.value.name;
                this.form.logFilePath = data.value.value;
            } else {
                this.form.recordDescription = "";
                this.form.logFilePath = "";
            }
        },

        addLogItem() {
            if (this.validateForm2()) {
                this.items.push({
                    "isLocal": this.form.isLocal,
                    "recordDescription": this.form.recordDescription,
                    "logFilePath": this.form.logFilePath
                });
                this.addLogDialog = false;
            }
        },

        deleteLogItem(item) {
            this.items = this.items.filter(log => log.recordDescription != item.recordDescription);
        },

        validateForm() {
            if (!this.profileData.ADDRESS.trim()){
                this.validation['address'] = true;
            }
            else{
                delete this.validation['address'];
            }
            if (!this.profileData.PORT.trim()){
                this.validation['port'] = true;
            }
            else{
                delete this.validation['port'];
            }
            return !Object.keys(this.validation).length;
        },

        validateForm2() {
            if (!this.form.recordDescription.trim()){
                this.validation2['recordDescription'] = true;
            }
            else{
                delete this.validation2['recordDescription'];
            }
            if (!this.form.logFilePath.trim()){
                this.validation2['logFilePath'] = true;
            }
            else{
                delete this.validation2['logFilePath'];
            }
            return !Object.keys(this.validation2).length;
        }
    },

    watch: {
        profileData: {
            handler(){
                this.validateForm();
            },
            deep: true,
        },

        form: {
            handler(){
                this.validateForm2();
            },
            deep: true,
        },
    },
}
</script>

<style lang="scss" scoped>
h6 {
    font-weight: bold;
}
</style>