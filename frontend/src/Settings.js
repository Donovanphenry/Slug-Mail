import React from 'react';
import {useHistory} from 'react-router-dom';

import SharedContext from './SharedContext';

import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';

import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  saveBtn: {
    position: 'absolute',
    right: '0%',
  },

  entityList: {
    width: '100%',
    margin: '0%',
    padding: '0%',
  },

  btnListItem: {
    width: '100%',
    margin: '0%',
    padding: '0%',
  },

  btnBar: {
    width: '100%',
    margin: '0%',
    padding: '0%',
  },

  inputBox: {
    backgroundColor: '#ededed',
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },

  newAvatContainer: {
    display: 'flex',
    flexDirection: 'column',
  },

  submitBtnBox: {
    flexGrow: 1,
    backgroundColor: '#ededed',
    margin: theme.spacing(2),
  },

  submitBtn: {
    width: '100%',
  },

  userName: {
    fontWeight: 'bold',
  },
}));

/**
 * @return {*}
 */
function Settings() {
  const history = useHistory();
  const classes = useStyles();

  const {userAvatar, setUserAvatar} = React.useContext(SharedContext);
  const {userName, setUserName} = React.useContext(SharedContext);

  const [userChange, setUserChange] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [avatarSrc, setAvatarSrc] = React.useState(userAvatar);
  const [userNameVal, setUserNameVal] = React.useState(userName);
  const [avatarDialOpen, setAvatarDialOpen] = React.useState(false);
  const [userNameDialOpen, setUserNameDialOpen] = React.useState(false);

  const backClicked = () => {
    if (userChange) {
      setOpen(true);
    } else {
      history.push('/');
    }
  };

  const updateNameVal = (e) => {
    setUserNameVal(e.target.value);
    setUserChange(true);
  };

  const updateAvatar = (e) => {
    setAvatarSrc(e.target.value);
    setUserChange(true);
  };

  const changeAvatarSource = () => {
    setUserAvatar(avatarSrc);
    setAvatarDialOpen(false);
    setUserChange(true);
  };

  const changeUserName = () => {
    setUserName(userNameVal);
    setUserNameDialOpen(false);
    setUserChange(true);
  };

  const changeUserInfo = () => {
    changeUserName();
    changeAvatarSource();
    history.push('/');
  };

  return (
    <List className = {classes.entityList}>
      <ListItem className = {classes.btnListItem}>
        <ListItemText className = {classes.btnBar}>
          <IconButton
            onClick = {() => backClicked()}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            className = {classes.saveBtn}
            onClick = {() => changeUserInfo()}
          >
            <SaveIcon />
          </IconButton>
        </ListItemText>
      </ListItem>

      <ListItem>
        <ListItemAvatar onClick = {() => setAvatarDialOpen(true)}>
          <Avatar src = {avatarSrc} />
        </ListItemAvatar>
        <ListItemText onClick = {() => setUserNameDialOpen(true)}>
          <Typography className = {classes.userName}>
            {userNameVal}
          </Typography>

          <Typography>
            cse183student@ucsc.edu
          </Typography>
        </ListItemText>
      </ListItem>

      {/* This specific dialog was taken from a material ui sandbox
      and modified to fit the specific needs of this project. Source:
      https://codesandbox.io/s/6r757?file=/demo.js:121-181 */}
      <Dialog
        open={open}
        onClose={() => setUserChange(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Warning: You have unsaved information'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Would you like to save your new user information?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => changeUserInfo()} color="primary">
            Save
          </Button>
          <Button onClick={() => history.push('/')} color="primary" autoFocus>
            Don&apos;t Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open = {userNameDialOpen}
        onClose = {() => setUserNameDialOpen(false)}
      >
        <Box className = {classes.newAvatContainer}>
          <Box className = {classes.cancelNewAv}>
            <IconButton
              onClick = {() => setUserNameDialOpen(false)}
            >
              <CancelIcon />
            </IconButton>
          </Box>
          <Box className = {classes.inputBox}>
            <InputBase
              placeholder="Enter new user name..."
              inputProps={{'aria-label': 'search'}}
              onChange = {(e) => updateNameVal(e)}
            />
          </Box>

          <Box className = {classes.submitBtnBox}>
            <Button
              className = {classes.submitBtn}
              onClick = {() => setUserNameDialOpen(false)}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Dialog
        open = {avatarDialOpen}
        onClose = {() => setAvatarDialOpen(false)}
      >
        <Box className = {classes.newAvatContainer}>
          <Box className = {classes.cancelNewAv}>
            <IconButton
              onClick = {() => setAvatarDialOpen(false)}
            >
              <CancelIcon />
            </IconButton>
          </Box>
          <Box className = {classes.inputBox}>
            <InputBase
              placeholder="Enter URL of new avatar"
              inputProps={{'aria-label': 'search'}}
              onChange = {(e) => updateAvatar(e)}
            />
          </Box>

          <Box className = {classes.submitBtnBox}>
            <Button
              onClick = {() => setAvatarDialOpen(false)}
              className = {classes.submitBtn}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Dialog>
    </List>
  );
}

export default Settings;
