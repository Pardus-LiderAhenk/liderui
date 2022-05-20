<template>
    <div>
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
                        <div class="p-field p-col-12 p-md-4">
                            <!-- <label>{{ $t("computer.plugins.conky.templates") }}</label> -->
                            <label for="days"> {{$t("policy_management.profile.login_manager.allowed_days")}}</label>
                            <MultiSelect v-model="selectedDays" :options="allDays" 
                                optionLabel="name" optionValue="value" 
                                placeholder="Select Day" display="chip" 
                            />
                            <small v-if="loginManagerValidation" class="p-error">{{
                                $t("policy_management.profile.login_manager.login_manager_validation")}}
                            </small>
                        </div>
                        <div class="p-field p-col-12 p-md-4">
                            <!-- <label>{{ $t("computer.plugins.conky.templates") }}</label> -->
                            <label for="startTime">{{$t("policy_management.profile.login_manager.start_time")}}</label>
                            <Calendar id="startTime" v-model="startTime" :timeOnly="true" hourFormat="24" icon="pi pi-clock" :showIcon="true"/>
                        </div>
                        <div class="p-field p-col-12 p-md-4">
                            <!-- <label>{{ $t("computer.plugins.conky.templates") }}</label> -->
                            <label for="endTime">{{$t("policy_management.profile.login_manager.finish_time")}}</label>
                            <Calendar id="endTime" v-model="endTime" :timeOnly="true" hourFormat="24" icon="pi pi-clock" :showIcon="true"/>
                        </div>
                    </div>
                    <div class="p-fluid p-grid p-field p-formgrid">
                        <div class="p-field p-col-12 p-md-4">
                            <label for="icon">{{$t("policy_management.profile.login_manager.last_validity_date")}}</label>
                            <Calendar id="icon" dateFormat="dd/mm/yy" 
                                v-model="lastDate" 
                                :showButtonBar="true" :showIcon="true"
                            />
                        </div>
                        <div class="p-field p-col-12 p-md-4">
                            <label for="icon">{{$t("policy_management.profile.login_manager.notify_time")}}</label>
                            <Dropdown v-model="duration" :options="[
                                {name: $t('policy_management.profile.login_manager.one_minute'), value: '1'},
                                {name: $t('policy_management.profile.login_manager.five_minute'), value: '5'},]" 
                                optionLabel="name" optionValue="value"/>
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
 * Login Manager profile dialog
 * @see {@link http://www.liderahenk.org/}
* emits this event
* @event closePolicyDialog
*/

import BaseProfile from './Component/BaseProfile.vue';

export default {
    props: {
        loginManagerProfileDialog: {
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
            selectedDays: null,
            allDays: [
                {name: this.$t('policy_management.profile.login_manager.sunday'), value: '0'},
                {name: this.$t('policy_management.profile.login_manager.monday'), value: '1'},
                {name: this.$t('policy_management.profile.login_manager.tuesday'), value: '2'},
                {name: this.$t('policy_management.profile.login_manager.wednesday'), value: '3'},
                {name: this.$t('policy_management.profile.login_manager.thursday'), value: '4'},
                {name: this.$t('policy_management.profile.login_manager.friday'), value: '5'},
                {name: this.$t('policy_management.profile.login_manager.saturday'), value: '6'},
                
            ],
            startTime: null,
            endTime: null,
            lastDate: null,
            duration: "1",
            loginManagerValidation:false,
            profileData: null
        }
    },

    computed: {
        showDialog: {
            get () {
                return this.loginManagerProfileDialog;
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
            this.loginManagerValidation = false;
            let currentDate = new Date();
            this.lastDate = currentDate;
            this.startTime = currentDate;
            this.endTime = currentDate;
            this.selectedDays = null;
        },

        saveProfile() {
            if (!this.selectedDays) {
                this.loginManagerValidation = true;
                return;
            } else{
                this.profileData = {
                    "days": this.selectedDays,
                    "start-time": this.getDateFormat(this.startTime.getHours()) +":"+ this.getDateFormat(this.startTime.getMinutes()),
                    "end-time": this.getDateFormat(this.endTime.getHours()) +":"+ this.getDateFormat(this.endTime.getMinutes()),
                    "last-date": this.getDateFormat(this.lastDate.getDate()) +"/"+ this.getDateFormat(this.lastDate.getMonth()) +"/"+ this.getDateFormat(this.lastDate.getFullYear()),
                    "duration": this.duration
                }
                this.$refs.profile.saveProfile(this.profileData);
            }
        },

        editProfile(data) {
            this.loginManagerValidation = false;
            if (data) {
                this.selectedTemplate = null;
                this.selectedDays = data.profileData["days"];
                this.setEndTime(data.profileData["end-time"]);
                this.setStartTime(data.profileData["start-time"]);
                this.duration = data.profileData["duration"];
                this.setLastDate(data.profileData["last-date"]);
            }
        },

        updateProfile() {
            if (!this.selectedDays || this.selectedDays.length == 0) {
                this.loginManagerValidation = true;
                return;
            } else{
                this.profileData = {
                    "days": this.selectedDays,
                    "start-time": this.getDateFormat(this.startTime.getHours()) +":"+ this.getDateFormat(this.startTime.getMinutes()),
                    "end-time": this.getDateFormat(this.endTime.getHours()) +":"+ this.getDateFormat(this.endTime.getMinutes()),
                    "last-date": this.getDateFormat(this.lastDate.getDate()) +"/"+ this.getDateFormat(this.lastDate.getMonth()) +"/"+ this.getDateFormat(this.lastDate.getFullYear()),
                    "duration": this.duration
                }
                this.$refs.profile.updateProfile(this.profileData);
                this.selectedDays = null;
            }
        },

        getDateFormat(param) {
            if (param < 10) {
                param = "0" + param;
            }
            return param.toString();
        },

        setStartTime(data) {
            let parserData = data.split(":");
            this.startTime = new Date();
            this.startTime.setHours(parserData[0]);
            this.startTime.setMinutes(parserData[1]);
        },

        setEndTime(data) {
            let parserData = data.split(":");
            this.endTime = new Date();
            this.endTime.setHours(parserData[0]);
            this.endTime.setMinutes(parserData[1]);
        },

        setLastDate(data) {
            let parserData = data.split("/");
            this.lastDate = new Date();
            this.lastDate.setDate(parserData[0]);
            this.lastDate.setMonth(parserData[1]);
            this.lastDate.setFullYear(parserData[2]);
        }
    },
}
</script>

<style lang="scss" scoped>
</style>