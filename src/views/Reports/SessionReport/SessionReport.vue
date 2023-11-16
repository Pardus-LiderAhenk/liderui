<template>
    <div>
        <TabView>
            <TabPanel>
                <template #header>
                    <i class="pi pi-desktop"></i>
                    <span>
                        &nbsp;{{ $t('reports.session_report.agent_sessions')}}
                    </span>
                </template>
                <agent-session></agent-session>
                </TabPanel>
                <TabPanel>
                <template #header>
                    <i class="pi pi-users"></i>
                    <span>
                        &nbsp;{{$t('reports.session_report.user_sessions')}}
                    </span>
                </template>
                <user-session></user-session>
            </TabPanel>
        </TabView>
    </div>
 
  </template>
  
  <script>
  import AgentSession from "./Tabs/AgentSession.vue";
  import UserSession from "./Tabs/UserSession.vue";
  
  export default {

    components: {
        AgentSession,
        UserSession    
    },
      
  }
  </script>
  
  <style lang="scss" scoped>
  
  </style>