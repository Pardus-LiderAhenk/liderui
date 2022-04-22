<template>
    <div>
        <div class="p-grid">
            <div class="p-col">
                <Dashboardbox
                title="Total Project Count"
                description="Açıklama"
                :icon="'pi pi-file-o'"
                colorClass="blue"
                />
            </div>
            <div class="p-col">
                <Dashboardbox title="Total Procurement Count" description="Açıklama" colorClass="darkgray"/>
            </div>
            <div class="p-col">
                <Dashboardbox title="Total Contract Count" description="Açıklama" :icon="'pi pi-star'" colorClass="orange"/>
            </div>
            <div class="p-col">
                <Dashboardbox title="Total Contract Count" description="Açıklama" :icon="'pi pi-star'" colorClass="green"/>
            </div>
        </div>
    </div>
 
</template>


<script>
import Dashboardbox from "../../components/Dashboardbox/Dashboardbox.vue";

export default {
    components: { Dashboardbox },

}
</script>
