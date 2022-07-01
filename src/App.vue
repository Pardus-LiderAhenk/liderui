<template>
  <router-view></router-view>
</template>

<script>
import strope from './services/strophe';
export default {
  data() {
    return {
      exampleLeakyProperty: 'This represents a property that will leak memory if not cleaned up.'
    }
  },

  mounted() {
    if(!strope.getInstance().isConnected()) {
      strope.getInstance().connect();
    }
  }

}


window.addEventListener("beforeunload", function(event) {
  strope.getInstance().disconnect();
});





</script>