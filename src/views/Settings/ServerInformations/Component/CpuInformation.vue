<template>
    <div class="card">
        <Card>
            <template #title>
                <span style="margin: 0 0 1px; font-size:1rem">{{$t('Cpu bilgisi')}}</span>
            </template>
            <!-- <template>
                <div class="flex justify-content-center">
                    <Chart type="doughnut"  :options="chartOptions" class="w-full md:w-30rem" />
                </div>
            </template> -->
            
        </Card>
    </div>
        
</template>

<script>
export default{

// mounted(){
//     chartData.value = setChartData();
// },

// setChartData () {
//     const documentStyle = getComputedStyle(document.body);

//     return {
//         labels: ['A', 'B', 'C'],
//         datasets: [
//             {
//                 data: [540, 325, 702],
//                 backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
//                 hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
//             }
//         ]
//     };
// }
}

</script>

<style lang="scss" scoped>
    
    .card {
        background: #ffffff;
        box-sizing: border-box;
        width: 40em;
        position:absolute;
        box-shadow: 500px 500px 100px rgba(41, 50, 65, 0.06);
    }

</style>