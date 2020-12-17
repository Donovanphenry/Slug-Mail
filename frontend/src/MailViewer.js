import React from 'react';
import {ListItemText, Typography} from '@material-ui/core';
import {List} from '@material-ui/core';
import {ListItem} from '@material-ui/core';
import {ListItemIcon} from '@material-ui/core';
import {ListItemAvatar} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import {Box} from '@material-ui/core';
import MailViewerIconBar from './MailViewerIconBar';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StarIcon from '@material-ui/icons/Star';
import {makeStyles} from '@material-ui/core/styles';

import {useHistory, useLocation} from 'react-router-dom';
import SharedContext from './SharedContext';

const useStyles = makeStyles((theme) => ({
  mailboxTyp: {
    padding: 3,
    backgroundColor: '#cfcfcf',
  },

  subjectTyp: {
    fontWeight: 'bold',
  },

  starMailboxBtn: {
    align: 'top',
    position: 'absolute',
    right: '5%',
  },

  userAv: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
}));
/**
 * @param {*} setCurrentMail
 * @param {*} emailId
 * @param {*} setStarred
 * @param {*} setUnread
 */
function fetchMail(setCurrentMail, emailId, setStarred, setUnread) {
  fetch(`http://localhost:3010/v0/mail/${emailId}`)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        const email = json;
        setStarred(email.starred);
        setUnread(email.unread);
        setCurrentMail(json);
      })
      .catch((error) => {
        setCurrentMail(error.toString());
      });
}
/**
 * @param {*} emailId
 * @param {*} setCurrentMail
 * @param {*} setStarred
 */
function toggleStarred(emailId, setCurrentMail, setStarred) {
  fetch(`http://localhost:3010/v0/mail/starred/${emailId}`, {
    method: 'PUT',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      })
      .then((json) => {
        const email = json;
        setStarred(email.starred);
        setCurrentMail(email);
      })
      .catch((error) => {
        console.error(error);
      });
}

/**
 * @return {oject} JSX
 */
function MailViewer() {
  const history = useHistory();
  const location = useLocation();
  const emailId = location.id;

  const [currentMail, setCurrentMail] = React.useState(undefined);
  const [starred, setStarred] = React.useState(undefined);
  const [unread, setUnread] = React.useState(undefined);
  const {boxes, mailbox, setMailbox} = React.useContext(SharedContext);

  React.useEffect(async () => {
    await fetchMail(setCurrentMail, emailId, setStarred, setUnread);
  }, []);

  let dateDisplayed = null;

  if (currentMail != undefined) {
    const emailDate = new Date(currentMail.received);
    const currentDate = new Date();
    const emailYear = emailDate.getFullYear();
    const emailMonth = emailDate.getMonth();
    const emailDay = emailDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    if (emailYear == currentYear && emailMonth == currentMonth &&
      currentDay == emailDay) {
      dateDisplayed = currentDate.getHours() > 12 ?
        emailDate.getHours() - 12 + + ':' + emailDate.getMinutes() + ' P.M.' :
        emailDate.getHours() + ':' + emailDate.getMinutes() +'A.M.';
    } else if (emailYear == (currentYear - 1) && emailMonth == currentMonth &&
        currentDay == emailDay) {
      dateDisplayed = 'Yesterday';
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const displayedMonth = months[emailDate.getMonth()];
      dateDisplayed = displayedMonth + ' ' + emailDate.getDate();
    }
  }

  const classes = useStyles();

  const reply = () => {
    const sender = mailbox == 'Sent' ? currentMail.to : currentMail.from;
    sender.subject = currentMail.subject;
    history.push({
      pathname: '/compose',
      sender: sender,
    });
  };

  return ( currentMail != undefined ?
    <List margin = '0px' padding = '0px' style = {{width: '100%'}}>
      <ListItem id = 'iconbar' key = 'MailViewerIconBar'>
        <SharedContext.Provider value = {{
          emailId: emailId,
          boxes: boxes,
          setMailbox: setMailbox,
          unread: unread,
          mailbox: mailbox,
        }}>
          <MailViewerIconBar />
        </SharedContext.Provider>
      </ListItem>

      <ListItem id = 'subject'>
        <Typography className = {classes.subjectTyp} noWrap>
          {currentMail.subject}
        </Typography>
      </ListItem>

      <ListItem id = 'mailboxAndStarred' key = 'mailboxAndStarred'>
        <Box
          display = 'flex'
          style = {{width: '100%'}}
        >
          <Typography
            className = {classes.mailboxTyp}
            noWrap
          >
            {mailbox}
          </Typography>

          <IconButton
            className = {classes.starMailboxBtn}
            onClick = {() => toggleStarred(emailId, setCurrentMail, setStarred)}
            style = {{color: starred ? '#e3c74b' : 'black'}}
          >
            {starred ?
              <StarIcon /> : <StarBorderIcon />
            }
          </IconButton>
        </Box>
      </ListItem>

      <ListItem id = 'senderInfoAndReply' key = 'senderInfoAndReply'>
        <ListItemAvatar className = {classes.liAv}>
          <Avatar
            src = {
            currentMail.to.name != 'CSE183 Student' ?
            currentMail.to.avatar : currentMail.from.avatar ?
            currentMail.from.avatar : ''
            }
            className = {classes.userAv}
          >
            {
              currentMail.to.name != 'CSE183 Student' ?
              currentMail.to.avatar ? '' :
              currentMail.to.name.charAt(0) :
              currentMail.from.avatar ? '' :
              currentMail.from.name.charAt(0)
            }
          </Avatar>
        </ListItemAvatar>

        <ListItemText>
          <Typography noWrap>
            {currentMail.to.name != 'CSE183 Student' ?
            `${currentMail.to.name} ${dateDisplayed}` :
            `${currentMail.from.name} ${dateDisplayed}`}
          </Typography>

          <Typography noWrap>
            {currentMail.to.name != 'CSE183 Student' ?
            `${currentMail.to.email}` :
            `${currentMail.from.email}`}
          </Typography>
        </ListItemText>

        <ListItemIcon>
          <IconButton
            onClick = {() => reply()}
          >
            <ArrowBackIcon />
          </IconButton>
        </ListItemIcon>
      </ListItem>

      <ListItem id = 'mailContent' key = 'mailContent'>
        <Typography>
          {currentMail.content}
        </Typography>
      </ListItem>
    </List> : ''
  );
}

export default MailViewer;
