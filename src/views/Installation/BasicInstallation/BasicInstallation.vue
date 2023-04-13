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
            formObject: {}
        }
    },
    methods: {
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