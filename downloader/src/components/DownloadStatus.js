import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: '20px',
    marginBottom: 60
  },
  circle: {
    color: green[500],
    position: 'absolute',
    top: 15,
    left: 35
  },
  button: {
    color: green[700],
    position: 'absolute',
    top: 25,
    left: 45,
    zIndex: 1
  },
  text: {
    position: 'absolute',
    top: 25,
    left: 145
  }
});

class DownloadStatus extends Component {
  state = {
    done: false,
    torrent: {}
  };

  render() {
    const { classes, status, toggle } = this.props;
    const {
      done = false,
      name = '',
      numPeers = 0,
      downloaded = 0,
      total = 0,
      remaining = 0,
      downloadSpeed = 0,
      uploadSpeed = 0,
      progress = 0
    } = status || {};
    return (
      <div className={classes.root}>
        <IconButton variant="fab" className={classes.button} onClick={toggle}>
          {done && <DoneIcon />}
        </IconButton>
        <CircularProgress
          className={classes.circle}
          size={68}
          color="secondary"
          variant="determinate"
          value={progress}
        />
        <div className={classes.text}>
          <Typography variant="caption">
            {`${done ? 'Seeding' : 'Downloading'} ${name} ${
              done ? 'to' : 'from'
            } ${numPeers}`}
          </Typography>
          <Typography variant="caption">{` ${downloaded} of ${total} - ${remaining}`}</Typography>
          <Typography variant="caption">{` ${Math.round(
            progress
          )}% ↓${downloadSpeed} |  ↑${uploadSpeed}`}</Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DownloadStatus);
