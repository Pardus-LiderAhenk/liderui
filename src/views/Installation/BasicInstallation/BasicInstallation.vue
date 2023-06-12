<template>
    <div>
        <div class="p-field" >
            <Panel header="Liderahenk Installation Steps">
                <template #header>
                    <h3 style="fontSize: 1.5rem">Liderahenk Installation Steps</h3>
                </template>
                <template #icons>
                    <i class="pi pi-server" style="fontSize: 1.5rem;color:#3296F3;"></i>
                </template>
                <div class="p-fluid">
                    <div class="p-field">
                        <Steps :model="items" :readonly="true" />
                    </div>
                </div>
            </Panel>
        </div>

        <div>


            {{ denemeData }}


        </div>


        <br>
        <div class="p-field">
            <router-view v-slot="{Component}" 
                :formData="formObject"
                @prevPage="prevPage($event)" 
                @nextPage="nextPage($event)" 
                @complete="complete"
            >
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script>
import {basicInstallationService} from '../../../services/Installation/BasicInstallation/BasicInstallationService.js'

export default {
    data() {
        return {
            items: [
                {
                    label: 'Database',
                    to: '/basic/installation/database'
                },
                {
                    label: 'OpenLDAP',
                    to: '/basic/installation/openldap'
                },
                {
                    label: 'Ejabberd',
                    to: '/basic/installation/ejabberd'
                },
                {
                    label: 'Confirmation',
                    to: '/basic/installation/confirmation'
                }
            ],
            formObject: {},
            denemeData : null
        }
    },
    methods: {

        async startInstallation() {
         
         // this.$emit('complete');
            const {data, error} = await basicInstallationService.denemeAnsible(null)
            if (data) {
                this.$toast.add({
                    severity:'success', 
                    detail: "Komut başarılı bir şekilde çalıştı", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
                this.denemeData = data
            } else {
                this.$toast.add({
                    severity:'error', 
                    detail: "Komut çalıştırılırken hata oluştu", 
                    summary:this.$t("computer.task.toast_summary"), 
                    life: 3000
                });
            }
        },


        nextPage(event) {
            console.log(event)
            for (let field in event.formData) {
                this.formObject[field] = event.formData[field];
            }

            this.$router.push(this.items[event.pageIndex + 1].to);
        },
        prevPage(event) {
            this.$router.push(this.items[event.pageIndex - 1].to);
        },
    },

    mounted() {
        this.startInstallation()
        this.$router.push("/basic/installation/database").catch(err => console.log(err))
    },
}
</script>

<style scoped lang="scss">
::v-deep(b) {
    display: block;
}

::v-deep(.p-card-body) {
    padding: 2rem;
}
</style>