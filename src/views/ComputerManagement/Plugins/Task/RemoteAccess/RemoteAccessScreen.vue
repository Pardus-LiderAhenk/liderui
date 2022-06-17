<template>
  <base-plugin
    :pluginUrl="pluginUrl"
    :pluginDescription="pluginDescription"
    :showTaskDialog="false"
    @close-task-dialog="showTaskDialog = false"
    :pluginTask="task"
    @task-response="remoteAccessResponse"
    :executeTask="executeTask"
  >
  <template #pluginTitleButton>
        <Button label="Yeniden Bağlan" class="p-button-raised  p-button-info" @click="reconnect();" style="margin-right:10px"/>
        <Button label="Bağlantıyı kapat" class="p-button-raised  p-button-danger" @click="closeConnection();"/>
        
      </template>
    <template #pluginTitle>
     <div>
            <ProgressSpinner v-show="!connected"
              style="width: 20px; height: 20px"
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
            {{ title }}
          </div> 
    </template>
    <template #default>
      <div style="height: 90vh">
        <div v-show="!connected" class="infoDiv">
            <div class="p-grid" style="width:50vw">
               
                <div class="p-col-12">
                        <transition-group name="p-message" tag="div">
                            <Message v-for="msg of status_messages" :severity="msg.severity" :key="msg.content"  :closable="false">{{msg.content}}</Message>
                        </transition-group>
                </div>

            </div>
            
        </div>
        <div v-show="connected">
          <div class="viewport" ref="viewport">
            <modal ref="modal" @reconnect="connect(query)" />
            <!-- tabindex allows for div to be focused -->
            <div ref="display" class="display" tabindex="0" />
          </div>
        </div>
      </div>
    </template>
  </base-plugin>
</template>

<script>
import axios from "axios";
import Guacamole from "@ismailbasaran/guacamole-common-js";
import GuacMouse from "./lib/GuacMouse";
import states from "./lib/states";
import clipboard from "./lib/clipboard";
import { mapGetters } from "vuex";


Guacamole.Mouse = GuacMouse.mouse;

const httpUrl = `http://${location.host}/tunnel`;

