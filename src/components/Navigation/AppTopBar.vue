<template>
	<div class="layout-topbar">
		<button class="p-link layout-menu-button" @click="onMenuToggle">
			<span class="pi pi-bars"></span>
		</button>
		<div class="layout-topbar-icons">
			<button class="p-link">
				<span class="layout-topbar-item-text">Events</span>
				<span class="layout-topbar-icon pi pi-calendar"></span>
				<span class="layout-topbar-badge">5</span>
			</button>
			<button class="p-link">
				<span class="layout-topbar-item-text">Settings</span>
				<span class="layout-topbar-icon pi pi-cog"></span>
			</button>
			<button class="p-link" @click="toggle">
				<span class="layout-topbar-item-text">User</span>
				<span class="layout-topbar-icon pi pi-user"></span>
			</button>
			 <Menu id="overlay_menu" ref="usermenu" :model="userMenu" :popup="true" />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			userMenu: [
				{
					label: 'Profil',
					icon: 'pi pi-user',
					command: () => {
						this.$toast.add({severity:'success', summary:'Updated', detail:'Data Updated', life: 3000});
					}
				},
				{
					label: 'Çıkış',
					icon: 'pi pi-power-off',
					command: () => {
						this.$toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
					}
				}
			]
		}
	},
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
		 toggle(event) {
            this.$refs.usermenu.toggle(event);
        },
    }
}
</script>