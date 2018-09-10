import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { prettyBytes } from '../utils';
import UploadFileList from './UploadFileList';
import copy from 'copy-to-clipboard';
import CircularProgressWithLabel from './CircularProgressWIthLabel';
import Tooltip from '@material-ui/core/Tooltip';
import MagnetIcon from './MagnetIcon';

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
    const body = `Go to ${window.location.href}${
      this.state.infoHash
    } or paste the cliboard link`;
    //<a href='javascript:window.open("javascript:(()=>{s=document.createElement(\"script\");s.src=\"https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js\";document.getElementsByTagName(\"head\")[0].appendChild(s);var torrentId = \"magnet:?xt=urn:btih:ab07460e58c38bf6a59a8040d03472cb99d2537c&dn=0fe27a87-282e-4eda-bd05-8e40eead328e.png&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com\";var client;setTimeout(()=>{client = new WebTorrent();client.add(torrentId, (torrent) => {torrent.files.find(file => file.appendTo(\"body\"));torrent.on(\"download\",()=>{document.title = `${Math.round(torrent.progress * 100 * 100) / 100}%`;});torrent.on(\"done\", () => {torrent.files.map((f, i) => f.getBlobURL((err, url) => {var l = document.createElement(\"a\");l.download = f.name;l.href = url;l.click(); console.log(url)}));});});}, 3000);console.log(11) })()")'>Download47</a>
    copy(
      'javascript:window.open("javascript:(()=>{s=document.createElement("script");s.src="https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js";document.getElementsByTagName("head")[0].appendChild(s);var torrentId = "magnet:?xt=urn:btih:ab07460e58c38bf6a59a8040d03472cb99d2537c&dn=0fe27a87-282e-4eda-bd05-8e40eead328e.png&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";var client;setTimeout(()=>{client = new WebTorrent();client.add(torrentId, (torrent) => {torrent.files.find(file => file.appendTo("body"));torrent.on("download",()=>{document.title = `${Math.round(torrent.progress * 100 * 100) / 100}%`;});torrent.on("done", () => {torrent.files.map((f, i) => f.getBlobURL((err, url) => {var l = document.createElement("a");l.download = f.name;l.href = url;l.click(); console.log(url)}));});});}, 3000);console.log(11) })()")'
    );
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
                <CircularProgressWithLabel progress={progress} />
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
                <Tooltip title="Download torrent file">
                  <IconButton onClick={this.downloadTorrent}>
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy magnet link to clipboard">
                  <IconButton onClick={this.copyMagnetToClipboard}>
                    <MagnetIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Email download link">
                  <IconButton>
                    <EmailIcon onClick={this.mailMagnetLink} />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )}
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Uploader);
