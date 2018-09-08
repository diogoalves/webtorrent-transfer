import React from 'react';
import FolderIcon from '@material-ui/icons/Folder';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DownloadIcon from '@material-ui/icons/GetApp';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const DownloadFileItem = ({ fileName, size }) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar>
        <FolderIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText primary={fileName} secondary={size} />
    <ListItemSecondaryAction>
      <IconButton onClick={() => window.assign('www.google.com')}>
        <DownloadIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export default DownloadFileItem;
