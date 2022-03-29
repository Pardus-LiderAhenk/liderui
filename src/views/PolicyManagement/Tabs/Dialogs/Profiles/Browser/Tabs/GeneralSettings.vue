<template>
    <div>
        <div class="p-fluid p-formgrid">
            <h6>Başlangıç</h6>
            <div class="p-field p-grid">
                <InputSwitch id="checkDefaultBrowser" class="p-col-fixed" v-model="checkDefaultBrowser"/>
                <label for="checkDefaultBrowser" class="p-col">Firefox'un varsayılan tarayıcı olduğunu her zaman kontrol et</label>
            </div>
            <div class="p-field">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-12 p-md-6">
                        <label>Firefox başlatıldığında</label>
                        <Dropdown
                            v-model="pageMode"
                            :options="[{name:'Anasayfayı göster', value:'1'},
                                {name: 'Boş sayfa göster', value:'0'},
                                {name: 'Geçen seferden kalan pencere ve sekmeleri göster', value: '3'}]"
                            optionLabel="name"
                            optionValue="value"
                        >
                        </Dropdown>
                    </div>
                    <div class="p-field p-col-12 p-md-6">
                        <label>Ana Sayfa</label>
                        <InputText class="p-inputtext-sm" type="text" v-model="homePage" placeholder="https://liderahenk.org/"/>
                    </div>
                </div>
            </div>
            <h6>İndirilenler</h6>
            <div class="p-field p-grid">
                <RadioButton value="true" v-model="useDownloadDir" id="useDownloadDir1"/>
                <label for="useDownloadDir1" class="p-col">Dosyaları buraya kaydet</label>
                <InputText class="p-inputtext-sm p-col" type="text" 
                    :disabled="useDownloadDir == 'false'"
                    v-model="downloadDir" 
                    placeholder="/home/kullanıcıAdı/İndirilenler"/>
            </div>
            <div class="p-field p-grid">
                <RadioButton id="useDownloadDir2" value="false" v-model="useDownloadDir"/>
                <label for="useDownloadDir2" class="p-col">Dosyaların nereye kaydedileceğini her seferinde sor</label>
            </div>
            <h6>Sekmeler</h6>
            <div class="p-field p-grid">
                <InputSwitch id="openNewWindow" class="p-col-fixed" v-model="openNewWindow"/>
                <label for="openNewWindow" class="p-col">Bağlantıları yeni sekmede aç</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="warnOnClose" class="p-col-fixed" v-model="warnOnClose"/>
                <label for="warnOnClose" class="p-col">Birden fazla sekme kapatılırken beni uyar</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="warnOnOpen" class="p-col-fixed" v-model="warnOnOpen"/>
                <label for="warnOnOpen" class="p-col">Firefox'un yavaşlamasına neden olabilecek sayıda sekme açılırken beni uyar</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="restoreOnDemand" class="p-col-fixed" v-model="restoreOnDemand"/>
                <label for="restoreOnDemand" class="p-col">Seçilene kadar sekmeleri yükleme</label>
            </div>
            <div class="p-field p-grid">
                <InputSwitch id="loadInBackground" class="p-col-fixed" v-model="loadInBackground"/>
                <label for="loadInBackground" class="p-col">Yeni sekme açıldığında, ona geç</label>
            </div>
            <h6>Eklenti Kurulumu</h6>
            <div class="p-field p-grid">
                <InputSwitch id="enableXpInstall" class="p-col-fixed" v-model="enableXpInstall"/>
                <label for="enableXpInstall" class="p-col">Eklenti kurulumunu engelle</label>
            </div>
        </div>
    </div>
</template>

<script>
import Preferences from './Preferences.js'

