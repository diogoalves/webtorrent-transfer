import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import { prettyBytes } from '../utils';
import DownloadFileItem from './DownloadFileItem';
import DownloadStatus from './DownloadStatus';

const client = new WebTorrent();

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  }
});

class App extends Component {
  state = {
    tabValue: 0,
    status: null,
    files: [],
    downloadLinks: []
  };

  componentDidMount() {
    const {
      match: {
        params: { infoHash }
      }
    } = this.props;
    const opts = {
      announce: [
        'wss://tracker.openwebtorrent.com',
        'wss://tracker.btorrent.xyz'
      ]
    };
    client.add(infoHash, opts, torrent => {
      this.setState({
        torrent,
        files: torrent.files,
        status: {
          total: prettyBytes(torrent.length),
          name: torrent.name
        }
      });

      torrent.on('download', () => {
        const progress = Math.round(torrent.progress * 100 * 100) / 100;
        document.title = `${progress}%`;
        let remaining;
        if (torrent.done) {
          remaining = 'Done';
        } else {
          remaining = moment
            .duration(torrent.timeRemaining / 1000, 'seconds')
            .humanize();
          remaining =
            remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.';
        }

        this.setState({
          status: {
            progress,
            numPeers:
              torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers'),
            downloaded: prettyBytes(torrent.downloaded),
            remaining,
            downloadSpeed: prettyBytes(torrent.downloadSpeed) + '/s',
            uploadSpeed: prettyBytes(torrent.uploadSpeed) + '/s',
            done: torrent.done,
            total: prettyBytes(torrent.length),
            name: torrent.name
          }
        });
      });

      torrent.on('done', () => {
        torrent.files.map((f, i) =>
          f.getBlobURL((err, url) => {
            this.setState(state => {
              const downloadLinks = state.downloadLinks;
              downloadLinks[i] = url;
              return { downloadLinks };
            });
          })
        );

        this.setState({
          done: true
        });
      });
    });
  }

  handleTabChange = (event, tabValue) => {
    this.setState({ tabValue });
  };

  render() {
    const { files, downloadLinks, tabValue, status } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <DownloadStatus status={status} toggle={this.toggle} />
          </Grid>
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={this.handleTabChange} fullWidth>
              <Tab label="Files" />
              <Tab label="Details" />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <List dense>
              {files.map((f, i) => (
                <DownloadFileItem
                  key={f.name}
                  fileName={f.name}
                  size={prettyBytes(f.length)}
                  downloadLink={downloadLinks[i]}
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
