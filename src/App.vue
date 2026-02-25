<template>
  <router-view></router-view>
</template>

<script>
import strope from './services/strophe';
import { getLiderWs } from '@/libs/liderws';
import store from './store/store';

export default {
  mounted() {
    // If a user is present in the persisted store (e.g. on a new tab/window), try to establish WS connection
    try {
      const user = store.getters.getUser;
      const uid = user && user.uid ? user.uid : null;
      if (uid) {
        // connect only if not already connected (guard in liderws handles double connect)
        getLiderWs().connect(uid);
      }
    } catch (e) {
      // ignore any issues here, connection will be attempted after login normally
      console.debug('App mounted: could not auto-connect WS', e);
    }
    // attach unload listener in lifecycle to avoid duplicate listeners on HMR
    window.addEventListener('beforeunload', this.__lider_beforeunload__ = (event) => {
      getLiderWs().disconnect();
    });
  },
  unmounted() {
    try {
      if (this.__lider_beforeunload__) {
        window.removeEventListener('beforeunload', this.__lider_beforeunload__);
        this.__lider_beforeunload__ = null;
      }
    } catch (e) {
      // ignore
    }
  },
  data() {
    return {
      exampleLeakyProperty: 'This represents a property that will leak memory if not cleaned up.'
    }
  },
}
// window.addEventListener("beforeunload", function(event) {
//   //strope.getInstance().disconnect();
//   getLiderWs().disconnect();
// });
</script>