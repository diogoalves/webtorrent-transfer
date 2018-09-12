var Server = require('bittorrent-tracker').Server
var WebTorrent = require('webtorrent');
var client = new WebTorrent();

const opts = {
  announce: [
    'ws://0.0.0.0:8000'
  ]
};

var server = new Server({
  udp: true, // enable udp server? [default=true]
  http: true, // enable http server? [default=true]
  ws: true, // enable websocket server? [default=true]
  stats: true, // enable web-based statistics? [default=true]
})

// Internal http, udp, and websocket servers exposed as public properties.
// server.http
// server.udp
// server.ws

server.on('error', function (err) {
  // fatal server error!
  console.log(err.message)
})

server.on('warning', function (err) {
  // client sent bad data. probably not a problem, just a buggy client.
  console.log(err.message)
})

server.on('listening', function () {
  // fired when all requested servers are listening
  console.log('listening on http port:' + server.http.address().port)
  console.log('listening on udp port:' + server.udp.address().port)
})

// start tracker server listening! Use 0 to listen on a random free port.
// server.listen(8000, hostname, onlistening)


server.listen(8000, '0.0.0.0')

// listen for individual tracker messages from peers:

server.on('start', function (addr, {info_hash}) {
  console.log('got start message from ' + addr + " " + info_hash)
  client.add(info_hash, { path: '/tmp' }, (torrent) => {
    console.log('Tracker will download:', torrent.infoHash)
  })

})

server.on('complete', function (addr) {
  console.log('got complete message from ' + addr)
})

server.on('update', function (addr) {
  console.log('got update message from ' + addr)
})

server.on('stop', function (addr) {
  console.log('got stop message from ' + addr)
})

// server.on('complete', function (addr) {})
// server.on('update', function (addr) {})
// server.on('stop', function (addr) {})

// // get info hashes for all torrents in the tracker server
// Object.keys(server.torrents)

// // get the number of seeders for a particular torrent
// server.torrents[infoHash].complete

// // get the number of leechers for a particular torrent
// server.torrents[infoHash].incomplete

// // get the peers who are in a particular torrent swarm
// server.torrents[infoHash].peers