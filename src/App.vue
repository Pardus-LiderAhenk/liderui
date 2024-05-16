<template>
  <router-view></router-view>
</template>

<script>
import strope from './services/strophe';
import { getLiderWs } from '@/libs/liderws';

export default {
  data() {
    return {
      exampleLeakyProperty: 'This represents a property that will leak memory if not cleaned up.'
    }
  },

  mounted() {
    // if(!strope.getInstance().isConnected()) {
    //   strope.getInstance().connect();
    // }

    if (!getLiderWs().isConnected()) {
      getLiderWs().connect();
    }
  }

}


window.addEventListener("beforeunload", function(event) {
  //strope.getInstance().disconnect();
  getLiderWs().disconnect();
});





</script>