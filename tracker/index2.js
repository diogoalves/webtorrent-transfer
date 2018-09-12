var WebTorrent = require('webtorrent')

var client = new WebTorrent()

const opts = {
  announce: [
    'ws://0.0.0.0:8000'
  ]
};

var magnetURI = '8ea8a621eeac5e460fc1a51c31ea3746439c4ff4'

client.add(magnetURI, {...opts,  path: '/tmp' }, function (torrent) {
  torrent.on('done', function () {
    console.log('torrent download finished')
  })
})