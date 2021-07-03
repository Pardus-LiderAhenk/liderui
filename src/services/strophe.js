require('@ismailbasaran/vuestrophejs');

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
		console.log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
		console.log('Strophe failed to connect.');
    } else if (status == Strophe.Status.DISCONNECTING) {
		console.log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
		console.log('Strophe is disconnected.');
    } else if (status == Strophe.Status.CONNECTED) {
		console.log('Strophe is connected.');
	connection.disconnect();
    }
}


const connection = new Strophe.Connection("http://192.168.122.138:5280/bosh");

connection.connect('lider','123', onConnect);


module.exports = connection;