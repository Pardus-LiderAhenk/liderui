import  '@ismailbasaran/vuestrophejs';
import store from '../store/store';

var connection =null
var isXmppConnected=false

function loginToMessagingService(loginParams)
{
    connection = new Strophe.Connection(
        loginParams.data[1].xmppBoshAddress
    );
    connection.attach(
        loginParams.data[0].jid,
        loginParams.data[0].sid,
        loginParams.data[0].rid,
        onConnect
    );
}

function onMessage(msg) {
    var to = msg.getAttribute("to");
    var from = msg.getAttribute("from");
    var type = msg.getAttribute("type");
    var elems = msg.getElementsByTagName("body");

    if (type == "chat" && elems.length > 0) {
      var body = elems[0];
      var data = Strophe.xmlunescape(Strophe.getText(body));
      console.log(data)
      var response = JSON.parse(data);
      var type = "INFO";
      var dnParser = response.commandExecution.dn.split(",");
      var agentCn = dnParser[0].replace("cn=", "");
      if (response.result.responseCode == "TASK_ERROR") {
        type = "ERROR";
      }
      console.log(
        "[" + agentCn + "] Gelen Cevap : " + response.result.responseMessage,
        type
      );
      var reply = $msg({ to: from, from: to, type: "chat" }).cnode(
        Strophe.copyElement(body)
      );
      connection.send(reply.tree());
    }
    return true;
  }

  function onConnect(status) {
    if (status == Strophe.Status.CONNECTING) {
    } else if (status == Strophe.Status.CONNFAIL) {
      isXmppConnected = false;
      console.log("Conn Fail");
    } else if (status == Strophe.Status.DISCONNECTING) {
         isXmppConnected = false;
      console.log("Disconnecting");
    } else if (status == Strophe.Status.DISCONNECTED) {
      isXmppConnected = false;
      console.log("Disconnected");
      store.dispatch("logout");
      console.log('Kapadım aslında')
    } else if (status == Strophe.Status.CONNECTED) {
       connection.addHandler(onMessage, null, 'message', null, null,  null); 
      var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
      connection.sendIQ(iq, onRoster);
      connection.addHandler(onRosterChanged, "jabber:iq:roster", "iq", "set");
      connection.send($pres().tree()); 
      isXmppConnected = true;
    } else if (status == Strophe.Status.ERROR) {
      console.log("Error");
    } else if (status == Strophe.Status.ATTACHED) {
      console.log("Attached succesfully to connection");
      isXmppConnected = true;
      
      document.getElementById("xmppStatus").innerHTML = "Hello World";
      connection.addHandler(
        onMessage,
        null,
        "message",
        null,
        null,
        null
      );
      var iq = $iq({ type: "get" }).c("query", { xmlns: "jabber:iq:roster" });
      connection.sendIQ(iq, onRoster);
      connection.addHandler(
            onRosterChanged,
        "jabber:iq:roster",
        "iq",
        "set"
      );
      connection.send($pres().tree());
    } else {
      console.log("Sunucuya ulaşılamıyor.", "ERROR");
    }

    return isXmppConnected;
  }

  function onRoster(iq) {
      console.log("on roster")
      console.log(iq)
    // $(iq)
    //   .find("item")
    //   .each(function () {
    //     var jid = $(this).attr("jid");
    //     var name = $(this).attr("name") || jid;

    //     // transform jid into an id
    //     var jid_id = jid_to_id(jid);
    //   });

    connection.addHandler(onPresence, null, "presence");
    connection.send($pres().tree());
  }

  function onRosterChanged(iq) {
       console.log("on roster changed")
      $(iq).find('item').each(function () {
          var sub = $(this).attr('subscription');
          var jid = $(this).attr('jid');
          var name = $(this).attr('name') || jid;
          var jid_id =jid_to_id(jid);
          
          console.log("Lider MYS yeni kayıt yapılıyor. Kayıt Ad : "+ name,"success");
      });
      return true;

  }

  function onPresence(presence){
      console.log(presence)
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

  function disconnect(){
    connection.disconnect();
  }

  function isConnected(){
    return isXmppConnected;
  }

  export default {
	loginToMessagingService,
	onMessage,
	onConnect,
	onRoster,
	onRosterChanged,
  onPresence,
  disconnect,
  isConnected
}