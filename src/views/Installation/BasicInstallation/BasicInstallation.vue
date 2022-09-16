<template>
    <div>
        <div class="p-field" >
            <Card class="installer">
                <template #title>
                    Liderahenk Installation Steps
                </template>
                <template #content>
                    <div class="p-fluid">
                        <div class="p-field">
                            <Steps :model="items" :readonly="false" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <div class="p-field">
            <router-view v-slot="{Component}" :formData="formObject"
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
                }
            ],
            formObject: {}
        }
    },
    methods: {
        nextPage(event) {
            for (let field in event.formData) {
                this.formObject[field] = event.formData[field];
            }

            this.$router.push(this.items[event.pageIndex + 1].to);
        },
        prevPage(event) {
            this.$router.push(this.items[event.pageIndex - 1].to);
        },
        complete() {
            this.$toast.add({severity:'success', summary:'Order submitted', detail: 'Dear, ' + this.formObject.firstname + ' ' + this.formObject.lastname + ' your order completed.'});
        }
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