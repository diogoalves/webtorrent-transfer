import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { prettyBytes } from '../utils';
import UploadFileList from './UploadFileList';
import copy from 'copy-to-clipboard';

// TODO try using zip.js to create a protected content
// TODO try on update insteade of a setInterval
// TODO when the file is big add some loading
// TODO put webtorrent client inside react
const client = new WebTorrent();

const styles = theme => ({
  root: {
    paddingTop: '50px',
    paddingLeft: '50px'
  },
  card: {
    width: '100%',
    maxWidth: 280,
    paddingBottom: '20px'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    display: 'none'
  },
  fabProgress: {
    position: 'relative',
    top: -20,
    zIndex: 1
  },
  textProgress: {
    position: 'relative',
    top: 77,
    zIndex: 1
  }
});

class Uploader extends Component {
  state = {
    files: null,
    infoHash: null,
    magnet: null,
    torrentFile: null,
    torrentFileBlobURL: null,
    uploaded: 0,
    uploadSpeed: 0,
    ratio: 0,
    numPeers: 0,
    graph: {
      nodes: [{ id: 'me', name: 'me' }],
      links: []
    },
    interval: null,
    progress: 0,
    size: 0
  };

  seed = files => {
    const opts = {
      announce: [
        'wss://tracker.openwebtorrent.com',
        'wss://tracker.btorrent.xyz'
      ]
    };
    client.seed(this.state.files, opts, torrent => {
      this.setState({
        infoHash: torrent.infoHash,
        magnet: torrent.magnetURI,
        torrentFile: torrent.torrentFile,
        torrentFileBlobURL: torrent.torrentFileBlobURL
      });
      console.log('Client is seeding ' + torrent.magnetURI);

      var interval = setInterval(() => {
        this.setState({
          numPeers:
            torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers'),
          uploadSpeed: prettyBytes(torrent.uploadSpeed) + '/s',
          uploaded: prettyBytes(torrent.uploaded),
          ratio: torrent.ratio,
          progress: Math.round((torrent.uploaded / this.state.size) * 100)
        });
      }, 1000);
      this.setState({
        interval
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

  handleChange = event => {
    clearInterval(this.state.interval);
    const files = event.target.files;
    const size = Array.from(files).reduce((acc, cur) => acc + cur.size, 0);

    this.setState({
      files: files,
      infoHash: null,
      magnet: null,
      torrentFile: null,
      torrentFileBlobURL: null,
      uploaded: 0,
      uploadSpeed: 0,
      ratio: 0,
      numPeers: 0,
      graph: {
        nodes: [{ id: 'me', name: 'me' }],
        links: []
      },
      interval: null,
      progress: 0,
      size
    });
  };

  copyMagnetToClipboard = () => {
    copy(this.state.magnet);
  };

  downloadTorrent = () => {
    window.location.assign(this.state.torrentFileBlobURL);
  };

  mailMagnetLink = () => {
    const body = `Go to http://downlo.ad/${this.state.magnet}`;
    const url = `mailto:?to=&subject=Some%20files%20were%20shared%20with%20you&body=${body}`;
    window.open(url, '_blank');
  };

  render() {
    const { classes } = this.props;
    const { files, infoHash, numPeers, uploadSpeed, progress } = this.state;
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          {!files && (
            <CardHeader
              avatar={
                <React.Fragment>
                  <input
                    className={classes.input}
                    id="flat-button-file"
                    multiple
                    type="file"
                    onChange={this.handleChange}
                  />
                  <label htmlFor="flat-button-file">
                    <Button
                      variant="fab"
                      color="secondary"
                      aria-label="Add"
                      className={classes.button}
                      component="span"
                    >
                      <AddIcon />
                    </Button>
                  </label>
                </React.Fragment>
              }
              title="Add your files"
            />
          )}

          <CardContent align="center">
            {!infoHash && <UploadFileList files={files} />}

            {infoHash && (
              <React.Fragment>
                <Typography className={classes.textProgress} variant="display2">
                  {progress}
                </Typography>
                <CircularProgress
                  className={classes.fabProgress}
                  size={144}
                  color="secondary"
                  variant="determinate"
                  value={progress}
                />
                <Typography
                >{`Seeding ↑${uploadSpeed} to ${numPeers}`}</Typography>
                <Typography variant="caption">
                  Send someone this link to download. This link will work as
                  long as this page is open.
                </Typography>
              </React.Fragment>
            )}
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            {!infoHash && (
              <Button
                variant="extendedFab"
                color="secondary"
                className={classes.button}
                disabled={!files}
                onClick={this.seed}
              >
                Transfer
              </Button>
            )}
            {infoHash && (
              <React.Fragment>
                <IconButton onClick={this.downloadTorrent}>
                  <GetAppIcon />
                </IconButton>
                <IconButton onClick={this.copyMagnetToClipboard}>
                  <FlashOnIcon />
                </IconButton>
                <IconButton>
                  <ShareIcon onClick={this.mailMagnetLink} />
                </IconButton>
              </React.Fragment>
            )}
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Uploader);
