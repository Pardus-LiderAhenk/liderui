<template>
    <div class="stepsdemo-content">
        <Card>
            <template v-slot:title> Ejabberd Installation </template>
            <template v-slot:subtitle> Enter your personal information </template>
            <template v-slot:content>
                <div class="p-fluid">
                    <div class="field">
                        <label for="firstname">Firstname</label>
                        <InputText id="firstname" v-model="firstname" :class="{ 'p-invalid': validationErrors.firstname && submitted }" />
                        <small v-show="validationErrors.firstname && submitted" class="p-error">Firstname is required.</small>
                    </div>
                    <div class="field">
                        <label for="lastname">Lastname</label>
                        <InputText id="lastname" v-model="lastname" :class="{ 'p-invalid': validationErrors.lastname && submitted }" />
                        <small v-show="validationErrors.lastname && submitted" class="p-error">Lastname is required.</small>
                    </div>
                    <div class="field">
                        <label for="age">Age</label>
                        <InputNumber id="age" v-model="age" />
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="p-d-flex p-jc-between">
                    <Button label="Back" @click="prevPage()" icon="pi pi-angle-left" />
                    <!-- <Button label="Next" @click="nextPage()" icon="pi pi-angle-right" iconPos="right" /> -->
                </div>
            </template>
        </Card>
    </div>
</template>

<script>
export default {
    emits: ['prev-page'],
    data() {
        return {
            firstname: '',
            lastname: '',
            age: null,
            submitted: false,
            validationErrors: {}
        };
    },
    methods: {

        prevPage() {
            this.$emit('prev-page', { pageIndex: 2 });
        },

        validateForm() {
            if (!this.firstname.trim()) this.validationErrors['firstname'] = true;
            else delete this.validationErrors['firstname'];
            if (!this.lastname.trim()) this.validationErrors['lastname'] = true;
            else delete this.validationErrors['lastname'];
            return !Object.keys(this.validationErrors).length;
        }
    }
};
</script>

