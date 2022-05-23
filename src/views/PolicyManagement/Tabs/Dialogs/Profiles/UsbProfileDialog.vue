<template>
    <div>
        <!-- Add Usb Item as Black or White List -->
        <Dialog :header="!selectedUsbItem ? $t('policy_management.profile.usb.usb_add'): $t('policy_management.profile.usb.usb_update')" v-model:visible="usbItemDialog" 
            :style="{width: '30vw'}" :modal="true">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="icon"> {{$t('policy_management.profile.usb.manufacturer')}}</label>
                    <InputText class="p-inputtext-sm" type="text" v-model="form.vendor"/>
                </div>
                <div class="p-field">
                    <label for="icon">{{$t('policy_management.profile.usb.model')}}</label>
                    <InputText class="p-inputtext-sm" type="text" v-model="form.model"/>
                </div>
                <div class="p-field">
                    <label for="icon">{{$t('policy_management.profile.usb.serial_number')}}</label>
                    <InputText class="p-inputtext-sm" type="text" v-model="form.serialNumber"/>
                </div>
            </div>
            <template #footer>
                <Button :label="$t('policy_management.cancel')" icon="pi pi-times" 
                    @click="usbItemDialog = false" class="p-button-text p-button-sm"/>
                <Button v-if="!selectedUsbItem" :label="$t('policy_management.add')" icon="pi pi-plus"
                    @click="saveUsbItem('add')" class="p-button-sm"/>
                <Button v-if="selectedUsbItem" :label="$t('policy_management.update')" icon="pi pi-refresh"
                    @click="saveUsbItem('update')" class="p-button-sm"/>
            </template>
        </Dialog>
       <!-- Add Usb Item as Black or White List End -->
        <Dialog :header="pluginProfile.name" 
            v-model:visible="showDialog"
            :style="{width: '50vw'}" :modal="true">
            <base-profile :pluginProfile="pluginProfile" ref="profile"
                @add-profile="addProfile"
                @save-profile="saveProfile"
                @edit-profile="editProfile"
                @update-profile="updateProfile">
                <template #default>
                    <div class="p-fluid p-grid p-field p-formgrid">
                        <div class="p-field p-col-12 p-md-3">
                            <label for="icon">USB</label>
                            <Dropdown v-model="storage" :options="options" showClear="true"
                                optionLabel="name" optionValue="value" :placeholder="$t('policy_management.profile.usb.select')"/>
                        </div>
                        <div class="p-field p-col-12 p-md-3">
                            <label for="icon">{{$t('policy_management.profile.usb.printer')}}</label>
                            <Dropdown v-model="printer" :options="options" showClear="true"
                                optionLabel="name" optionValue="value" :placeholder="$t('policy_management.profile.usb.select')"/>
                        </div>
                        <div class="p-field p-col-12 p-md-3">
                            <label for="icon">{{$t('policy_management.profile.usb.webcam')}}</label>
                            <Dropdown v-model="webcam" :options="options" showClear="true"
                                optionLabel="name" optionValue="value" :placeholder="$t('policy_management.profile.usb.select')"/>
                        </div>
                        <div class="p-field p-col-12 p-md-3">
                            <label for="icon">{{$t('policy_management.profile.usb.mouse_keyboard')}}</label>
                            <Dropdown v-model="mouseKeyboard" :options="options" showClear="true"
                                optionLabel="name" optionValue="value" :placeholder="$t('policy_management.profile.usb.select')"/>
                        </div>
                    </div>
                    <div class="p-fluid p-field ">
                        <div class="p-field">
                           <Toolbar class="mb-4">
                                <template #start>
                                    <div class="field-radiobutton p-mr-2">
                                        <RadioButton id="typeWhite" name="typeWhite" value="whitelist" v-model="type" @change="changeUsbListType"/>
                                        <label for="typeWhite">&nbsp; &nbsp;{{$t('policy_management.profile.usb.white_list')}}</label>
                                    </div>
                                    <div class="field-radiobutton p-mr-2">
                                        <RadioButton id="typeBlack" name="typeBlack" value="blacklist" v-model="type" @change="changeUsbListType"/>
                                        <label for="typeBlack">&nbsp; &nbsp;{{$t('policy_management.profile.usb.black_list')}}</label>
                                    </div>
                                </template>
                                <template #end>
                                    <Button class="p-button-sm" 
                                        icon="pi pi-plus"  
                                        :label="type == 'whitelist'? $t('policy_management.profile.usb.white_list_add'):$t('policy_management.profile.usb.black_list_add')" 
                                        @click.prevent="showUsbItemDialog">
                                    </Button>
                                </template>
                            </Toolbar>
                        </div>
                        <div class="p-field">
                            <DataTable :value="items" responsiveLayout="scroll" 
                                class="p-datatable-sm" :scrollable="false" scrollHeight="400px">
                                <template #header>
                                    <div class="p-d-flex p-jc-between">
                                        <div style="text-align: left">
                                            <h5>{{$t('policy_management.profile.usb.white_black_list')}}</h5>
                                        </div>
                                    </div>
                                </template>
                                <template #empty>
                                    <div class="p-d-flex p-jc-center" >
                                        <span style="text-align: center">{{$t('policy_management.profile.usb.usb_list_cant_find')}}</span>
                                    </div>
                                </template>
                                <!-- <Column field="index" header="#"></Column> -->
                                <Column field="vendor" :header="$t('policy_management.profile.usb.manufacturer')" style="width:25%"></Column>
                                <Column field="model" :header="$t('policy_management.profile.usb.model')" style="width:25%"></Column>
                                <Column field="serialNumber" :header="$t('policy_management.profile.usb.serial_number')" style="width:25%"></Column>
                                <Column field="type" :header="$t('policy_management.profile.usb.type')" style="width:15%"></Column>
                                <Column :exportable="false" style="flex: 0 0 4rem">
                                    <template #body="slotProps">
                                        <div class="p-d-flex p-jc-end">
                                            <Button class="p-mr-2 p-button-sm p-button-rounded p-button-warning" 
                                                icon="pi pi-pencil"  
                                                :title="$t('policy_management.edit')" 
                                                @click.prevent="editUsbItem(slotProps.data)">
                                            </Button>
                                            <Button class="p-button-sm p-button-rounded p-button-danger" 
                                                icon="pi pi-trash"  
                                                :title="$t('policy_management.delete')" 
                                                @click.prevent="deleteUsbItem(slotProps.data)">
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
 * USB profile dialog
 * @see {@link http://www.liderahenk.org/}
* emits this event
* @event closePolicyDialog
*/

import BaseProfile from './Component/BaseProfile.vue';

export default {
    props: {
        usbProfileDialog: {
            type: Boolean,
            default: false,
        },
        pluginProfile: {
            type: Object,
            description: "Plugin task object",
        },
    },

    components:{
        BaseProfile,
    },

    data(){
        return {
            options: [
                {name: this.$t('policy_management.profile.usb.allow'), value: '1'},
                {name: this.$t('policy_management.profile.usb.not_allow'), value: '0'},
            ],
            storage: null,
            printer: null,
            webcam: null,
            mouseKeyboard: null,
            type: "whitelist",
            items: [],
            usbItemDialog: false,
            selectedUsbItem: null,
            form: {
                vendor: "",
                model: "",
                serialNumber: ""
            },
            profileData: {}
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.usbProfileDialog;
            },

            set (value) {
                if (!value) {
                    this.$emit('closeProfileDialog');
                }
            }
        },
    },

    methods: {

        addProfile() {
            this.items = [];
            this.storage = null;
            this.printer = null;
            this.webcam = null;
            this.mouseKeyboard = null;
            this.type = "whitelist";
        },

        saveProfile() {
            this.getProfileData();
            if (Object.keys(this.profileData).length == 0) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('policy_management.profile.usb.enter_at_least_one_setting'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            this.$refs.profile.saveProfile(this.profileData);
        },

        editProfile(data) {
            if (data) {
                for (var key of Object.keys(data.profileData)) {
                    if (key == "storage") {
                        this.storage = data.profileData[key];
                    }
                    if (key == "printer") {
                        this.printer = data.profileData[key];
                    }
                    if (key == "webcam") {
                        this.webcam = data.profileData[key];
                    }
                    if (key == "mouseKeyboard") {
                        this.mouseKeyboard = data.profileData[key];
                    }
                    if (key == "items") {
                        this.items = data.profileData[key];
                        this.type = data.profileData["type"];
                    }
                }
            }
        },

        updateProfile() {
            this.getProfileData();
            if (Object.keys(this.profileData).length == 0) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('policy_management.profile.usb.enter_at_least_one_setting'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            } else {
                this.$refs.profile.updateProfile(this.profileData);
                this.selectedDays = null;
            }
        },

        getProfileData() {
            if(this.storage) {
                this.profileData.storage = this.storage;
            }           
            if(this.printer) {
                this.profileData.printer = this.printer;
            }
            if(this.webcam) {
                this.profileData.webcam = this.webcam;
            }
            if(this.mouseKeyboard) {
                this.profileData.mouseKeyboard = this.mouseKeyboard;
            }
            if(this.items.length > 0) {
                this.profileData.items = this.items;
                this.profileData.type = this.type;
            }
        },

        showUsbItemDialog() {
            this.selectedUsbItem = null;
            this.form.vendor = "";
            this.form.model = "";
            this.form.serialNumber = "";
            this.usbItemDialog = true;
        },

        saveUsbItem(status) {
            if (!this.form.vendor.trim() && !this.form.model.trim() && !this.form.serialNumber.trim()) {
                this.$toast.add({
                    severity:'warn', 
                    detail: this.$t('policy_management.profile.usb.white_black_list_warning'),
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                return;
            }
            let gId = this.createGuid();
            if (status == 'update') {
                this.items = this.items.filter(usb => usb.id != this.selectedUsbItem.id);
                gId = this.selectedUsbItem.id;
            }
            this.items.push({
                "id": gId,
                "vendor": this.form.vendor,
                "model": this.form.model,
                "serialNumber": this.form.serialNumber,
                "type": this.type
            });
            this.usbItemDialog = false;
            this.selectedUsbItem = null;
        },

        editUsbItem(data){
            this.selectedUsbItem = data;
            this.form.vendor = data.vendor;
            this.form.model = data.model;
            this.form.serialNumber = data.serialNumber;
            this.usbItemDialog = true;
        },

        createGuid() {
            return Math.random().toString(16).slice(2);
        },

        changeUsbListType() {
            for (let index = 0; index < this.items.length; index++) {
                const element = this.items[index];
                element.type = this.type;
            }
        },

        deleteUsbItem(usbItem) {
            this.items = this.items.filter(usb => usb.id != usbItem.id);
        }
    },
}

</script>

<style lang="scss" scoped>
</style>