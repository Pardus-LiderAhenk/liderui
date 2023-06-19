<template>
    <div>
        <!-- Delete Policy Dialog -->
        <Dialog :header="$t('Sucunu güncelle')" v-model:visible="showDialog" 
            :style="{width: '20vw'}" :modal="true">
            <div class="p-fluid">
                <i class="pi pi-info-circle p-mr-3" style="font-size: 1.5rem" />
                <span>
                    {{$t('Sunucu güncellenecek emin misiniz?') }}
                </span>
            </div>
            <template #footer>
               
            </template>
        </Dialog>
    </div>
</template>

<script>
</script>
