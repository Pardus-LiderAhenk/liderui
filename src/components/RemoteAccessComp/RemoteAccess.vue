<template>
  <div>
    
    <div v-show="!isconnected" class="infoDiv">
     <div>
       
       <ProgressSpinner style="width:50px;height:50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/>
     </div>
      <p>{{status}}</p>
    </div>
    <div v-show="isconnected">
      <div>
          <Toolbar>
          <template #start>
              
          </template>

          <template #end>
            <Button v-if="!connected" icon="pi pi-times" class="p-button-primary" :label="$t('computer.plugins.remote_access.reconnect')" @click="connect()"/>
            <Button icon="pi pi-times" class="p-button-danger" :label="$t('computer.plugins.remote_access.close_connection')" @click="closeConnection()"/>
          </template>
        </Toolbar>
      </div>
    
      <div class="viewport" ref="viewport">
        <modal ref="modal" @reconnect="connect(query)" />
        <!-- tabindex allows for div to be focused -->
        <div ref="display" class="display" tabindex="0" />
      </div>
  </div>
  </div>
</template>

<script>
import Guacamole from "@ismailbasaran/guacamole-common-js";
import GuacMouse from "./lib/GuacMouse";
import states from "./lib/states";
import clipboard from "./lib/clipboard";
import Modal from "./lib/Modal";


Guacamole.Mouse = GuacMouse.mouse;

const httpUrl = `http://${location.host}/tunnel`;

