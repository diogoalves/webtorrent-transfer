import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { prettyBytes } from '../utils';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

function FolderList(props) {
  const { classes, files } = props;
  if (!files) return null;
  return (
    <div className={classes.root}>
      <List>
        {Array.from(files).map(e => (
          <ListItem key={e.name} dense button>
            <ListItemText
              primary={e.name}
              secondary={`${prettyBytes(e.size)} ${e.type}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default withStyles(styles)(FolderList);
