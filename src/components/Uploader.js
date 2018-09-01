import React, { Component } from 'react';
import WebTorrent from 'webtorrent';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Dropzone from 'react-dropzone';

// TODO learn how to create a file list
// TODO send email using emailjs.com
// TODO style hang card in a similar place as wetransfer
// TODO add seed status on page
// TODO try using zip.js to create a protected content
// TODO discover a way
const client = new WebTorrent();

const styles = theme => ({
  card: {
    maxWidth: 300
  },
  actions: {
    display: 'flex'
  }
});

class Uploader extends Component {
  seed = files => {
    client.seed(files, torrent => {
      console.log('Client is seeding ' + torrent.magnetURI);
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Button
              variant="fab"
              color="secondary"
              aria-label="Add"
              className={classes.button}
            >
              <AddIcon />
            </Button>
          }
          title="Add your files"
        />
        <CardContent>
          <Dropzone onDrop={this.seed} />
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <Button
            variant="extendedFab"
            color="secondary"
            className={classes.button}
          >
            Transfer
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(Uploader);
