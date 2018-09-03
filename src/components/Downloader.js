import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import withRoot from './withRoot';
// import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';
// import { ForceGraph2D } from 'react-force-graph';
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

  componentDidMount() {
    //const { match: { params: { infoHash } } } = this.props;
    const infoHash = '08ada5a7a6183aae1e09d831df6748d566095a10';
    const opts = {
      announce: [
        'wss://tracker.openwebtorrent.com',
        'wss://tracker.btorrent.xyz'
      ]
    };
    console.log(`Downloading ${infoHash}`);
    client.add(infoHash, opts, torrent => {
      console.log(`Torrent voltou ${infoHash}`);

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
  }

  render() {
    const {
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
        <div>
          {`${done ? 'Seeding' : 'Downloading'} ${
            torrent.name
          } from ${numPeers}`}
        </div>
        <div>{` ${downloaded} of ${total} - ${remaining}`}</div>
        <div>{` ↓${downloadSpeed} |  ↑${uploadSpeed}`}</div>
        <LinearProgress variant="determinate" value={progress} />
        {/* <ForceGraph2D graphData={this.state.graph} /> */}
      </div>
    );
  }
}

export default withRoot(App);
