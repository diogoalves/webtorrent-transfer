import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  text: {
    position: 'relative',
    top: 87
  },
  circle: {
    position: 'relative'
  }
});

class CircularProgressWithLabel extends Component {
  render() {
    const { classes, progress = 100 } = this.props;
    return (
      <div align="center">
        <Typography className={classes.text} variant="headline">
          {`${progress}%`}
        </Typography>
        <CircularProgress
          className={classes.circle}
          size={144}
          color="secondary"
          variant="determinate"
          value={progress}
        />
      </div>
    );
  }
}

export default withStyles(styles)(CircularProgressWithLabel);
