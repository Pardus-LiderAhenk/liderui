<template>
    <Card>
        <template #title>
            <span style="margin: 0 0 2px; font-size:1.2rem">{{$t('dashboard_screen.work_statistic')}}</span>
        </template>
        <template #subtitle>
            <span style="margin: 0 0 2px; font-size:1rem">{{$t('dashboard_screen.range_of_submitted_tasks_by_attachments')}}</span>
        </template>
        <template #content>
            <div v-if="userTasks.length == 0" class="p-d-flex p-jc-center">
                <small>{{$t('dashboard_screen.sent_task_cant_find')}}</small>
            </div>
            <ul class="activity-list" v-for="task in userTasks" :key="task[0]">
                <li>
                    <div class="p-d-flex p-jc-between p-ai-center p-mb-3">
                        <h5 style="margin: 0 0 2px; font-size:1.2rem" class="activity p-m-0">
                            {{task[0]}} - %{{((task[1] / totalTask)*100).toFixed(2)}}
                        </h5>
                        <div class="count" style="font-size:20px; background-color: #66BB6A">{{task[1]}}</div>
                    </div>
                    <ProgressBar :value="((task[1] / totalTask)*100).toFixed(2)" :showValue="false"/>
                </li>
            </ul>
        </template>
    </Card>
</template>

<script>
/**
 * executed tasks by logged in user with total count for each
 * @see {@link http://www.liderahenk.org/}
 */
export default {
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

</style>