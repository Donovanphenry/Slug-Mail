import React from 'react';
import {useHistory} from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box';

import EmailPreview from './EmailPreview';

import {makeStyles} from '@material-ui/styles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles(() => ({
  backBtn: {
    position: 'absolute',
    left: '0%',
  },

  cancelBtn: {
    position: 'absolute',
    right: '0%',
  },

  searchField: {
    width: '100%',
    height: '50%',
  },

  inputBase: {
    backgroundColor: '#ededed',
    padding: '5px',
    width: '100%',
  },
}));

/**
 * @param {*} key
 * @param {*} setMailSuggested
 */
function fetchGetByKey(key, setMailSuggested) {
  if (key == false) {
    return;
  }
  fetch(`http://localhost:3010/v0/mail/search/${key}`, {
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
 * @return {*} JSX
 */
function SearchMail() {
  const history = useHistory();
  const classes = useStyles();

  const [searchField, setSearchField] = React.useState('');
  const [mailSuggested, setMailSuggested] = React.useState([]);

  /**
   * @param {*} e
   */
  const keyPressed = (e) => {
    const name = e.target.value.replaceAll(' ', '%20');

    setSearchField(name);
  };

  const cancelSearch = () => {
    setSearchField('');
    setMailSuggested([]);
  };

  /**
   * @param {*} emailId
   * @param {*} destinationMailbox
   */
  function markEmailUnreadClicked(emailId) {
    fetchToggleRead(emailId);
  }

  React.useEffect(() => {
    fetchGetByKey(searchField, setMailSuggested);
  }, ([searchField]));

  return (
    <List style = {{width: '100%'}}>
      <ListItem>
        <Box display = 'flex'
          style = {{width: '100%'}}>
          <Box flexGrow = {1}>
            <IconButton
              onClick = {() => history.goBack()}
              className = {classes.backBtn}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Box>

          <Box flexGrow = {2}>
            <InputBase
              placeholder = 'Search...'
              className = {classes.inputBase}
              onChange = {(e) => keyPressed(e)}
              value = {searchField}
            />
          </Box>

          <Box flexGrow = {1}>
            <IconButton
              className = {classes.cancelBtn}
              onClick = {cancelSearch}
            >
              <CancelIcon />
            </IconButton>
          </Box>
        </Box>
      </ListItem>

      {mailSuggested.length > 0 ? mailSuggested.map((email) => {
        const avatarSrc = email.from.avatar ?
        email.from.avatar : email.from.name.charAt(0);

        return (
          <ListItem key = {`outKey${email.id}`}
            onClick = {() => markEmailUnreadClicked(email.id)}
          >
            <ListItemAvatar
              key = {`liAvSearch${email.id}`}
            >
              <Avatar
                key = {`avSearch${email.id}`}
                src = {avatarSrc.length > 1 ? avatarSrc : undefined}
              >
                {avatarSrc.length == 1 ? avatarSrc : undefined}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary = {<EmailPreview email = {email} />}
              key = {`liTextSearch${email.id}`}
            />
          </ListItem>
        );
      }) : ''}
    </List>
  );
}

export default SearchMail;
