<template>
    <div class="p-fluid">
        <div class="p-fluid p-field p-grid">
            <div class="p-field p-col-12 p-md-5">
                <InputText :class="validation.preferenceName ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'"
                 type="text" v-model="preferenceName" :placeholder="$t('policy_management.profile.browser.feature_name')"/>
                <small v-if="validation.preferenceName" class="p-error">
                    {{$t('policy_management.profile.browser.feature_name_cannot_be_null')}}
                </small>
            </div>
            <div class="p-field p-col-12 p-md-5">
                <InputText :class="validation.value ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'"
                    type="text" v-model="value" :placeholder="$t('policy_management.profile.browser.value')"/>
                <small v-if="validation.value" class="p-error">
                    {{$t('policy_management.profile.browser.feature_value_cannot_be_null')}}
                </small>
            </div>
            <div class="p-field p-col-12 p-md-2">
                <Button class="p-button-sm" 
                    icon="pi pi-plus"
                    :label="$t('policy_management.add')" 
                    @click.prevent="addPreferenceItem">
                </Button>
            </div>
        </div>
        <DataTable :value="otherPreferences" responsiveLayout="scroll"
            class="p-datatable-sm p-field">
            <template #empty>
                <div class="p-d-flex p-jc-center">
                    <span>{{$t('policy_management.profile.browser.firefox_feature_cannot_find')}}</span>
                </div>
            </template>
            <Column field="preferenceName" :header="$t('policy_management.profile.browser.feature_name')" style="width:40%"></Column>
            <Column field="value" :header="$t('policy_management.profile.browser.value')" style="width:40%"></Column>
            <Column :exportable="false">
                <template #body="slotProps">
                    <div class="p-d-flex p-jc-end">
                        <Button class="p-button-sm p-button-rounded p-button-danger" 
                            icon="pi pi-trash"  
                            :title="$t('policy_management.delete')" 
                            @click.prevent="deletePreferenceItem(slotProps.data)">
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import Preferences from './Preferences';

export default {
    props: {
        selectedProfileData: {
            type: Object,
            description: "Selected profile data",
        },
    },

    data() {
        return {
            preferenceName: "",
            value: "",
            otherPreferences: [],
            validation: {
                preferenceName: false,
                value: false
            }
        }
    },

    mounted(){
        if (this.selectedProfileData) {
            this.setOtherPreferences();
        } else {
            this.otherPreferences = [];
        }
    },

    methods: {
        addPreferenceItem() {
            if (!this.preferenceName.trim()) {
                this.validation.preferenceName = true;
                return;
            }
            if (!this.value.trim()) {
                this.validation.value = true;
                return;
            }
            this.otherPreferences.push({
                "preferenceName": this.preferenceName,
                "value": this.value
            });
            this.preferenceName = "";
            this.value = "";
            this.validation.preferenceName = false;
            this.validation.value = false;
        },

        deletePreferenceItem(data) {
            this.otherPreferences = this.otherPreferences.filter(preference => preference.preferenceName != data.preferenceName);
        },

        getOtherPreferences() {
            return this.otherPreferences;
        },

        setOtherPreferences() {
            let prefList = this.selectedProfileData.preferences;
            prefList.forEach(element => {
                if(!this.isExistPref(element.preferenceName)){
                    this.otherPreferences.push({
                        "preferenceName": element.preferenceName,
                        "value": element.value
                    });
                }
            });
        },

        isExistPref(preferenceName) {
            let isExist = false;
            var defaultPrefList = Object.keys(Preferences);
            for (let index = 0; index < defaultPrefList.length; index++) {
                const element = defaultPrefList[index];
                if(Preferences[element] == preferenceName){
                    isExist = true;
                }
                
            }
            return isExist;
        }
    },

    watch: {
        preferenceName() {
            if (this.preferenceName.trim()) {
                this.validation.preferenceName = false;
            }
        },

        value() {
            if (this.value.trim()) {
                this.validation.value = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>