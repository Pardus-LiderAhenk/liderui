<template>
    <div class="card">
        <Card>
            <template #title>
                <span style="margin: 0 0 1px; font-size:1rem">{{$t('Cpu bilgisi')}}</span>
            </template>
            
        </Card>
    </div>
        
</template>

<script>
export default{
    
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