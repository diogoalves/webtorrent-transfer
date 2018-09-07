import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: '20px'
  },
  circle: {}
});

class DownloadStatus extends Component {
  state = {
    done: false,
    torrent: {}
  };
  render() {
    const { classes, status } = this.props;
    const {
      done = false,
      torrent = { name: '' },
      numPeers = 0,
      downloaded = 0,
      total = 0,
      remaining = 0,
      downloadSpeed = 0,
      uploadSpeed = 0,
      progress = 0
    } =
      status || {};
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={2}>
            <CircularProgress
              className={classes.circle}
              size={60}
              color="secondary"
              variant="determinate"
              value={progress}
            />
          </Grid>
          <Grid item xs={10}>
            <div>
              <Typography variant="caption">
                {`${done ? 'Seeding' : 'Downloading'} ${
                  torrent.name
                } from ${numPeers}`}
              </Typography>
              <Typography variant="caption">{` ${downloaded} of ${total} - ${remaining}`}</Typography>
              <Typography variant="caption">{` ↓${downloadSpeed} |  ↑${uploadSpeed}`}</Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(DownloadStatus);
