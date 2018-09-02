import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import withRoot from './withRoot';
import magnet from 'magnet-uri';
// import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';
import { ForceGraph2D } from 'react-force-graph';
import { prettyBytes } from '../utils';

//TODO show download status
//TODO list files
//TODO handle filetypes in different ways
const client = new WebTorrent();
client.on('error', err => {
  console.error('CLIENT ERROR: ' + err.message);
});

class App extends Component {
  state = {
    magnet:
      'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent',
    progress: 0,
    done: false,
    numPeers: 0,
    downloaded: 0,
    total: 0,
    torrent: {},
    remaining: '',
    downloadSpeed: '0 B/s',
    uploadSpeed: '0 B/s',
    graph: {
      nodes: [{ id: 'me', name: 'me' }],
      links: []
    }
  };

  handleChange = key => event => {
    this.setState({
      ...this.state,
      [key]: event.target.value
    });
  };

  download = () => {
    console.log(magnet(this.state.magnet));
    this.setState({ torrent: magnet(this.state.magnet) });
    client.add(this.state.magnet, torrent => {
      const file = torrent.files.find(file => file.name.endsWith('.mp4'));
      file.appendTo('body');

      var interval = setInterval(() => {
        let remaining;
        if (torrent.done) {
          remaining = 'Done.';
        } else {
          remaining = moment
            .duration(torrent.timeRemaining / 1000, 'seconds')
            .humanize();
          remaining =
            remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.';
        }

        this.setState({
          progress: Math.round(torrent.progress * 100 * 100) / 100,
          numPeers:
            torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers'),
          downloaded: prettyBytes(torrent.downloaded),
          total: prettyBytes(torrent.length),
          remaining,
          downloadSpeed: prettyBytes(torrent.downloadSpeed) + '/s',
          uploadSpeed: prettyBytes(torrent.uploadSpeed) + '/s'
        });
      }, 1000);

      torrent.on('done', () => {
        console.log('Progress: 100%');
        this.setState({ done: true });
        clearInterval(interval);
      });

      torrent.on('wire', (wire, addr) => {
        this.setState(state => ({
          graph: {
            nodes: state.graph.nodes.concat({ id: addr, name: addr }),
            links: state.graph.links.concat({ source: 'me', target: addr })
          }
        }));
      });
    });
  };

  render() {
    const {
      magnet,
      progress,
      done,
      torrent,
      numPeers,
      downloaded,
      total,
      remaining,
      downloadSpeed,
      uploadSpeed
    } = this.state;
    return (
      <div>
        <TextField
          id="full-width"
          label="Magnet link"
          InputLabelProps={{
            shrink: true
          }}
          placeholder="Paste here the magnet lint"
          fullWidth
          margin="normal"
          onChange={this.handleChange('magnet')}
          value={magnet}
        />
        <Button onClick={this.download}>Start downloading</Button>
        <div>
          {`${done ? 'Seeding' : 'Downloading'} ${
            torrent.name
          } from ${numPeers}`}
        </div>
        <div>{` ${downloaded} of ${total} - ${remaining}`}</div>
        <div>{` ↓${downloadSpeed} |  ↑${uploadSpeed}`}</div>
        <LinearProgress variant="determinate" value={progress} />
        <ForceGraph2D graphData={this.state.graph} />
      </div>
    );
  }
}

export default withRoot(App);
