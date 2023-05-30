<template>
    <div class="card">
        <Card>
            <template #title>
                <span>{{$t('Disk bilgisi')}}</span>
            </template>
            <template #content>
                <div >
                    <ProgressBar :value="50"></ProgressBar>
                </div>
                <div >
                    <ProgressBar :value="50"></ProgressBar>
                </div>
                <div>
                    <ProgressBar :value="50"></ProgressBar>
                </div>
            </template>
        </Card>
    </div>
        
</template>

<script>
import ProgressBar from 'primevue/progressbar';
import Card from 'primevue/card';

export default{
     
    props: {
        userTasks: {
            type: Array,
        },
    },

    data() {
        return {
            totalTask: 0,
        }
    },

    watch: {
        userTasks() {
            if (this.userTasks) {
                for (let index = 0; index < this.userTasks.length; index++) {
                    const element = this.userTasks[index];
                    this.totalTask = this.totalTask + element[1];
                }
            }
        }
    }

}
</script>

<style lang="scss" scoped>
    
    .card {
        background: #ffffff;
        box-sizing: border-box;
        width: 40em;
        box-shadow: 500px 500px 100px rgba(41, 50, 65, 0.06);
    }

</style>