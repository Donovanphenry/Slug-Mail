import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DetailsIcon from '@material-ui/icons/Details';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  fullWidth: {
    width: '100%',
  },

  sendBtn: {
    position: 'absolute',
    right: '0%',
  },

  toField: {
    width: '100%',
  },

  subjectField: {
    width: '100%',
  },
}));

/**
 * @param {*} body
 */
function fetchSendEmail(body) {
  console.log(body);
  fetch(`http://localhost:3010/v0/mail`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(body),
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      })
      .catch((error) => {
        console.error(error);
      });
}
/**
 * @param {*} name
 * @param {*} setMailSuggested
 */
function fetchGetSuggestion(name, setMailSuggested) {
  fetch(`http://localhost:3010/v0/mail/searchByUsername/${name}`, {
    method: 'GET',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      })
      .then((jsonResponse) => {
        const emailRow = jsonResponse;
        setMailSuggested(emailRow);
      })
      .catch((error) => {
        console.error(error);
      });
}

/**
 * @return {*}
 */
function Compose() {
  const history = useHistory();
  const location = useLocation();
  const sender = location.sender;
  const classes = useStyles();

  const [toName, setToName] = React.useState(sender ? sender.name : '');
  const [toEmail, setToEmail] = React.useState(sender ? sender.email : '');
  const [subject, setSubject] = React.useState(sender ? sender.subject : '');
  const [content, setContent] = React.useState('');
  const [recTo, setRecTo] = React.useState(false);
  const [mailSuggested, setMailSuggested] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const backOut = () => {
    if (toName != '' && toEmail != '' && subject != '' &&
      content != '') {
      setOpen(true);
    } else {
      history.push('/');
    }
  };

  const updateTo = (e) => {
    let name = e.target.value;
    setToName(name);
    if (name.length >= 1) {
      name = name.replaceAll(' ', '%20');
      fetchGetSuggestion(name, setMailSuggested);
    }
  };
  const updateSubject = (e) => {
    setSubject(e.target.value);
  };
  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const handleDropDown = () => {
    setRecTo(true);
  };

  const setRecipient = (name, email) => {
    setToName(name);
    setToEmail(email);
    setRecTo(false);
  };

  const sendEmail = () => {
    if (toEmail.length > 0 && toName.length > 0 &&
      subject.length > 0 && content.length > 0) {
      const to = {name: toName, email: toEmail};
      const body = {to: to, subject: subject, content: content};
      fetchSendEmail(body);
      history.goBack();
    }
  };

  const sendToDrafts = () => {
    fetchSendToDrafts();
    history.push('/');
  };

  return (
    <List className = {classes.fullWidth}>
      <ListItem className = {classes.fullWidth}>
        <ListItemText>
          <IconButton onClick = {() => backOut()}>
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            className = {classes.sendBtn}
            onClick = {() => sendEmail()}
          >
            <ArrowForwardIcon />
          </IconButton>
        </ListItemText>
      </ListItem>

      <ListItem>
        <TextField
          label = 'To'
          className = {classes.toField}
          onChange = {updateTo}
          value = {toName ? toName : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment
                width = '100%'
                position="end"
                onClick = {() => handleDropDown()}
              >
                <DetailsIcon />
              </InputAdornment>
            ),
          }}
        >
        </TextField>
      </ListItem>

      <Box display = {recTo ? 'flex' : 'none'}>
        <List>
          {
            mailSuggested == undefined ? '' :
            mailSuggested.map((email) => {
              return (
                <ListItem button
                  key = {email.id}
                  onClick = {() =>
                    setRecipient(email.from.name, email.from.email)
                  }
                >
                  <ListItemAvatar key = {`liAv${email.id}`}>
                    <Avatar
                      key = {`av${email.id}`}
                      src = {email.from.avatar ? email.from.avatar : ''}
                    >
                      {email.from.avatar ? '' : email.from.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    key = {`liText${email.id}`}
                  >
                    {email.from.name}
                  </ListItemText>
                </ListItem>);
            })
          }
        </List>
      </Box>

      <ListItem>
        <Box display = {recTo ? 'none' : 'flex'} style = {{width: '100%'}}>
          <TextField
            className = {classes.subjectField}
            label = 'Subject'
            onChange = {updateSubject}
            fullWidth
            value = {subject ? subject : ''}
          >
          </TextField>
        </Box>
      </ListItem>

      <ListItem>
        <Box display = {recTo ? 'none' : 'flex'} style = {{width: '100%'}}>
          <TextField
            className = {classes.contentField}
            label = 'Content'
            onChange = {updateContent}
            fullWidth
            multiline
          >
          </TextField>
        </Box>
      </ListItem>

      {/* This specific dialog was taken from a material ui sandbox
      and modified to fit the specific needs of this project. Source:
      https://codesandbox.io/s/6r757?file=/demo.js:121-181 */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Warning: You have unsaved information'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Would you like to save this email to your Drafts?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => sendToDrafts()} color="primary">
            Save to Drafts
          </Button>
          <Button onClick={() => history.push('/')} color="primary" autoFocus>
            Don&apos;t Save
          </Button>
        </DialogActions>
      </Dialog>
    </List>
  );
}

export default Compose;