export default {
  components: {
    Modal,
  },
  props: {
    forceHttp: {
      type: Boolean,
      required: false,
      default: false,
    },
    showRemoteModal: {
      type: Boolean,
      required: true,
      default: false,
    },
    watchVl: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      connected: false,
      display: null,
      currentAdjustedHeight: null,
      client: null,
      keyboard: null,
      mouse: null,
      lastEvent: null,
      connectionState: states.IDLE,
      errorMessage: "",
      arguments: {},
      status:'',
      isconnected: false
    };
  },
  watch: {
    // connectionState(state) {
    //   this.$refs.modal.show(state, this.errorMessage)
    // },
    disconnected: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.connected = false;
          this.client.disconnect();
        }
      },
    },
  },
  methods: {
    closeConnection() {
      this.client.disconnect();
      window.close()
    },
    send(cmd) {
      if (!this.client) {
        return;
      }
      for (const c of cmd.data) {
        this.client.sendKeyEvent(1, c.charCodeAt(0));
      }
    },
    copy(cmd) {
      if (!this.client) {
        return;
      }
      clipboard.cache = {
        type: "text/plain",
        data: cmd.data,
      };
      clipboard.setRemoteClipboard(this.client);
    },
    handleMouseState(mouseState) {
      const scaledMouseState = Object.assign({}, mouseState, {
        x: mouseState.x / this.display.getScale(),
        y: mouseState.y / this.display.getScale(),
      });
      this.client.sendMouseState(scaledMouseState);
    },
    resize() {
      console.log('Resize cagrildi');
      const elm = this.$refs.viewport;
      console.log('Viewport elem aldım', elm);
      if (!elm || !elm.offsetWidth) {
        // resize is being called on the hidden window
        console.log('resize 1');
        return;
      }

      let pixelDensity = window.devicePixelRatio || 1;
      console.log('pixcel destiny ',pixelDensity);
      const width = elm.clientWidth * pixelDensity;
      const height = elm.clientHeight * pixelDensity;
      console.log('Gelen Width ve height', width,height);
      if (
        this.display.getWidth() !== width ||
        this.display.getHeight() !== height
      ) {
        this.client.sendSize(width, height);
      }
      // setting timeout so display has time to get the correct size
      setTimeout(() => {
        const scale = Math.min(
          elm.clientWidth / Math.max(this.display.getWidth(), 1),
          elm.clientHeight / Math.max(this.display.getHeight(), 1)
        ) || 1;
        this.display.scale(scale);
        console.log('resize 2', scale);
      }, 100);
    },
    connect() {
      let params = {
        Authorization: "Bearer " + localStorage.getItem("auth_token"),
      };

      let tunnel = new Guacamole.HTTPTunnel(httpUrl, true, params);

      if (this.client) {
        this.display.scale(0);
        this.uninstallKeyboard();
      }

      this.client = new Guacamole.Client(tunnel);
      clipboard.install(this.client);

      tunnel.onerror = (status) => {
        // eslint-disable-next-line no-console
        console.error(`Tunnel failed ${JSON.stringify(status)}`);
        this.connectionState = states.TUNNEL_ERROR;
      };

      tunnel.onstatechange = (state) => {
        switch (state) {
          // Connection is being established
          case Guacamole.Tunnel.State.CONNECTING:
            this.connectionState = states.CONNECTING;
            console.log('state 1')
            break;

          // Connection is established / no longer unstable
          case Guacamole.Tunnel.State.OPEN:
            this.connectionState = states.CONNECTED;
            console.log('state 2')
            break;

          // Connection is established but misbehaving
          case Guacamole.Tunnel.State.UNSTABLE:
            console.log('state 3')
            // TODO
            break;

          // Connection has closed
          case Guacamole.Tunnel.State.CLOSED:
            this.connectionState = states.DISCONNECTED;
            console.log('state 4');
            this.status = $t('computer.plugins.remote_access.user_denied');
            break;
        }
      };

      this.client.onstatechange = (clientState) => {
        switch (clientState) {
          case 0:
            this.connectionState = states.IDLE;
            console.log('state 5')
            break;
          case 1:
            // connecting ignored for some reason?
            console.log('state 6')
            break;
          case 2:
            this.connectionState = states.WAITING;
            console.log('state 7');
            this.status = $t('computer.plugins.remote_access.waiting_for_the_user_to_give_permission');
            this.isconnected = false;
            break;
          case 3:
            this.connectionState = states.CONNECTED;
            console.log('state 8')
            window.addEventListener("resize", this.resize);
            this.resize();
            this.$refs.viewport.addEventListener("mouseenter", this.resize);

            clipboard.setRemoteClipboard(this.client);
            this.status = '';
            this.isconnected = true;

          // eslint-disable-next-line no-fallthrough
          case 4:
            console.log('state 9')
          case 5:
            // disconnected, disconnecting
            console.log('state 10')
            this.status = $t('computer.plugins.remote_access.not_logged_user_message');
            break;
        }
      };

      this.client.onerror = (error) => {
        this.client.disconnect();
        // eslint-disable-next-line no-console
        console.error(`Client error ${JSON.stringify(error)}`);
        this.errorMessage = error.message;
        this.connectionState = states.CLIENT_ERROR;
      };

      this.client.onsync = () => {};

      // Test for argument mutability whenever an argument value is received
      this.client.onargv = (stream, mimetype, name) => {
        if (mimetype !== "text/plain") return;

        const reader = new Guacamole.StringReader(stream);

        // Assemble received data into a single string
        let value = "";
        reader.ontext = (text) => {
          value += text;
        };

        // Test mutability once stream is finished, storing the current value for the argument only if it is mutable
        reader.onend = () => {
          const stream = this.client.createArgumentValueStream(
            "text/plain",
            name
          );
          stream.onack = (status) => {
            if (status.isError()) {
              // ignore reject
              return;
            }
            this.arguments[name] = value;
          };
        };
      };

      if (!this.$refs.display) {
        return;
      }

      this.client.onclipboard = clipboard.onClipboard;
      this.display = this.client.getDisplay();
      const displayElm = this.$refs.display;
      displayElm.appendChild(this.display.getElement());
      displayElm.addEventListener("contextmenu", (e) => {
        e.stopPropagation();
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.returnValue = false;
      });
      this.client.connect();
      window.onunload = () => this.client.disconnect();

      this.mouse = new Guacamole.Mouse(displayElm);
      // Hide software cursor when mouse leaves display
      this.mouse.onmouseout = () => {
        if (!this.display) return;
        this.display.showCursor(false);
      };

      // allows focusing on the display div so that keyboard doesn't always go to session
      displayElm.onclick = () => {
        displayElm.focus();
      };
      displayElm.onfocus = () => {
        displayElm.className = "focus";
      };
      displayElm.onblur = () => {
        displayElm.className = "";
      };

      this.keyboard = new Guacamole.Keyboard(displayElm);
      this.installKeyboard();
      this.mouse.onmousedown =
        this.mouse.onmouseup =
        this.mouse.onmousemove =
          this.handleMouseState;
      setTimeout(() => {
        this.resize();
        //displayElm.focus();
      }, 1000); // $nextTick wasn't enough
    },
    installKeyboard() {
      this.keyboard.onkeydown = (keysym) => {
        this.client.sendKeyEvent(1, keysym);
      };
      this.keyboard.onkeyup = (keysym) => {
        this.client.sendKeyEvent(0, keysym);
      };
    },
    uninstallKeyboard() {
      this.keyboard.onkeydown = this.keyboard.onkeyup = () => {};
    },
  },
  mounted() {
    console.log('Store user', this.$store.getters.getUser);
    this.connected = true;
    this.connect();
  },
};
</script>

<style scoped>
.display {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.viewport {
  position: relative;
  width: 100%;
  height: 100%;
}

.infoDiv {
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  display:flex;
  vertical-align: middle;
  
}
</style>
