import Guacamole from "@ismailbasaran/guacamole-common-js";

const clipboard = {}

clipboard.install = (client) => {
  try{
    clipboard.getLocalClipboard().then(data => clipboard.cache = data)
  } catch(error) {
    console.log('Clipboard get local error:',error);
  }
  

  window.addEventListener('load', clipboard.update(client), true)
  window.addEventListener('copy', clipboard.update(client))
  window.addEventListener('cut', clipboard.update(client))
  window.addEventListener('focus', e => {
    if (e.target === window) {
      clipboard.update(client)()
    }
  }, true)
}

clipboard.update = client => {
  return () => {
    try{
      clipboard.getLocalClipboard().then(data => {
        clipboard.cache = data
        clipboard.setRemoteClipboard(client)
      })
    } catch(error) {
      console.log('Clipboard get local error:',error);
    }
    
    
  }
}

clipboard.setRemoteClipboard = (client) => {
  if (!clipboard.cache) {
    return
  }

  let writer

  const stream = client.createClipboardStream(clipboard.cache.type)

  if (typeof clipboard.cache.data === 'string') {
    writer = new Guacamole.StringWriter(stream)
    writer.sendText(clipboard.cache.data)
    writer.sendEnd()
  } else {
    writer = new Guacamole.BlobWriter(stream)
    writer.oncomplete = function clipboardSent() {
      writer.sendEnd()
    };
    writer.sendBlob(clipboard.cache.data)
  }
}

clipboard.getLocalClipboard = async () => {
  if (navigator.clipboard && navigator.clipboard.readText) {
    const text = await navigator.clipboard.readText()
    return {
      type: 'text/plain',
      data: text
    }
  }
}

clipboard.setLocalClipboard = async (data) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    if (data.type === 'text/plain') {
      await navigator.clipboard.writeText(data.data)
    }
  }
}

clipboard.onClipboard = (stream, mimetype) => {
  let reader

  if (/^text\//.exec(mimetype)) {
    reader = new Guacamole.StringReader(stream);

    // Assemble received data into a single string
    let data = '';
    reader.ontext = text => {
      data += text;
    }

    // Set clipboard contents once stream is finished
    reader.onend = () => {
      clipboard.setLocalClipboard({
        type: mimetype,
        data: data
      })
    }
  } else {
    reader = new Guacamole.BlobReader(stream, mimetype);
    reader.onend = () => {
      clipboard.setLocalClipboard({
        type: mimetype,
        data: reader.getBlob()
      })
    }
  }
}

clipboard.uninstall = () => {
  clipboard.destroy();
  navigator.clipboard.destroy();
}

export default clipboard
