<template>
    <div>
        <Card>
            <template #title>
                <div style="font-size:15px;">
                    {{ $t("group_management.active_policy_list") }}
                </div>
                <hr style="margin-bottom:-5px">
            </template>
            <template #content>
                <div class="p-grid p-flex-column">
                    <div class="p-col">
                        <DataTable class="p-datatable-sm" 
                            :value="selectedNodeSummaryData"
                            responsiveLayout="scroll"
                        >
                            <template #empty>
                                <div class="p-d-flex p-jc-center">
                                    <span>{{$t('group_management.active_policy_empty_message')}}</span>
                                </div>
                            </template>
                            <Column field="label" header="#" style="width:10%"></Column>
                            <Column field="label" :header="$t('group_management.policy_name')" style="width:30%"></Column>
                            <Column field="label" :header="$t('group_management.created_date')" style="width:20%"></Column>
                            <Column field="value" :header="$t('group_management.description')" style="width:40%"></Column>
                        </DataTable>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>

</style>