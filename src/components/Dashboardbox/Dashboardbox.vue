<template>

<!-- <Dashboardbox title="Merhaba" description="1,235,00" colorClass="darkgray" icon="pi pi-check"/> -->

  <div class="card overview-box" :class="colorClass">
    <div class="overview-info">
      <h6>{{title}}</h6>
      <h1 class="desClass">{{description}}</h1>
    </div>
    <i :class="icon" ></i>
  </div>
</template>

<script>
export default {
  props: {
    colorClass: {
        type: String,
        default: 'dark'
    }, 
    title: {
        type: String
    },
    description: {
        type: String
    },
    icon: {
        type:String,
        default: "pi pi-th-large"
    },
    descriptionFont: {
      type:String,
      default: "normal"
    }
  },

  computed: {
    dashboardStyle() {
      return {
        'p-inputtext-sm': this.isSmallInput,
        'p-invalid': this.validationErrors.password
      }
    },
  },
};
</script>

<style scoped>
.overview-box.darkgray {
  background: rgba(41, 50, 65, 0.8);
  color: #ffffff;
}
.overview-box {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-top: 24px;
  height: 100%;
  min-width: 200px;
}
.overview-box .overview-info > h6 {
  margin: 0 0 2px;
}
.overview-box .overview-info > h1 {
  margin: 0;
}
.overview-box > i {
  font-size: 24px;
}
.overview-box.white {
  background: #ffffff;
  color: rgba(41, 50, 65, 0.8);
}
.overview-box.pink {
  background: #e48365;
  color: #ffffff;
}
.overview-box.blue {
  background: #69b7ff;
  color: #ffffff;
}
.overview-box.gray {
  background: rgba(41, 50, 65, 0.4);
  color: #ffffff;
}
.overview-box.darkgray {
  background: rgba(41, 50, 65, 0.8);
  color: #ffffff;
}
.overview-box.orange {
  background: linear-gradient(90deg, #ffb340 0%, #ffa740 100%);
  color: #ffffff;
}
.overview-box.green {
  background: #4f8f91;
  color: #ffffff;
}
.desClass {
  font-weight: v-bind(descriptionFont);
}
/* .card {
      border-radius: 24px;
} */
</style>
