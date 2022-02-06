import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Dashboard from '@/views/Dashboard/Dashboard.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import Login from '@/views/Login/Login.vue';
import ComputerManagement from '@/views/ComputerManagement/ComputerManagement.vue';
import FullLayout from '@/layouts/FullLayout.vue';
import ComputerGroupManagement from '@/views/GroupManagement/ComputerGroupManagement/ComputerGroupManagement.vue';
import UserGroupManagement from '@/views/GroupManagement/UserGroupManagement/UserGroupManagement.vue';
import UserPermissionsManagement from '@/views/GroupManagement/UserPermissionsManagement/UserPermissionsManagement.vue';
import UserManagement from '@/views/UserManagement/Ldap/UserManagement.vue';


//REPORTS
import AgentReport from '@/views/Reports/AgentReport.vue';
import TaskReport from '@/views/Reports/TaskReport.vue';

//SETTINGS
import ServerSettings from '@/views/Settings/ServerSettings/ServerSettings.vue';
import SystemMonitoringDefinitions from '@/views/Settings/SystemMonitoringDefinitions/SystemMonitoringDefinitions.vue';
import ScriptDefinitions from '@/views/Settings/ScriptDefinitions/ScriptDefinitions.vue';
import RegistrationTemplates from '@/views/Settings/RegistrationTemplates/RegistrationTemplates.vue';
import ConsoleUserSettings from '@/views/Settings/ConsoleUserSettings/ConsoleUserSettings.vue';
import AdManagement from '@/views/UserManagement/AD/AdManagement.vue';

// PROFILE
import UserProfile from '@/views/Profile/Profile.vue';

const routes = [{
        path: "/",
        redirect: "/dashboard",
        component: FullLayout,
        name: "Dashboards",
        children: [{
            path: "/dashboard",
            name: "Dashboard",
            components: { default: Dashboard },
            meta: {
                requiresAuth: true,
                }
            },
            {
                path: "/computermanagement",
                name: "ComputerManagement",
                components: { default: ComputerManagement },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: "/computer_group_management",
                name: "ComputerGroupManagement",
                components: { default: ComputerGroupManagement },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: "/usermanagement",
                name: "UserManagement",
                components: { default: UserManagement },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: "/ad_management",
                name: "AdManagement",
                components: { default: AdManagement },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: "/user_group_management",
                name: "UserGroupManagement",
                components: { default: UserGroupManagement },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: "/user_permissions_management",
                name: "UserPermissionsManagement",
                components: { default: UserPermissionsManagement },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: "/reports/agent",
                name: "AgentReport",
                components: { default: AgentReport },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: "/reports/task",
                name: "TaskReport",
                components: { default: TaskReport },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: '/settings/server_setings',
                name: 'ServerSettings',
                components: {default: ServerSettings},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/settings/system_monitoring_definitions',
                name: 'SystemMonitoringDefinitions',
                components: {default: SystemMonitoringDefinitions},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/settings/script_definitions',
                name: 'ScriptDefinitions',
                components: {default: ScriptDefinitions},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/settings/registratin_templates',
                name: 'RegistrationTemplates',
                components: {default: RegistrationTemplates},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/settings/console_user_settings',
                name: 'ConsoleUserSettings',
                components: {default: ConsoleUserSettings},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/user-profile',
                name: 'User Profile',
                components: {default: UserProfile},
                meta: {
                    requiresAuth: true
                }
            }
           
        ],
    },
    {
        path: "/",
        redirect: "/",
        component: AuthLayout,
        children: [{
            path: "/login",
            name: "Login",
            components: { default: Login },
            meta: {
                guest: true
            }
        }, ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: "active",
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if ( localStorage.getItem('auth_token') !== undefined 
                && localStorage.getItem('auth_token') !== null 
                && localStorage.getItem('auth_token') !== '') {
            next()
            return
        } 
        next('/login')
    }  else {
        next()
    }
})

export default router;