<template>
  <div>
    <div class="p-field" >
        <Card class="installer" style="width: 50em" @click.stop="bacisInstallation">
            <template #header>
                <img src="@/assets/images/liderahenk.jpeg" style="height: 10rem" />
            </template>
            <template #title>
                Basic Installation
            </template>
            <template #content>
                <p>Liderahenk bileşenlerinin temel seviyede kurulumunu yapar.</p>
            </template>
        </Card>
    </div>
    <div class="p-field" >
        <Card class="installer" style="width: 50em" @click.stop="onNodeSelect">
            <template #header>
                <img src="@/assets/images/liderahenk.jpeg" style="height: 10rem" />
            </template>
            <template #title>
                Advanced Installation
            </template>
            <template #content>
                <p>Liderahenk bileşenlerinin cluster olarak kurulmasını sağlar</p>
            </template>
        </Card>
    </div>
    <div class="p-field" >
        <Card class="installer" style="width: 50em" @click.stop="onNodeSelect">
        <template #header>
            <img src="@/assets/images/liderahenk.jpeg" style="height: 10rem" />
        </template>
        <template #title>
            Docker Installation
        </template>
        <template #content>
            <p>Liderahenk bileşenlerinin cluster olarak kurulmasını sağlar</p>
        </template>
    </Card>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            liderImg: require("@/assets/images/liderahenk.jpeg")
        }
    },
    methods: {
        onNodeSelect() {
            this.$toast.add({severity:'success', summary: 'Node Selected', detail: "test", life: 3000});
        },

        bacisInstallation() {
            this.$toast.add({
                severity:'success', 
                detail: "You are redirected to basic installation", 
                summary: this.$t("computer.task.toast_summary"), 
                life: 3000
            });
            setTimeout(() => {
                this.$router.push("/basic/installation").catch(err => console.log(err))
            }, 3000);
        }
    }
}
</script>

<style lang="scss" scoped>

// .installer {
//     background-color: #e7f2f8;
// }

p {
    line-height: 1.5;
    margin: 0;
}

.installer {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
  
}
.installer:hover {
  box-shadow: 0 8px 20px 0 rgba(155, 150, 150, 0.2);
  cursor: pointer;
  
} 
</style>