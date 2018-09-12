var WebTorrent = require('webtorrent-hybrid')

var client = new WebTorrent()

const opts = {
  announce: ['ws://0.0.0.0:8000']
};

// var magnetURI = '08ada5a7a6183aae1e09d831df6748d566095a10'
var magnetURI = 'bfc3b783bdacd8d9355612918d6cb01bacde583c'
// var magnetURI = 'magnet:?xt=urn:btih:bfc3b783bdacd8d9355612918d6cb01bacde583c&dn=Phantom.Thread.2017.720p.BRRip.MkvCage.mkv&tr=ws%3A%2F%2Flocalhost%3A8000'
client.add(magnetURI, {path: '/tmp',announce: ['ws://0.0.0.0:8000'] }, function (torrent) {
  console.log('entrou aqui')
  torrent.on('done', function () {
    console.log('torrent download finished')
  })
})