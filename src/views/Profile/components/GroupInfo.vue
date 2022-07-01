<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-col-12">
            <h3>{{$t('profile.group_information.group_information')}}</h3>
        </div>
        <div class="p-col-12 p-md-12">
            <Panel :header="$t('profile.group_information.user_group_information')">
                <template v-if="user !== null">
                    <p  v-for="(item,index) in user.attributesMultiValues.memberOf" :key="'memberof' + index">
                        {{item}}
                    </p>
                </template>
                <Divider type="dashed"/>
            </Panel>
       </div>

       <div class="p-col-12 p-md-12">
            <Panel :header="$t('profile.group_information.user_authorization_group_information_sudo')">
                <p v-for="(item,index) in userSudoGroups" :key="'sudogroups' + index">
                    {{item.distinguishedName}}
                </p>
                <Divider type="dashed"/>
            </Panel>
       </div>  
    </div>
</template>


<script>
import axios from 'axios';

export default {
    props:['user'],
    data() {
        return {
            userSudoGroups: [],
        }
    },
    methods: {
        init(user) {
            this.getUserGroupInfo(user);
        },
        getUserGroupInfo(user) {
           if (user) {
               var data = new FormData();
               data.append('searchDn',"");
               data.append('key','sudoUser');
               data.append('value',user.uid);
                axios.post('/lider/ldap/searchEntry', data).then(response => {
                    this.userSudoGroups = response.data;
                }); 
           }
        }
    }
}

</script>
