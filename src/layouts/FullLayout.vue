<template>
    <Toast />
    
    <div style="width:99%" >
       <app-menubar />
        <div >
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
    }
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