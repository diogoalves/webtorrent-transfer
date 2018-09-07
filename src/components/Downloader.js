import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
// import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
// import { ForceGraph2D } from 'react-force-graph';
// import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { prettyBytes } from '../utils';
import DownloadStatus from './DownloadStatus';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';

//TODO show download status
//TODO list files
//TODO handle filetypes in different ways
const client = new WebTorrent();
client.on('error', err => {
  console.error('CLIENT ERROR: ' + err.message);
});

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  }
});

class App extends Component {
  state = {
    tabValue: 0,
    torrent: { files: [] },
    status: null,
    progress: 0,
    done: false,
    numPeers: 0,
    downloaded: 0,
    total: 0,
    remaining: '',
    downloadSpeed: '0 B/s',
    uploadSpeed: '0 B/s',
    graph: {
      nodes: [{ id: 'me', name: 'me' }],
      links: []
    }
  };

  componentDidMount() {
    const {
      match: {
        params: { infoHash }
      }
    } = this.props;
    // const infoHash = '08ada5a7a6183aae1e09d831df6748d566095a10';
    //magnet:?xt=urn:btih:1a5d7f2155a2342deabedb088a837b8060049658&dn=Screen+Shot+2018-08-21+at+23.18.14.png&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com
    //magnet:?xt=urn:btih:1a5d7f2155a2342deabedb088a837b8060049658&dn=Screen+Shot+2018-08-21+at+23.18.14.png&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com
    const opts = {
      announce: [
        'wss://tracker.openwebtorrent.com',
        'wss://tracker.btorrent.xyz'
      ]
    };
    console.log(infoHash);
    client.add(infoHash, opts, torrent => {
      this.setState({ torrent, files: torrent.files });
      // const file = torrent.files.find(file => file.name.endsWith('.mp4'));
      // file.appendTo('body');
      //torrent.files.map(file => file.appendTo('body'));
      console.log(torrent);
      setInterval(() => {
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
          status: {
            progress: Math.round(torrent.progress * 100 * 100) / 100,
            numPeers:
              torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers'),
            downloaded: prettyBytes(torrent.downloaded),
            total: prettyBytes(torrent.length),
            remaining,
            downloadSpeed: prettyBytes(torrent.downloadSpeed) + '/s',
            uploadSpeed: prettyBytes(torrent.uploadSpeed) + '/s'
          }
        });
      }, 1000);

      torrent.on('done', () => {
        console.log('Progress: 100%');
        this.setState({
          done: true
        });
        // clearInterval(interval);
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

  handleTabChange = (event, tabValue) => {
    this.setState({ tabValue });
  };

  render() {
    const { files = [], tabValue, status } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <DownloadStatus status={status} />
          </Grid>
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={this.handleTabChange} fullWidth>
              <Tab label="Files" />
              <Tab label="Details" />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <List dense>
              {files.map(f => (
                <ListI
                  key={f.name}
                  fileName={f.name}
                  size={prettyBytes(f.length)}
                />
              ))}
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);

const ListI = ({ fileName, size }) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar>
        <FolderIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText primary={fileName} secondary={size} />
    <ListItemSecondaryAction>
      <IconButton aria-label="Delete">
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);
