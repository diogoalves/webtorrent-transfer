import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import withRoot from './withRoot';
import magnet from 'magnet-uri';
// import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const client = new WebTorrent();
client.on('error', err => {
  console.error('CLIENT ERROR: ' + err.message);
});

class App extends Component {
  state = {
    magnet:
      'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent',
    progress: 0
  };

  handleChange = key => event => {
    this.setState({
      ...this.state,
      [key]: event.target.value
    });
  };

  download = () => {
    console.log(magnet(this.state.magnet));

    client.add(this.state.magnet, torrent => {
      const file = torrent.files.find(file => file.name.endsWith('.mp4'));
      file.appendTo('body');

      var interval = setInterval(
        () => this.setState({ progress: torrent.progress * 100 }),
        1000
      );

      torrent.on('done', () => {
        console.log('Progress: 100%');
        clearInterval(interval);
      });

      torrent.on('done', () => {
        console.log('torrent download finished');
      });
    });
  };

  render() {
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
          value={this.state.magnet}
        />
        <Button onClick={this.download}>Start downloading</Button>
        <LinearProgress variant="determinate" value={this.state.progress} />
      </div>
    );
  }
}

export default withRoot(App);
