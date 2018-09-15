var Server = require('bittorrent-tracker').Server
var WebTorrent = require('webtorrent-hybrid');

const client = new WebTorrent();
const server = new Server();
const opts = {
  announce: [
    'ws://0.0.0.0:8000',
    'wss://tracker.openwebtorrent.com',
    'wss://tracker.btorrent.xyz'
  ],
  path: './download'
};

server.on('start', (addr, msg) => {
  const { info_hash } = msg;
  if(!client.torrents.find( e => e.infoHash === info_hash)) {
    client.add(info_hash, opts); 
  }
})

server.listen(8000);
