<template>
    <div class="card">
        <Card>
            <template #title>
                <div class="p-d-flex p-jc-between">
                    <span style="margin: 0 0 1px; font-size:1rem">{{$t('Ram bilgisi')}}</span>
                    <Button label="İzle" severity="watch" raised />
                </div>
                
            </template>
            <template #content>
                <div class="doughnut">
                    <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-5rem" />
                </div>
            </template>
            
        </Card>
    </div>
        
</template>

<script>
export default{
    
   
    data() {
        return {
            chartData: null,
            chartOptions: {
                cutout: '60%'
            }
        };
    },
    mounted() {
        this.chartData = this.setChartData();
    },
    methods: {
        setChartData() {
            const documentStyle = getComputedStyle(document.body);

            return {
                labels: ['A', 'B'],
                datasets: [
                    {
                        data: [100, 50],
                        backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--green-500')],
                        hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-200'), documentStyle.getPropertyValue('--green-200'), documentStyle.getPropertyValue('--green-400')]
                    }
                ]
            };
        }
    }
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
.doughnut{
    width: 10rem;
    box-sizing: border-box;
}

</style>