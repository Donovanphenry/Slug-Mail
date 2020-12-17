import React from 'react';
import SharedContext from './SharedContext';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import MarkunreadIcon from '@material-ui/icons/Markunread';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DeleteIcon from '@material-ui/icons/Delete';
import {makeStyles} from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';

import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    width: '100%',
  },

  chevronBtn: {
    flexGrow: 1,
  },
  unreadBtn: {
  },
  deleteBtn: {
  },

}));

/**
 * @param {*} id
 */
function fetchToggleRead(id) {
  fetch(`http://localhost:3010/v0/mail/unread/${id}/true`, {
    method: 'PUT',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      })
      .catch((error) => {
        console.log('Error in MailViewerIcon!');
        console.error(error.toString());
      });
}

/**
 * @param {*} emailId
 * @param {*} destinationMailbox
 */
function moveEmail(emailId, destinationMailbox) {
  fetch(`http://localhost:3010/v0/mail/${emailId}?mailbox=${destinationMailbox}`, {
    method: 'PUT',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
      })
      .catch((error) => {
        console.error(error);
      });
}

/**
 * @return {oject} JSX
 */
function MailViewer() {
  const classes = useStyles();
  const history = useHistory();

  const {emailId, boxes, unread, setMailbox} =
    React.useContext(SharedContext);

  const [mailDrawerOpen, setMailDrawerOpen] = React.useState(false);

  const toggleDrawerOpen = () => {
    setMailDrawerOpen(!mailDrawerOpen);
  };

  /**
   *
   */
  function goBackHandle() {
    history.push(`/`);
  }

  /**
   * @param {*} emailId
   * @param {*} destinationMailbox
   */
  function moveEmailClicked(emailId, destinationMailbox) {
    moveEmail(emailId, destinationMailbox);
    history.location.from = destinationMailbox;
    setMailbox(history.location.from);
    setMailDrawerOpen(false);
  }
  /**
   * @param {*} emailId
   * @param {*} destinationMailbox
   */
  function moveEmailToTrashClicked(emailId) {
    moveEmail(emailId, 'Trash');
    history.goBack();
  }
  /**
   * @param {*} emailId
   * @param {*} destinationMailbox
   */
  function markEmailUnreadClicked(emailId) {
    fetchToggleRead(emailId);
    history.goBack();
  }

  return (
    <Box
      display = 'flex'
      className = {classes.iconContainer}
    >
      <Box className = {classes.chevronBtn}>
        <IconButton onClick = {goBackHandle}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Box className = {classes.unreadBtn}>
        <IconButton
          disabled = {unread}
          onClick = {() => markEmailUnreadClicked(emailId)}
        >
          <MarkunreadIcon />
        </IconButton>
      </Box>
      <Box className = {classes.unreadBtn}>
        <IconButton onClick = {toggleDrawerOpen}>
          <MoveToInboxIcon />
        </IconButton>
      </Box>
      <Box className = {classes.deleteBtn}>
        <IconButton onClick = {() => {
          moveEmailToTrashClicked(emailId);
        }}>
          <DeleteIcon />
        </IconButton>
      </Box>

      <Drawer
        className={classes.drawer}
        variant="temporary"
        anchor="top"
        open={mailDrawerOpen}
        onClose={toggleDrawerOpen}
        ModalProps={{keepMounted: true}}
      >

        <List>
          {boxes.map((box) => {
            return (box.name == 'Starred' ? '' :
              <div key = {`div${box.name}`}>
                <ListItem button
                  key={box.name}
                  onClick={() => moveEmailClicked(emailId, box.name)}
                >
                  <ListItemIcon
                    key = {`liIconMVIB${box.name}`}
                  >
                    {box.icon}
                  </ListItemIcon>
                  <ListItemText
                    key = {`liTextMVIB${box.name}`}
                  >
                    <Typography noWrap>
                      {box.name}
                    </Typography>
                  </ListItemText>
                </ListItem>
              </div>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}

export default MailViewer;
