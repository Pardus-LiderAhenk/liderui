import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Dashboard from '@/views/Dashboard/Dashboard.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import Login from '@/views/Login/Login.vue';
import ComputerManagementTab from '@/views/ComputerManagement/ComputerManagementTab.vue';
import FullLayout from '@/layouts/FullLayout.vue';

//REPORTS
import AgentReport from '@/views/Reports/AgentReport/AgentReport.vue';
import TaskReport from '@/views/Reports/TaskReport.vue';
import LogReport from '@/views/Reports/SystemLogReport.vue';
import ScheduledTaskReport from '@/views/Reports/ScheduledTaskReport.vue';
import SessionReport from '@/views/Reports/SessionReport/SessionReport.vue';

//SETTINGS
import ServerSettings from '@/views/Settings/ServerSettings/ServerSettings.vue';
import SystemMonitoringDefinitions from '@/views/Settings/SystemMonitoringDefinitions/SystemMonitoringDefinitions.vue';
import ScriptDefinitions from '@/views/Settings/ScriptDefinitions/ScriptDefinitions.vue';
import RegistrationTemplates from '@/views/Settings/RegistrationTemplates/RegistrationTemplates.vue';
import ConsoleUserSettings from '@/views/Settings/ConsoleUserSettings/ConsoleUserSettings.vue';
import ServerInformations from '@/views/Settings/ServerInformations/ServerInformations.vue';

//USER
import UserManagementTab from '@/views/UserManagement/UserManagementTab.vue';

// LIDER CONSOLE PROFILE
import UserProfile from '@/views/Profile/Profile.vue';

//POLICY
import PolicyManagement from '@/views/PolicyManagement/PolicyManagement.vue';
// Remote Access
import RemoteAccessScreem from '@/views/ComputerManagement/Plugins/Task/RemoteAccess/RemoteAccessScreen.vue';

// Forgot Password
import ForgotPassword from '@/views/Login/ForgotPassword.vue';
import ResetPassword from '@/views/Login/ResetPassword.vue';

const routes = [
    {
        path:'/remote-access',
        name:'Remote Access',
        component:RemoteAccessScreem,
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
                path: "/reports/session",
                name: "SessionReport",
                components: { default: SessionReport },
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: '/settings/server-settings',
                name: 'ServerSettings',
                components: {default: ServerSettings},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/settings/system-monitoring-definitions',
                name: 'SystemMonitoringDefinitions',
                components: {default: SystemMonitoringDefinitions},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/settings/script-definitions',
                name: 'ScriptDefinitions',
                components: {default: ScriptDefinitions},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/settings/registration-templates',
                name: 'RegistrationTemplates',
                components: {default: RegistrationTemplates},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/settings/console-user-settings',
                name: 'ConsoleUserSettings',
                components: {default: ConsoleUserSettings},
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/settings/server-informations',
                name: 'ServerInformations',
                components: {default: ServerInformations},
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
        children: [
            {
                path: "/login",
                name: "Login",
                components: { default: Login },
                meta: {
                    guest: true
                }
            },
            {
                path: "/forgot-password",
                name: "ForgotPassword",
                components: { default: ForgotPassword },
                meta: {
                    guest: true
                }
            },
            {
                path: "/forgot-password/id/:uuid",
                name: "Reset Password",
                components: { default: ResetPassword },
                meta: {
                    guest: true
                }
            }  
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    //history: createWebHashHistory(),
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
