<template>
    <div>
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12">
                <slot></slot>
                <label v-if="showTitle" for="new_password">{{$t("password.new_password")}}</label>
                <div class="p-inputgroup">
                    <Password @update:modelValue="getPassword"
                        v-model="passwordForm.password" :toggleMask="toogleMask" 
                        :disabled="disabled"
                        :class="passwordClass"
                        onpaste="return false"
                        :strongRegex="strongRegex" 
                        :weakLabel="$t('password.weak')"
                        :mediumLabel="$t('password.medium')"
                        :strongLabel="$t('password.strong')"
                        :promptLabel="$t('password.password_prompt')"
                        :placeholder="$t('password.new_password')">
                        <template #footer="sp">
                            {{sp.level}}
                            <Divider />
                            <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
                                <li>{{ $t('password.lowercase_message') }}</li>
                                <li>{{ $t('password.uppercase_message') }}</li>
                                <li>{{ $t('password.number_message') }}</li>
                                <li>{{ $t('password.password_length_message') + " "+ passwordLength}}</li>
                                <li>{{ $t('password.does_not_support_message') }}</li>
                            </ul>
                        </template>
                    </Password>
                    <Button v-if="generate"
                        icon="pi pi-key" 
                        class="p-button-sm" :title='$t("password.generate_password")' 
                        @click.prevent="generatePassword"
                        :disabled="disabled"
                    />
                </div>
                <small v-show="validationErrors.password" 
                    class="p-error">{{ passwordErrorMessage }}
                </small>
            </div>
            <div class="p-field p-col-12">
                <label v-if="showTitle" for="confirm_password">{{$t("password.confirm_password")}}</label>
                <div class="p-inputgroup">
                    <Password @update:modelValue="getPassword"
                        v-model="passwordForm.confirmPassword" :toggleMask="toogleMask" 
                        :class="passwordConfirmClass" 
                        :disabled="disabled"
                        onpaste="return false"
                        :strongRegex="strongRegex" 
                        :weakLabel="$t('password.weak')"
                        :mediumLabel="$t('password.medium')"
                        :strongLabel="$t('password.strong')"
                        :promptLabel="$t('password.password_prompt')"
                        :placeholder="$t('password.confirm_password')">
                        <template #footer="sp">
                            {{sp.level}}
                            <Divider />
                            <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
                                <li>{{ $t('password.lowercase_message') }}</li>
                                <li>{{ $t('password.uppercase_message') }}</li>
                                <li>{{ $t('password.number_message') }}</li>
                                <li>{{ $t('password.password_length_message') + " "+ passwordLength}}</li>
                                <li>{{ $t('password.does_not_support_message') }}</li>
                            </ul>
                        </template>
                    </Password>
                    <Button v-if="generate"
                        icon="pi pi-key" 
                        class="p-button-sm" :title='$t("password.generate_password")' 
                        @click.prevent="generatePassword"
                        :disabled="disabled"
                    />
                </div>
                <small v-show="validationErrors.confirmPassword" 
                    class="p-error">{{ confirmPasswordErrorMessage }}
                </small>
            </div>
        </div>
    </div>
</template>

<script>

/**
 * Return password when called getPassword method by ref. 
 * @see {@link http://www.liderahenk.org/}
 */

