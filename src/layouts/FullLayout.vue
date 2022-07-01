<template>
    <Toast />
    <div class="p-flex-column layout-main-container" >
        <div>
            <app-menubar />
        </div>
        <div class="p-col-12">
			<router-view />
		</div>
	</div>
</template>

<script>
import AppMenubar from '../components/Navigation/AppMenubar.vue';

export default {
    components: {
        AppMenubar,
    },
    data() {
        return {
           
        }
    },
    mounted() {
        if (this.$store.getters.getUser && this.$store.getters.getUser.attributesMultiValues && this.$store.getters.getUser.attributesMultiValues.preferredLanguage) {
           this.$i18n.locale = this.$store.getters.getUser.attributesMultiValues.preferredLanguage[0];
        }
        
    },
}
</script>


<style scoped lang="scss"> 
    ::v-deep .p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-menuitem-text {
        color: #fff
    }
    ::v-deep .p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-menuitem-icon {
        color:#fff
    }
    ::v-deep .p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-submenu-icon {
        color: #fff;
    }
    ::v-deep .p-menubar .p-submenu-list {
        width: 300px;
    }
</style>