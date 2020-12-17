import React from 'react';

import EmailPreview from './EmailPreview';

import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import SharedContext from './SharedContext';
import {ListItemAvatar, Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing(1),
  },

  mailboxDisplay: {
    fontWeight: 'bold',
    marginBottom: '10px',
    marginTop: '10px',
  },
  // content: {
  //   width: '200px',
  // },

  textFlexBox: {
    // whiteSpace: 'nowrap',
    // overflow: 'hidden',
    textOverflow: 'ellipsis',
    // border: '2px solid red',
  },

  btn: {
    margin: theme.spacing(0),
  },

  starBtn: {
    flexGrow: 1,
    position: 'absolute',
    right: '0%',
  },

  emailDisplayBox: {
    margin: theme.spacing(1),
    flexShrink: 1,
  },
  emailDataBox: {
  },

  outerList: {
    padding: 0,
  },
  liEP: {
    margin: 0,
    paddingLeft: 0,
    paddingRight: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
    borderTop: '1px solid #ededed',
    borderBottom: '1px solid #ededed',
  },

  userAv: {
    marginRight: theme.spacing(1),
    height: theme.spacing(7),
    width: theme.spacing(7),
  },
}));

/**
 * @param {*} id
 */
function fetchToggleRead(id) {
  fetch(`http://localhost:3010/v0/mail/unread/${id}/false`, {
    method: 'PUT',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      })
      .catch((error) => {
        console.log(error.toString());
      });
}

/**
 * @return {object} JSX
 */
function Content() {
  const {mailbox} = React.useContext(SharedContext);
  const {mail, setBoxes} = React.useContext(SharedContext);

  /**
   * @param {*} emailId
   * @param {*} destinationMailbox
   */
  function markEmailUnreadClicked(emailId) {
    fetchToggleRead(emailId);
  }

  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Toolbar/>
      <Typography className = {classes.mailboxDisplay}>
        {mailbox}
      </Typography>

      <List className = {classes.outerList}>
        {mail.length > 0 ? mail.map((email) => {
          const avatarSrc = email.to.name != 'CSE183 Student' ?
          email.to.avatar ?
          email.to.avatar : email.to.name.charAt(0) : email.from.avatar ?
          email.from.avatar : email.from.name.charAt(0);

          return (
            <ListItem key = {`outKey${email.id}`}
              onClick = {() => markEmailUnreadClicked(email.id)}
              className = {classes.liEP}
            >
              <ListItemAvatar
                key = {`liAv${email.id}`}
                className = {classes.userAvOuter}
              >
                <Avatar
                  src = {avatarSrc.length > 1 ? avatarSrc : undefined}
                  className = {classes.userAv}
                  key = {`av${email.id}`}
                >
                  {avatarSrc.length == 1 ? avatarSrc : undefined}
                </Avatar>
              </ListItemAvatar>

              <SharedContext.Provider value ={{
                setBoxes,
              }}>
                <ListItemText
                  primary = {<EmailPreview email = {email} />}
                  key = {`liText${email.id}`}
                />
              </SharedContext.Provider>
            </ListItem>
          );
        }) : ''}

      </List>
    </Paper>
  );
}

export default Content;