export default {

    props: {
        selectedProfileData: {
            type: Object,
            description: "Selected profile data",
        },
    },

    data() {
        return {
    //		General preferences
            checkDefaultBrowser: false,
            homePage: "",
            pageMode: "1",
            useDownloadDir: "false",
            downloadDir: "",
            openNewWindow: false,
            warnOnClose: false,
            warnOnOpen: false,
            restoreOnDemand: false,
            loadInBackground: false,
            enableXpInstall: false,
            generalPreferences: []
        }
    },

    mounted(){
        if (this.selectedProfileData) {
            this.setGeneralPreferences();
        } else {
            this.checkDefaultBrowser = false,
            this.homePage = "";
            this.pageMode = "1";
            this.useDownloadDir = "false";
            this.downloadDir = "";
            this.openNewWindow = false;
            this.warnOnClose = false;
            this.warnOnOpen = false;
            this.restoreOnDemand = false;
            this.loadInBackground = false;
            this.enableXpInstall = false;
        }
    },

    methods: {
        getGeneralPreferences() {
            this.addToPreferences(Preferences.checkDefaultBrowser, this.checkDefaultBrowser.toString());
            this.addToPreferences(Preferences.pageMode, this.pageMode);
            if (this.homePage) {
                this.addToPreferences(Preferences.homePage, this.homePage);
            }
            if (this.useDownloadDir == "true") {
                this.addToPreferences(Preferences.useDownloadDir, "true");
                this.addToPreferences(Preferences.useCustomDownloadDir, "2");
                this.addToPreferences(Preferences.downloadDir, this.downloadDir);
            } else {
                this.addToPreferences(Preferences.useDownloadDir, "false");
                this.addToPreferences(Preferences.useCustomDownloadDir, "1");
            }
            this.openNewWindow ? this.addToPreferences(Preferences.openNewWindow, "3"): this.addToPreferences(Preferences.openNewWindow, "2");
            this.warnOnClose ? this.addToPreferences(Preferences.warnOnClose, "true") : this.addToPreferences(Preferences.warnOnClose, "false");
            this.warnOnOpen ? this.addToPreferences(Preferences.warnOnOpen, "true") : this.addToPreferences(Preferences.warnOnOpen, "false");
            this.restoreOnDemand ? this.addToPreferences(Preferences.restoreOnDemand, "true") : this.addToPreferences(Preferences.restoreOnDemand, "false");
            this.loadInBackground ? this.addToPreferences(Preferences.loadInBackground, "false") : this.addToPreferences(Preferences.loadInBackground, "true");
            this.enableXpInstall ? this.addToPreferences(Preferences.enableXpInstall, "false") : this.addToPreferences(Preferences.enableXpInstall, "true");

            return this.generalPreferences;
        },

        addToPreferences(name, value) {
            this.generalPreferences.push({
                "preferenceName" : name,
			    "value" : value
            });
        },

        setGeneralPreferences() {
            let prefList = this.selectedProfileData.preferences;
            prefList.forEach(element => {
                if (element.preferenceName == Preferences.checkDefaultBrowser) {
                    if (element.value == 'true') {
                        this.checkDefaultBrowser = true;
                    }
                }
                if (element.preferenceName == Preferences.pageMode) {
                    this.pageMode = element.value;
                }
                if (element.preferenceName == Preferences.homePage) {
                    this.homePage = element.value;
                }
                if (element.preferenceName == Preferences.useDownloadDir) {
                     this.useDownloadDir = element.value;
                }
                if (element.preferenceName == Preferences.downloadDir) {
                    this.downloadDir = element.value;
                }
                if (element.preferenceName == Preferences.openNewWindow && element.value == "3") {
                    this.openNewWindow = true;
                }
                if (element.preferenceName == Preferences.warnOnClose && element.value == "true") {
                    this.warnOnClose = true;
                }
                if (element.preferenceName == Preferences.warnOnOpen && element.value == "true") {
                    this.warnOnOpen = true;
                }
                if (element.preferenceName == Preferences.loadInBackground && element.value == "false") {
                    this.loadInBackground = true;
                }
                if (element.preferenceName == Preferences.restoreOnDemand && element.value == "true") {
                    this.restoreOnDemand = true;
                }
                if (element.preferenceName == Preferences.enableXpInstall && element.value == "false") {
                    this.enableXpInstall = true;
                }
            });
        }
    },
}
</script>

<style lang="scss" scoped>
h6 {
    font-weight: bold;
}

</style>