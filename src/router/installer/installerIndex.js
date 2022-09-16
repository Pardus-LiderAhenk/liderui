import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import InstallerLayout from '@/layouts/InstallerLayout.vue';
import Dashboard from '@/views/Installation/Dashboard/Dashboard.vue';

import BasicInstallation from '../../views/Installation/BasicInstallation/BasicInstallation.vue';
import DatabaseInstallation from '../../views/Installation/BasicInstallation/Servers/DatabaseInstallation.vue';
import OpenLdapInstallation from '../../views/Installation/BasicInstallation/Servers/OpenLdapInstallation.vue';
import EjabberdInstallation from '../../views/Installation/BasicInstallation/Servers/EjabberdInstallation.vue'



const routes = [
    {
        path: "/",
        redirect: "/dashboard",
        component: InstallerLayout,
        name: "Home",
        children: [
            {
                path: "/dashboard",
                name: "Dashboard",
                components: { default: Dashboard },
            },
            {
                path: "/basic/installation",
                name: "Basic Installation",
                components: { default: BasicInstallation },
                children: [
                    {
                        path: "/basic/installation/database",
                        name: "Database Installation",
                        components: { default: DatabaseInstallation }
                    },
                    {
                        path: "/basic/installation/openldap",
                        name: "OpenLDAP Installation",
                        components: { default: OpenLdapInstallation }
                    },
                    {
                        path: "/basic/installation/ejabberd",
                        name: "Ejabberd Installation",
                        components: { default: EjabberdInstallation }
                    },
                ]
            },

            {
                path: "/advanced/installation",
                name: "Advanced",
                components: { default: BasicInstallation },
            },
        ],
    },
];

const installerRouter = createRouter({
    history: createWebHashHistory(),
    linkActiveClass: "active",
    routes: routes,
});

installerRouter.beforeEach((to, from, next) => {
    next()
    // if (to.matched.some(record => record.meta.requiresAuth)) {
    //     if ( localStorage.getItem('auth_token') !== undefined 
    //             && localStorage.getItem('auth_token') !== null 
    //             && localStorage.getItem('auth_token') !== '') {
    //         next()
    //         return
    //     } 
    //     next('/login')
    // }  else {
    //     next()
    // }
})

export default installerRouter;