export default {

    props: {
        isSmallInput: {
            type: Boolean,
            default: false,
            description: "Smaller input add p-inputtext-sm"
        },

        passwordLength: {
            type: Number,
            default: 6,
            description: "Password length"
        },

        strongRegex: {
            type: String,
            default: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})",
            description: "Password strong regex"
        },

        toogleMask: {
            type: Boolean,
            default: true,
            description: "Toogle mask for password"
        },

        disabled: {
            type: Boolean,
            default: false,
            description: "Disabled password input"
        },

        generate: {
            type: Boolean,
            default: true,
            description: "Generate password"
        },

        showTitle: {
            type: Boolean,
            default: true,
            description: "Show Password title"
        }
    },

    computed: {
        passwordClass() {
            return {
                'p-inputtext-sm': this.isSmallInput,
                'p-invalid': this.validationErrors.password
            }
        },

        passwordConfirmClass() {
            return {
                'p-inputtext-sm': this.isSmallInput,
                'p-invalid': this.validationErrors.confirmPassword
            }
        },
    },

    data() {
        return {
            passwordForm: {
                password: '',
                confirmPassword: '',
            },
            validationErrors: {},
            passwordErrorMessage: '',
            confirmPasswordErrorMessage: '',
        }
    },

    methods: {
        generatePassword() {
            let generatePassword = this.createPassword(this.passwordLength);
            this.passwordForm.password = generatePassword;
            this.passwordForm.confirmPassword = generatePassword;
        },

        async setPasswordForm(password, confirmPassword) {
            await this.setPassword(password, confirmPassword);
            delete this.validationErrors['password'];
            delete this.validationErrors['confirmPassword'];
        },

        setPassword(password, confirmPassword) {
            return new Promise((resolve, reject)=> {
                this.passwordForm.password = password;
                this.passwordForm.confirmPassword = confirmPassword;
                resolve(true);
            });
        },

        validateForm() {
            if (!this.passwordForm.password.trim()){
                if (!this.passwordForm.password.trim()){
                    this.validationErrors['password'] = true;
                } else{
                    delete this.validationErrors['password'];
                }
                if (!this.passwordForm.confirmPassword.trim()){
                    this.validationErrors['confirmPassword'] = true;
                } else{
                    delete this.validationErrors['confirmPassword'];
                }
                this.passwordErrorMessage = this.$t('password.password_input_message');
                this.confirmPasswordErrorMessage = this.$t('password.confirm_password_input_message');
                return;
            }
            if (!/[a-z]/.test(this.passwordForm.password)) {
                this.passwordErrorMessage = this.$t('password.lowercase_message')+" (a-z)";
                return;
            } else if (!/[A-Z]/.test(this.passwordForm.password)) {
                this.passwordErrorMessage = this.$t('password.uppercase_message')+" (A-Z)";
                return;
            } else if (!/[0-9]/.test(this.passwordForm.password)) {
                this.passwordErrorMessage = this.$t('password.number_message')+" (0-9)";
                return;
            } else if (/[*]/.test(this.passwordForm.password)) {
                this.passwordErrorMessage = this.$t('password.does_not_support_message');
                return;
            } else if (this.passwordForm.password.length < this.passwordLength) {
                this.passwordErrorMessage = this.$t('password.password_length_message')+" "+ this.passwordLength;
                return;
            } else {
                this.passwordErrorMessage = '';
                delete this.validationErrors['password'];
            }
            if (this.passwordForm.password != this.passwordForm.confirmPassword) {
                this.validationErrors['confirmPassword'] = true;
                this.confirmPasswordErrorMessage = this.$t('password.match_password_message');
                return;
            } else {
                this.confirmPasswordErrorMessage = '';
                delete this.validationErrors['confirmPassword'];
            }
            return !Object.keys(this.validationErrors).length;
        },

        getPassword() {
            if (this.validateForm()) {
                return this.passwordForm.password;
            } else {
                return null;
            }
        },

        createPassword(passwordLength) {
            var numberChars = "0123456789";
            var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var lowerChars = "abcdefghijklmnopqrstuvwxyz";
            var allChars = numberChars + upperChars + lowerChars;
            var randPasswordArray = Array(passwordLength);
            randPasswordArray[0] = numberChars;
            randPasswordArray[1] = upperChars;
            randPasswordArray[2] = lowerChars;
            randPasswordArray = randPasswordArray.fill(allChars, 3);
            return this.shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
        },

        shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }
    },

    watch: {
        passwordForm: {
            handler(){
                this.validateForm();
            },
            deep: true,
        },
    },
}

</script>

<style lang="scss" scoped>

</style>