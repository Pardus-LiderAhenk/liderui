import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Dashboard from '@/views/Dashboard/Dashboard.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import Login from '@/views/Login/Login.vue';
import ComputerManagementTab from '@/views/ComputerManagement/ComputerManagementTab.vue';
import FullLayout from '@/layouts/FullLayout.vue';

//REPORTS
import AgentReport from '@/views/Reports/AgentReport.vue';
import TaskReport from '@/views/Reports/TaskReport.vue';
import LogReport from '@/views/Reports/SystemLogReport.vue';
import ScheduledTaskReport from '@/views/Reports/ScheduledTaskReport.vue';

//SETTINGS
import ServerSettings from '@/views/Settings/ServerSettings/ServerSettings.vue';
import SystemMonitoringDefinitions from '@/views/Settings/SystemMonitoringDefinitions/SystemMonitoringDefinitions.vue';
import ScriptDefinitions from '@/views/Settings/ScriptDefinitions/ScriptDefinitions.vue';
import RegistrationTemplates from '@/views/Settings/RegistrationTemplates/RegistrationTemplates.vue';
import ConsoleUserSettings from '@/views/Settings/ConsoleUserSettings/ConsoleUserSettings.vue';

//USER
import UserManagementTab from '@/views/UserManagement/UserManagementTab.vue';

// LIDER CONSOLE PROFILE
import UserProfile from '@/views/Profile/Profile.vue';

//POLICY
import PolicyManagement from '@/views/PolicyManagement/PolicyManagement.vue';

import RemoteAccess from '../components/RemoteAccessComp/RemoteAccess.vue';

const routes = [
    {
        path:'/remoteAccess',
        name:'Remote Access',
        component:RemoteAccess,
    },
    {
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
                path: "/computer",
                name: "ComputerManagement",
                components: { default: ComputerManagementTab },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: "/user",
                name: "UserManagement",
                components: { default: UserManagementTab },
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
                path: "/reports/logs",
                name: "LogReport",
                components: { default: LogReport },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: "/reports/scheduled",
                name: "ScheduledReport",
                components: { default: ScheduledTaskReport },
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
                path: '/user_profile',
                name: 'User Profile',
                components: {default: UserProfile},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/policy',
                name: 'Policy Management',
                components: {default: PolicyManagement},
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