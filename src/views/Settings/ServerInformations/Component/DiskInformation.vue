<template>
    <div>
        <Card>
            <template #title>
                <span style="margin: 0 0 2px; font-size:1.2rem">{{$t('Disk bilgisi')}}</span>
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
    
    .Card {
        background: #ffffff;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 0px 10px 40px rgba(41, 50, 65, 0.06);
    }

    </style>