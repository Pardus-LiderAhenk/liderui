require('@ismailbasaran/vuestrophejs');
import axios from 'axios';
import store from '../store/store';
import router from '../router';

class XmppClinet {

  constructor() {
    this.connection;
    this.isXmppConnected = false;
    this.observers = [];
  }

  addListener = (key, callback) =>  {
    this.observers.push({key: key, callback: callback});
  }

  removeListener = (key) => {
    this.observers = this.observers.filter( (val) => val.key != key);
  }

  sendToObservers = (msg) => {
    this.observers.map( ( observer ) => {
      observer.callback(msg);
    });
  }


  connect () {
    axios
    .post(process.env.VUE_APP_URL + "/api/messaging/get-messaging-server-info", { })
    .then(
      (response) => {
        this.connection = new Strophe.Connection(
          response.data[1].xmppBoshAddress
      );
      this.connection.attach(
        response.data[0].jid,
        response.data[0].sid,
        response.data[0].rid,
        this.onConnect
      );
      },
      (error) => {
        console.log(error);
      }
    );
  }


  onMessage = (msg) => {
    var to = msg.getAttribute("to");
    var from = msg.getAttribute("from");
    var type = msg.getAttribute("type");
    var elems = msg.getElementsByTagName("body");

    if (type == "chat" && elems.length > 0) {
      var body = elems[0];
      var data = Strophe.xmlunescape(Strophe.getText(body));
      var response = JSON.parse(data);
      var type = "INFO";
      var dnParser = response.commandExecution.dn.split(",");
      var agentCn = dnParser[0].replace("cn=", "");
      if (response.result.responseCode == "TASK_ERROR") {
        type = "ERROR";
      }
      // console.log(
      //   "[" + agentCn + "] Gelen Cevap : " + response.result.responseMessage,
      //   type
      // );
      var reply = $msg({ to: from, from: to, type: "chat" }).cnode(
        Strophe.copyElement(body)
      );
      this.connection.send(reply.tree());

      // if (store.getters.selectedLiderNode.distinguishedName == response.commandExecution.dn) {
      //   store.commit("addSelectedAgentMessage",response);
      // }

    }

    this.sendToObservers(msg);
    return true;
  }


  onConnect = (status) => {
    if (status == Strophe.Status.CONNECTING) {
      console.log('STROPE CONNECTING');
    } else if (status == Strophe.Status.CONNFAIL) {
      this.isXmppConnected = false;
      console.log("Conn Fail");
      store.dispatch("logout").then(() => router.push('/login')).catch(err => console.log(err))
    } else if (status == Strophe.Status.DISCONNECTING) {
      this.isXmppConnected = false;
      console.log("Disconnecting");
    } else if (status == Strophe.Status.DISCONNECTED) {
      this.isXmppConnected = false;
    } else if (status == Strophe.Status.CONNECTED) {
      console.log('STROPE CONNECTED');
       this.connection.addHandler(this.onMessage, null, 'message', null, null,  null); 
      var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
      this.connection.sendIQ(iq, this.onRoster);
      this.connection.addHandler(this.onRosterChanged, "jabber:iq:roster", "iq", "set");
      this.connection.send($pres().tree()); 
      this.isXmppConnected = true;
    } else if (status == Strophe.Status.ERROR) {
      console.log("Error");
    } else if (status == Strophe.Status.ATTACHED) {
      // console.log("Attached succesfully to connection");
      this.isXmppConnected = true;
      
      
      this.connection.addHandler(
        this.onMessage,
        null,
        "message",
        null,
        null,
        null
      );
      var iq = $iq({ type: "get" }).c("query", { xmlns: "jabber:iq:roster" });
      this.connection.sendIQ(iq, this.onRoster);
      this.connection.addHandler(
            this.onRosterChanged,
        "jabber:iq:roster",
        "iq",
        "set"
      );
      this.connection.send($pres().tree());
    } else {
      store.dispatch("logout").then(() => router.push('/login')).catch(err => console.log(err))
    }
  
    return this.isXmppConnected;
  }
  
  onRoster = (iq) => {
    // $(iq)
    //   .find("item")
    //   .each(function () {
    //     var jid = $(this).attr("jid");
    //     var name = $(this).attr("name") || jid;

    //     // transform jid into an id
    //     var jid_id = jid_to_id(jid);
    //   });

    this.connection.addHandler(this.onPresence, null, "presence");
    this.connection.send($pres().tree());
  }

  onRosterChanged(iq) {
    $(iq).find('item').each(function () {
        var sub = $(this).attr('subscription');
        var jid = $(this).attr('jid');
        var name = $(this).attr('name') || jid;
        var jid_id =jid_to_id(jid);
    });
    return true;
  }

  onPresence(presence){
    //console.log(presence)
    // var ptype = $(presence).attr('type');
    // var from = $(presence).attr('from');
    // var jid_id = jid_to_id(from);
    // var name = jid_to_name(from);
    // var source = jid_to_source(from);
    
    // if (ptype === 'subscribe') {

    //     console.log("subscribe","warn");

    // } else if (ptype !== 'error') {
    //     if (ptype === 'unavailable') {
    //         console.log(name+" çevrimdışı oldu.","ERROR");
    //     } else {
    //         console.log(name+" çevrimiçi oldu.","SUCCESS");
    //     }
    // }
    return true;
  }

  disconnect(){
    this.connection.disconnect();
    
  }
  
  isConnected = () => {
    return this.isXmppConnected;
  }

}

var XmppClientManager = (function(){
  var instance;
  return {
      getInstance: function(){
          if (instance == null) {
              instance = new XmppClinet();
          }
          return instance;
      }
 };
})();

export default XmppClientManager;