export default {
  data() {
    return {
      title: "Remote Access",
      task: null,
      showTaskDialog: false,
      pluginUrl:
        "https://docs.liderahenk.org/lider-ahenk-docs/liderv2/computer_management/sistem/uzak_masaustu/",
      pluginDescription: this.$t("computer.plugins.remote_access.description"),
      pluginTask: null,
      remoteAccessState: false,
      status_messages: [
			
		],
      permission: "yes",
      executeTask: false,
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
      connection_info:null,
      selectedProtocol:'vnc',
      tunnel:null,
      connectionData:null,
    };
  },
  computed: {
    ...mapGetters(["remoteConnections"]),
  },
  methods: {
    sendTaskRemoteAccess() {
        this.status_messages.push({severity: 'info', content: "Ahenk'e bağlantı isteği gönderiliyor..."});
        this.task = { ...this.pluginTask };
        this.task.commandId = "SETUP-VNC-SERVER";
        this.task.parameterMap = {
          permission: this.connectionData.permission,
        };
        this.executeTask = true;
        this.status_messages.push({severity: 'success', content: "Bağlantı isteği gönderildi..."});
    },

    reconnect(){
        // this.executeTask = false;
        // //this.clipboard.uninstall();
        // this.client.disconnect();
        // // this.tunnel.disconnect();
        // this.status_messages = [];
        // this.connected = false;
        // this.sendTaskRemoteAccess();

        location.reload();
    },

    async start_connection(){

        
        let data = new FormData();
        if (this.connectionData && this.connectionData.protocol == 'ssh') {
            data.append("protocol", this.connectionData.protocol);
            data.append("port", 22);
            data.append("password", this.connectionData.sshPassword);
            data.append("username", this.connectionData.sshUsername);
        } else {
            data.append("protocol", this.connectionData.protocol);
            data.append("port", this.connection_info.port);
            data.append("password", this.connection_info.password);
            data.append("username", '');
        }

        let checkhostFormdata = new FormData();
        checkhostFormdata.append('host', this.connection_info.host);
        checkhostFormdata.append('port', this.selectedProtocol && this.selectedProtocol == 'ssh' ? 22 : this.connection_info.port);
        const hostResponse = await axios.post('/checkhost',checkhostFormdata);
        this.status_messages.push({severity: 'success', content: "Ahenk erişimi " + hostResponse.data + ' adresinden sağlanacak...'},);
        data.append("host", hostResponse.data);
        const sremoteResponse = await  axios.post('/sendremote', data);

        this.connect();

        if (this.permission == "yes") {
            this.status_messages.push({severity: 'success', content: "Kullanıcıya erişim isteği gönderildi. Cevap bekleniyor... "},);
        }

    },
    remoteAccessResponse(message) {
      
      if (message.commandClsId == "SETUP-VNC-SERVER") {
        let result = JSON.parse(message.result.responseDataStr);
        this.connection_info = result;
        this.status_messages.push({severity: 'info', content: "Bağlantı bilgileri alındı. Erişim kontrol ediliyor..."},);
        this.title = "Remote Access - " + message.commandExecution.uid;
        this.start_connection();
      }
    },
    closeConnection() {
      this.$store.dispatch('removeConnectionInfo', this.connectionData);
      this.client.disconnect();
      this.connected = false;
      window.close();
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
      const elm = this.$refs.viewport;
      if (!elm || !elm.offsetWidth) {
        // resize is being called on the hidden window
        return;
      }

      let pixelDensity = window.devicePixelRatio || 1;
      const width = elm.clientWidth * pixelDensity;
      const height = elm.clientHeight * pixelDensity;
      if (
        this.display.getWidth() !== width ||
        this.display.getHeight() !== height
      ) {
        this.client.sendSize(width, height);
      }
      // setting timeout so display has time to get the correct size
      setTimeout(() => {
        const scale =
          Math.min(
            elm.clientWidth / Math.max(this.display.getWidth(), 1),
            elm.clientHeight / Math.max(this.display.getHeight(), 1)
          ) || 1;
        this.display.scale(scale);
      }, 100);
    },
    connect() {
      let params = {
        Authorization: "Bearer " + localStorage.getItem("auth_token"),
      };

      this.tunnel = new Guacamole.HTTPTunnel(httpUrl, true, params);

      if (this.client) {
        this.display.scale(0);
        this.uninstallKeyboard();
      }

      this.client = new Guacamole.Client(this.tunnel);
      clipboard.install(this.client);

      this.tunnel.onerror = (status) => {
        // eslint-disable-next-line no-console
        console.error(`Tunnel failed ${JSON.stringify(status)}`);
        this.connectionState = states.TUNNEL_ERROR;
      };

      this.tunnel.onstatechange = (state) => {
        switch (state) {
          // Connection is being established
          case Guacamole.Tunnel.State.CONNECTING:
            this.connectionState = states.CONNECTING;
            break;

          // Connection is established / no longer unstable
          case Guacamole.Tunnel.State.OPEN:
            this.connectionState = states.CONNECTED;
            break;

          // Connection is established but misbehaving
          case Guacamole.Tunnel.State.UNSTABLE:
            // TODO
            break;

          // Connection has closed
          case Guacamole.Tunnel.State.CLOSED:
            this.connectionState = states.DISCONNECTED;
            this.status_messages.push({severity: 'warning', content: "Kullanıcının izin vermesi bekleniyor..."},);
            break;
        }
      };

      this.client.onstatechange = (clientState) => {
        switch (clientState) {
          case 0:
            this.connectionState = states.IDLE;
            break;
          case 1:
            // connecting ignored for some reason?
            break;
          case 2:
            this.connectionState = states.WAITING;
            this.status = "Kullanıcının izin vermesi bekleniyor";
            //this.connected = false;
            break;
          case 3:
            this.connectionState = states.CONNECTED;
            this.connected = true;
            window.addEventListener("resize", this.resize);
            this.resize();
            this.$refs.viewport.addEventListener("mouseenter", this.resize);

            clipboard.setRemoteClipboard(this.client);
            this.status = "";
            

          // eslint-disable-next-line no-fallthrough
          case 4:
          case 5:
            // disconnected, disconnecting
            this.status =
              "Kullanıcı Oturum Açmamış. \n Bağlantı kurabilmek için lütfen kullanıcıdan oturum açmasını isteyiniz.";
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

    this.remoteConnections.map(item => {
      if (item.uid == this.$route.query.uid && (item.protocol == this.$route.query.protocol)) {
        this.connectionData = item;
      }
    });

    
    axios.post("/getPluginTaskList", {}).then((response) => {
      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        if (element.page == "remote-access") {
          this.pluginTask = element;
          this.remoteAccessState = element.state;

          this.sendTaskRemoteAccess();
        }
      }
    });
  },
  unmounted() {
      this.$store.dispatch('removeConnectionInfo', this.connectionData);
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
  width: 100%;
  height: 100vh;
  display: flex;
}
</style>
