var Server = require('bittorrent-tracker').Server
var WebTorrent = require('webtorrent');
const delay = require('delay');


var client = new WebTorrent();

const opts = {
  announce: [
    'ws://0.0.0.0:8000'
  ]
};

const myList = [];

const download = magnetURI => {
  console.log('called download of ' + magnetURI) 
  // var magnetURI = '08ada5a7a6183aae1e09d831df6748d566095a10'
  // var magnetURI = 'bfc3b783bdacd8d9355612918d6cb01bacde583c'
  // var magnetURI = 'magnet:?xt=urn:btih:bfc3b783bdacd8d9355612918d6cb01bacde583c&dn=Phantom.Thread.2017.720p.BRRip.MkvCage.mkv&tr=ws%3A%2F%2Flocalhost%3A8000'
  // client.add(magnetURI, {path: '/tmp',announce: ['ws://0.0.0.0:8000'] }, function (torrent) {
  client.add(magnetURI, {path: '/tmp',announce: ['ws://ed7cb053.ngrok.io']}, (torrent) => {
    console.log('entrou aqui')
    torrent.on('download', bytes => console.log('download a bit ' + bytes));
    torrent.on('upload', () => console.log('upload a bit'));
    torrent.on('done', () => console.log('torrent download finished'));
    torrent.on('error', err => console.log('torrent ERROR ' + err));
    torrent.on('warning', err => console.log('torrent warning ' + err));
    torrent.on('infoHash', () => console.log(' info hash of the torrent has been determined'));
    torrent.on('metadata', () => console.log('metadata of the torrent has been determined'));
    torrent.on('ready', () => console.log('ready'));
    torrent.on('wire', () => console.log('wire'));
    torrent.on('noPeers', announceType => console.log('noPeers ' + announceType));
  })
}

const server = new Server();
server.on('error', (err) => console.log('error: ' + err.message));
server.on('warning', (err) => console.log('warning: ' + err.message))
server.on('listening', () => console.log('listening on http port:' + server.http.address().port + ' and on udp port:' + server.udp.address().port))
server.on('complete', addr => console.log('got complete message from ' + addr))
server.on('update', addr => console.log('got update message from ' + addr))
server.on('stop', addr => console.log('got stop message from ' + addr))
server.on('start', (addr, msg) => {
  const { info_hash } = msg;
  console.log('got start message from ' + addr + " " + info_hash)
  setTimeout(download, 5000, info_hash);
})

server.listen(8000)

// (async () => {
//   bar();

//   await delay(100);

//   // Executed 100 milliseconds later
//   baz();
// })();

// // get info hashes for all torrents in the tracker server
// Object.keys(server.torrents)
// // get the number of seeders for a particular torrent
// server.torrents[infoHash].complete
// // get the number of leechers for a particular torrent
// server.torrents[infoHash].incomplete
// // get the peers who are in a particular torrent swarm
// server.torrents[infoHash].peers