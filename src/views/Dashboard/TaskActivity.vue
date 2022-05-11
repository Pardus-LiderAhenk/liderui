<template>
    <Card>
        <template #title>
            <span style="margin: 0 0 2px; font-size:1.2rem">Görev İstatistiği</span>
        </template>
        <template #subtitle>
            <span style="margin: 0 0 2px; font-size:1rem">Gönderilen görevlerin eklentilere göre dağılımı</span>
        </template>
        <template #content>
            <ul class="activity-list" v-for="task in tasks" :key="task.plugin_name">
                <li>
                    <div class="p-d-flex p-jc-between p-ai-center p-mb-3">
                        <h5 style="margin: 0 0 2px; font-size:1.2rem" class="activity p-m-0">{{task.plugin_name}}</h5>
                        <div class="count" style="font-size:20px; background-color: #66BB6A">{{task.value}}</div>
                    </div>
                    <ProgressBar :value="getTaskRange(task.value)" :showValue="true" />
                </li>
            </ul>
        </template>
    </Card>
</template>

<script>
export default {
    data() {
        return {
            value: "50",
            totalTask: 0,
            tasks:[
                {
                    "plugin_name":"Kaynak Kullanımı",
                    "value": 50
                },
                {
                    "plugin_name":"Paket Kur veya Kaldır",
                    "value": 25
                },
                {
                    "plugin_name":"Betik Çalıştır",
                    "value": 75
                },
                {
                    "plugin_name":"Yerel Kullanıcı",
                    "value": 15
                },
                {
                    "plugin_name":"Dosya Paylaşımı",
                    "value": 8
                },
                {
                    "plugin_name":"Root Parola Yönetimi",
                    "value": 13
                },
                {
                    "plugin_name":"Uzak Erişim",
                    "value": 33
                },
            ]
        }
    },

    mounted() {
        for (let index = 0; index < this.tasks.length; index++) {
            const element = this.tasks[index];
            this.totalTask = this.totalTask + element.value;
            
        }
    },

    methods: {
        getTaskRange(value) {
            return ((value / this.totalTask)*100).toFixed(2);
        }
    }
    
}
</script>

<style lang="scss" scoped>

</style>